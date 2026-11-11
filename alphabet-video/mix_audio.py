#!/usr/bin/env python3
"""Mischt die Tonspur: Sprecher-Clips + synthetische Soundeffekte + leise Hintergrundmusik.

Aufruf: mix_audio.py <mix.json> <out.wav>
Umgebungsvariablen: MUSIC=0 schaltet die Hintergrundmusik ab, MUSIC_DB setzt ihre Lautstärke.
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def bell(freq, dur=1.2, partials=((1, 1), (2.0, .5), (3.0, .25), (4.2, .15))):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, a in partials:
        out += a * np.sin(2 * np.pi * freq * k * t) * env_exp(n, dur / (2 + k))
    out[: int(.004 * SR)] *= np.linspace(0, 1, int(.004 * SR))
    return out / np.abs(out).max()


def sfx_pop():
    n = int(.09 * SR)
    t = np.arange(n) / SR
    f = 520 + (980 - 520) * (t / t[-1])
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * env_exp(n, .025)
    s[:130] *= np.linspace(0, 1, 130)
    return .22 * s


def sfx_whoosh():
    n = int(.5 * SR)
    noise = rng.standard_normal(n)
    k = 40
    low = np.convolve(noise, np.ones(k) / k, mode='same')
    band = low - np.convolve(low, np.ones(400) / 400, mode='same')
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return .07 * band / (np.abs(band).max() + 1e-9) * e


def sfx_tick():
    n = int(.06 * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * 1500 * t) + .4 * np.sin(2 * np.pi * 2900 * t)) * env_exp(n, .012)
    return .26 * s / np.abs(s).max()


def sfx_ding():
    return .24 * bell(1046.5, 1.6)


def sfx_chime():
    out = np.zeros(int(1.8 * SR))
    for i, f in enumerate([523.25, 659.25, 783.99, 1046.5]):
        b = bell(f, 1.3)
        o = int(i * .11 * SR)
        out[o:o + len(b)] += b[: len(out) - o]
    return .17 * out / np.abs(out).max()


SFX = {'pop': sfx_pop(), 'whoosh': sfx_whoosh(), 'tick': sfx_tick(), 'ding': sfx_ding(), 'chime': sfx_chime()}


def add(buf, sig, t):
    o = int(round(t * SR))
    if o < 0:
        sig = sig[-o:]
        o = 0
    if o >= len(buf):
        return
    m = min(len(sig), len(buf) - o)
    buf[o:o + m] += sig[:m]


def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def music(n):
    """Sanfter Klangteppich: C – G – Am – F mit leisem Arpeggio (92 BPM)."""
    bpm = 92
    beat = 60 / bpm
    chord_len = 4 * beat
    chords = [  # Grundton-Pad (Hz), Arpeggio-Töne (Hz)
        ([130.81, 164.81, 196.00], [523.25, 659.25, 783.99, 659.25]),
        ([98.00, 123.47, 146.83], [493.88, 587.33, 783.99, 587.33]),
        ([110.00, 130.81, 164.81], [440.00, 523.25, 659.25, 523.25]),
        ([87.31, 110.00, 130.81], [440.00, 523.25, 698.46, 523.25]),
    ]
    out = np.zeros(n)
    cl = int(chord_len * SR)
    # Pad-Bausteine vorberechnen
    t = np.arange(cl + int(1.0 * SR)) / SR
    att = np.minimum(1, t / .9)
    rel = np.clip((chord_len + 1.0 - t) / 1.0, 0, 1)
    pad_env = att * rel
    pads, arps = [], []
    for root, arp in chords:
        p = np.zeros_like(t)
        for f in root:
            for det in (-.6, .6):
                p += np.sin(2 * np.pi * (f + det) * t) + .25 * np.sin(2 * np.pi * 2 * (f + det) * t)
        pads.append(p * pad_env / 12)
        a = np.zeros(cl + SR)
        for i in range(8):
            f = arp[i % 4]
            nn = int(.6 * SR)
            tt = np.arange(nn) / SR
            note = (np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt / .18)
            note[:60] *= np.linspace(0, 1, 60)
            o = int(i * beat / 2 * SR)
            a[o:o + nn] += note * (.9 if i % 2 == 0 else .6)
        arps.append(a / 10)
    k = 0
    pos = 0
    while pos < n:
        p, a = pads[k % 4], arps[k % 4]
        m = min(len(p), n - pos)
        out[pos:pos + m] += p[:m]
        m2 = min(len(a), n - pos)
        out[pos:pos + m2] += a[:m2]
        pos += cl
        k += 1
    # sanft ein- und ausblenden
    fi = min(n, 3 * SR)
    out[:fi] *= np.linspace(0, 1, fi)
    out[-fi:] *= np.linspace(1, 0, fi)
    return out


def main():
    mix = json.load(open(sys.argv[1]))
    out_path = sys.argv[2]
    n = int(np.ceil(mix['total'] * SR)) + SR
    voice = np.zeros(n)
    fx = np.zeros(n)
    for s in mix['scenes']:
        g = s['gstart']
        if s.get('audio'):
            clip = decode(s['audio']['file'])
            for seg in s['segs']:
                part = clip[int(seg['from'] * SR):int(seg['to'] * SR)].copy()
                f = min(len(part) // 2, int(.006 * SR))
                if f > 0:
                    part[:f] *= np.linspace(0, 1, f)
                    part[-f:] *= np.linspace(1, 0, f)
                add(voice, part, g + seg['at'])
        for e in s['sfx']:
            add(fx, SFX[e['k']], g + e['t'])

    total = fx.copy()
    vp = np.abs(voice).max()
    if vp > 0:
        voice *= 0.89 / vp
    total += voice

    if os.environ.get('MUSIC', '1') != '0':
        bed = music(n)
        bed /= np.abs(bed).max() + 1e-9
        level = 10 ** (float(os.environ.get('MUSIC_DB', '-25')) / 20)
        # Ducking: Musik leiser, während gesprochen wird
        if vp > 0:
            w = int(.25 * SR)
            envv = np.convolve(np.abs(voice), np.ones(w) / w, mode='same')
            duck = 1 - .55 * np.clip(envv / .03, 0, 1)
            sm = int(.4 * SR)
            duck = np.convolve(duck, np.ones(sm) / sm, mode='same')
        else:
            duck = 1
        total += bed * level * duck

    peak = np.abs(total).max()
    if peak > .97:
        total *= .97 / peak
    pcm = (np.clip(total, -1, 1) * 32767).astype(np.int16)
    stereo = np.repeat(pcm[:, None], 2, axis=1)
    with wave.open(out_path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(stereo.tobytes())
    print(f'Audio: {out_path} ({len(pcm) / SR / 60:.1f} min)')


if __name__ == '__main__':
    main()
