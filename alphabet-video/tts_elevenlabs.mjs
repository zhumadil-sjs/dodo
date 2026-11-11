#!/usr/bin/env node
// Erzeugt alle Sprecher-Clips mit der ElevenLabs-API: audio/<szenen-id>.mp3
//
//   ELEVENLABS_API_KEY=... node tts_elevenlabs.mjs            # alle fehlenden Clips
//   ELEVENLABS_API_KEY=... node tts_elevenlabs.mjs letter-a   # nur bestimmte Szenen (überschreibt)
//
// Optional: VOICE_ID (Standard: Toni – Klar & Engagiert Bildungsstimme), MODEL (Standard: eleven_v4).
// Bereits vorhandene Dateien werden übersprungen, d. h. das Skript kann jederzeit fortgesetzt werden.
import { SCENES } from './content.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = process.env.VOICE_ID || 'hEo1DUrbbZe9a5njQT9L';
const MODEL = process.env.MODEL || 'eleven_v4';
const only = process.argv.slice(2);
if (!KEY) { console.error('Bitte ELEVENLABS_API_KEY setzen.'); process.exit(1); }

const tags = /^eleven_v[34]/.test(MODEL);
const text = sc => {
  const t = sc.beats.map(b => typeof b === 'string' ? b : (tags ? '[long pause]' : '... ... ...')).join(' ');
  return tags ? t : t.replace(/\[[^\]]*\]\s*/g, ''); // ältere Modelle würden [excited] mitsprechen
};

const out = path.join(DIR, 'audio');
fs.mkdirSync(out, { recursive: true });
for (const sc of SCENES) {
  if (only.length && !only.includes(sc.id)) continue;
  const file = path.join(out, `${sc.id}.mp3`);
  if (!only.length && fs.existsSync(file)) continue;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ text: text(sc), model_id: MODEL, language_code: 'de' }),
  });
  if (!res.ok) { console.error(`${sc.id}: HTTP ${res.status} ${await res.text()}`); process.exit(1); }
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log('✓', sc.id);
}
console.log('Fertig. Jetzt: node build.mjs');
