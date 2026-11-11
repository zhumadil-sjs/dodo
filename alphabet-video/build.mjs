#!/usr/bin/env node
// Baut das Video: Timing -> Einzelbilder (Playwright) -> Szenen-Clips (ffmpeg) -> Audio-Mix -> fertiges MP4.
//
//   node build.mjs                 # komplettes Video
//   node build.mjs --only intro,letter-a   # nur einzelne Szenen (Test)
//   node build.mjs --stills        # nur ein Standbild pro Szene (schnelle Kontrolle)
//   node build.mjs --no-captions   # ohne Untertitel
//   node build.mjs --script        # nur das Sprecher-Skript exportieren
//
// Sprachaufnahmen: audio/<szenen-id>.mp3 (oder .wav). Fehlt eine Datei, wird das
// Timing aus der Textlänge geschätzt und die Szene bleibt stumm (nur Effekte).
import { SCENES } from './content.mjs';
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = k => args.includes(k);
const val = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };

const FPS = Number(val('--fps', 30));
const WORKERS = Number(val('--workers', 3));
const CAPTIONS = !opt('--no-captions');
const ONLY = val('--only', '') ? val('--only').split(',') : null;
const OUT = path.join(DIR, val('--out', 'build'));
const AUDIO_DIR = path.join(DIR, 'audio');
const LEAD = 0.55, TAIL = 0.85, CPS = 13.5, GAP = 0.35;

fs.mkdirSync(OUT, { recursive: true });

// ---------- Text ----------
const stripTags = s => s.replace(/\[[^\]]*\]\s*/g, '').trim();
// "S-C-H" -> "sch", "I-E" -> "ie" (für die Untertitel; die Stimme bekommt die Buchstaben einzeln)
const caption = s => stripTags(s).replace(/(?<![\wÄÖÜäöüß-])[A-ZÄÖÜ](?:-[A-ZÄÖÜ])+(?![\wÄÖÜäöüß-])/g, m => m.replace(/-/g, '').toLowerCase());
export const ttsText = sc => sc.beats.map(b => typeof b === 'string' ? b : '[long pause]').join(' ');

function writeScript() {
  const vo = path.join(DIR, 'voiceover');
  fs.mkdirSync(vo, { recursive: true });
  let md = '# Sprecher-Skript – Das deutsche Alphabet\n\n' +
    'Pro Szene eine Datei erzeugen und als `audio/<ID>.mp3` speichern.\n' +
    'Empfehlung: ElevenLabs, Modell **eleven_v4**, Stimme „Toni – Klar & Engagiert Bildungsstimme“.\n' +
    'Wörter in eckigen Klammern wie [excited] sind Regieanweisungen für eleven_v4 (bei älteren Modellen weglassen).\n\n';
  let total = 0;
  const json = [];
  SCENES.forEach((sc, i) => {
    const t = ttsText(sc);
    total += t.length;
    json.push({ nr: i + 1, id: sc.id, text: t });
    md += `## ${String(i + 1).padStart(2, '0')} · \`${sc.id}\`\n\n${t}\n\n`;
  });
  md += `---\nGesamt: ${SCENES.length} Szenen, ${total} Zeichen.\n`;
  fs.writeFileSync(path.join(vo, 'skript.md'), md);
  fs.writeFileSync(path.join(vo, 'skript.json'), JSON.stringify(json, null, 2));
  console.log(`Skript: ${SCENES.length} Szenen, ${total} Zeichen -> voiceover/skript.md`);
}

// ---------- Audio-Analyse ----------
function findAudio(id) {
  for (const ext of ['.mp3', '.wav', '.m4a']) {
    const p = path.join(AUDIO_DIR, id + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}
function probeDur(file) {
  return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());
}
function silences(file) {
  const r = spawnSyncStderr('ffmpeg', ['-hide_banner', '-i', file, '-af', 'silencedetect=noise=-34dB:d=0.16', '-f', 'null', '-']);
  const out = []; let s = null;
  for (const line of r.split('\n')) {
    let m = line.match(/silence_start: ([\d.]+)/); if (m) s = Number(m[1]);
    m = line.match(/silence_end: ([\d.]+)/); if (m && s != null) { out.push([s, Number(m[1])]); s = null; }
  }
  return out;
}
function spawnSyncStderr(cmd, a) {
  try { execFileSync(cmd, a, { stdio: ['ignore', 'ignore', 'pipe'] }); return ''; }
  catch (e) { return e.stderr?.toString() || ''; }
}
function speechBounds(file) { // erste/letzte Sprache (Stille am Rand abschneiden)
  const d = probeDur(file), sil = silences(file);
  let a = 0, b = d;
  if (sil.length && sil[0][0] < 0.05) a = sil[0][1];
  if (sil.length && sil[sil.length - 1][1] > d - 0.05) b = sil[sil.length - 1][0];
  return { d, a, b, sil };
}

// ---------- Timing ----------
// Nachsprech-Pause nach einem Beat (Sekunden)
function padFor(sc, i) {
  const n = sc.beats.length;
  switch (sc.type) {
    case 'letter': return i === 0 ? 0.9 : i <= 3 ? 1.0 : 0.3;
    case 'rule': return i === 0 ? 0.6 : i <= sc.words.length ? 1.0 : 0.3;
    case 'compare': return i === 0 ? 0.4 : i <= sc.cols.length ? 0.9 : 0.3;
    case 'spell': return 0.5;
    case 'recap': return 0.5;
    case 'chapter': return 0.15;
    default: return i === n - 1 ? 0.2 : 0.3;
  }
}

function timeScene(sc, idx) {
  const est = sc.beats.map(b => typeof b === 'string' ? stripTags(b).length / CPS + 0.2 : b.pause);
  const audio = findAudio(sc.id);
  let segDur = est, segs = null, audioInfo = null;
  if (audio) {
    const { d, a, b, sil } = speechBounds(audio);
    audioInfo = { file: audio, d };
    const speech = b - a;
    const tot = est.reduce((x, y) => x + y, 0);
    const cuts = [a];
    let acc = 0;
    for (let i = 1; i < est.length; i++) {
      acc += est[i - 1];
      const guess = a + speech * acc / tot, prev = cuts[i - 1];
      // auf die nächste Sprechpause im Audio einrasten
      let best = null;
      for (const [s0, s1] of sil) {
        if (s0 <= prev + 0.15 || s1 >= b) continue;
        const mid = Math.max((s0 + s1) / 2, s1 - 0.12);
        if (Math.abs(mid - guess) < 1.8 && (!best || Math.abs(mid - guess) < Math.abs(best - guess))) best = mid;
      }
      cuts.push(Math.max(prev + 0.2, Math.min(b - 0.1, best ?? guess)));
    }
    cuts.push(Math.min(d, b + 0.15));
    segs = est.map((_, i) => ({ from: cuts[i], to: cuts[i + 1] }));
    segDur = segs.map((g, i) => typeof sc.beats[i] === 'string' ? g.to - g.from : Math.max(g.to - g.from, sc.beats[i].pause));
  }
  let t = LEAD;
  const beats = sc.beats.map((b, i) => {
    const start = t;
    if (segs) segs[i].at = start;
    t += segDur[i];
    const end = t;
    if (i < sc.beats.length - 1) t += padFor(sc, i);
    return { start, end, send: end, cap: typeof b === 'string' ? caption(b) : '', pause: typeof b !== 'string' };
  });
  // Beat-Ende = Beginn des nächsten Beats (für Untertitel / Karaoke)
  beats.forEach((bt, i) => { if (i + 1 < beats.length) bt.end = beats[i + 1].start; });
  return { id: sc.id, idx, dur: t + TAIL, beats, audio: audioInfo, segs };
}

function buildTimeline() {
  let frames = 0;
  const tl = SCENES.map((sc, i) => {
    const t = timeScene(sc, i);
    t.frames = Math.round(t.dur * FPS);
    t.dur = t.frames / FPS;
    t.gstart = frames / FPS;
    frames += t.frames;
    t.color = sc.type === 'letter' ? (sc.idx % 7) : (i % 7);
    t.captions = CAPTIONS;
    t.sfx = sfxFor(sc, t);
    return t;
  });
  return { fps: FPS, total: frames / FPS, scenes: tl };
}

function sfxFor(sc, t) {
  const ev = [];
  if (sc.type === 'chapter') ev.push({ t: 0.15, k: 'chime' });
  else ev.push({ t: 0.02, k: 'whoosh' });
  t.beats.forEach((b, i) => {
    if (b.pause) {
      const L = b.send - b.start;
      [0, 1, 2].forEach(n => ev.push({ t: b.start + 0.2 + n * (L - 0.3) / 3, k: 'tick' }));
    } else if (sc.type === 'quiz' && i === 2) ev.push({ t: b.start, k: 'ding' });
    else if (i > 0 && !['recap', 'spell'].includes(sc.type) && !(sc.type === 'title' && i === 1)) ev.push({ t: b.start + 0.05, k: 'pop' });
  });
  if (sc.type === 'spell') {
    const bt = t.beats[1]; const w = sc.names.map(n => n.length + 2); const tot = w.reduce((a, c) => a + c, 0); let acc = 0;
    sc.names.forEach((n, i) => { ev.push({ t: bt.start + (bt.send - bt.start) * acc / tot, k: 'pop' }); acc += w[i]; });
    ev.push({ t: t.beats[2].start, k: 'ding' });
  }
  if (sc.type === 'outro') ev.push({ t: 0.3, k: 'chime' });
  return ev;
}

// ---------- Rendering ----------
async function render(tl, list, stills) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const sceneDir = path.join(OUT, 'scenes'); fs.mkdirSync(sceneDir, { recursive: true });
  const stillDir = path.join(OUT, 'stills'); if (stills) fs.mkdirSync(stillDir, { recursive: true });
  const queue = [...list];
  const url = pathToFileURL(path.join(DIR, 'player.html')).href;
  let done = 0; const t0 = Date.now();

  async function worker() {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    await page.goto(url);
    while (queue.length) {
      const i = queue.shift();
      const sc = SCENES[i], t = tl.scenes[i];
      await page.evaluate(([s, tt]) => window.setup(s, tt), [sc, t]);
      await page.evaluate(() => document.fonts.ready);
      if (stills) {
        const at = Math.max(0.5, t.dur - 1.0);
        await page.evaluate(x => window.seek(x), at);
        await page.screenshot({ path: path.join(stillDir, `${String(i + 1).padStart(3, '0')}_${sc.id}.png`) });
      } else {
        const out = path.join(sceneDir, `${String(i + 1).padStart(3, '0')}.mp4`);
        const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-threads', '2', out], { stdio: ['pipe', 'inherit', 'inherit'] });
        const closed = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
        for (let f = 0; f < t.frames; f++) {
          await page.evaluate(x => window.seek(x), f / FPS);
          const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
          if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
        }
        ff.stdin.end();
        await closed;
      }
      done++;
      const el = (Date.now() - t0) / 1000;
      console.log(`[${done}/${list.length}] ${sc.id} (${t.dur.toFixed(1)}s) – ${el.toFixed(0)}s`);
    }
    await page.close();
  }
  await Promise.all(Array.from({ length: Math.min(WORKERS, list.length) }, worker));
  await browser.close();
}

function finish(tl, list) {
  const sceneDir = path.join(OUT, 'scenes');
  const listFile = path.join(OUT, 'concat.txt');
  fs.writeFileSync(listFile, list.map(i => `file '${path.join(sceneDir, String(i + 1).padStart(3, '0') + '.mp4')}'`).join('\n'));
  // Teil-Timeline (bei --only) neu takten, damit Audio passt
  let g = 0;
  const sub = { fps: FPS, scenes: list.map(i => { const s = { ...tl.scenes[i], gstart: g }; g += s.dur; return s; }) };
  sub.total = g;
  fs.writeFileSync(path.join(OUT, 'mix.json'), JSON.stringify(sub));
  execFileSync('python3', [path.join(DIR, 'mix_audio.py'), path.join(OUT, 'mix.json'), path.join(OUT, 'audio.wav')], { stdio: 'inherit' });
  const final = path.join(OUT, ONLY ? 'test.mp4' : 'deutsches-alphabet.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', listFile, '-i', path.join(OUT, 'audio.wav'),
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], { stdio: 'inherit' });
  console.log('Fertig:', final, `(${(g / 60).toFixed(1)} min)`);
  // Kapitelmarken für YouTube
  if (!ONLY) {
    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    const lines = tl.scenes.filter((s, i) => i === 0 || SCENES[i].type === 'chapter' || ['recap', 'outro'].includes(SCENES[i].type))
      .map(s => { const sc = SCENES[s.idx]; return `${fmt(s.gstart)} ${sc.type === 'chapter' ? `Kapitel ${sc.num}: ${sc.title}` : sc.type === 'title' ? 'Intro' : sc.type === 'recap' ? 'Wiederholung: das ganze ABC' : 'Abschluss'}`; });
    fs.writeFileSync(path.join(OUT, 'kapitel.txt'), lines.join('\n') + '\n');
  }
}

// ---------- Main ----------
writeScript();
if (opt('--script')) process.exit(0);
const tl = buildTimeline();
fs.writeFileSync(path.join(OUT, 'timeline.json'), JSON.stringify(tl, null, 1));
const withAudio = tl.scenes.filter(s => s.audio).length;
console.log(`Timeline: ${tl.scenes.length} Szenen, ${(tl.total / 60).toFixed(1)} min, Audio für ${withAudio} Szenen`);
const list = ONLY ? SCENES.map((s, i) => ONLY.includes(s.id) ? i : -1).filter(i => i >= 0) : SCENES.map((_, i) => i);
await render(tl, list, opt('--stills'));
if (!opt('--stills')) finish(tl, list);
