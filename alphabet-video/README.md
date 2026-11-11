# Das deutsche Alphabet – Lehrvideo (16:9)

Ein ca. 19-minütiges Lernvideo in 1920×1080: alle Buchstaben A–Z, Ä Ö Ü ß, lange und kurze
Vokale, Doppellaute (ei, ie, au, eu/äu), Buchstaben-Teams (sch, st, sp, ch, chs, ck, tz, pf, qu,
ng, -ung, nk, ph, th, -tion, tsch), knifflige Fälle (S/Z, ß/ss, V, W, J, Y, C, b/d/g am Wortende,
-ig, -er), Buchstabieren, ein Aussprache-Quiz und eine Wiederholung des ganzen ABCs.
Jede Regel hat Beispielwörter mit Artikel und Bild (Emoji); nach jedem Wort folgt eine kurze
Pause zum Nachsprechen.

## Aufbau

| Datei | Inhalt |
|---|---|
| `content.mjs` | Drehbuch: alle 88 Szenen mit gesprochenem Text und Beispielwörtern |
| `player.html` | Szenen-Design und Animationen (HTML/CSS) |
| `build.mjs` | Timing, Bild-für-Bild-Rendering (Playwright) und Videoschnitt (ffmpeg) |
| `mix_audio.py` | Tonspur: Stimme + Soundeffekte + leise Hintergrundmusik |
| `tts_elevenlabs.mjs` | Erzeugt alle Sprecher-Clips über die ElevenLabs-API |
| `voiceover/skript.md` | Sprecher-Skript: Text pro Szene mit Dateiname |

## Stimme hinzufügen

Für jede Szene gehört eine Datei nach `audio/<ID>.mp3` (die IDs stehen in `voiceover/skript.md`).

**Automatisch** (eigener ElevenLabs-API-Schlüssel):

```bash
ELEVENLABS_API_KEY=... node tts_elevenlabs.mjs
```

**Manuell:** den Text jeder Szene aus `voiceover/skript.md` in ElevenLabs vertonen
(Modell *eleven_v4*, Stimme „Toni – Klar & Engagiert Bildungsstimme“) und als
`audio/<ID>.mp3` speichern. Fehlende Clips sind kein Problem: Die Szene wird dann nach
Textlänge getaktet und bleibt stumm.

Beim Bauen werden die Aufnahmen an ihren Sprechpausen geschnitten, damit jedes Bild genau zum
gesprochenen Wort erscheint und nach jedem Beispielwort Zeit zum Nachsprechen bleibt.

## Video bauen

```bash
node build.mjs                      # komplettes Video -> build/deutsches-alphabet.mp4
node build.mjs --only intro,letter-a  # nur einzelne Szenen -> build/test.mp4
node build.mjs --stills             # ein Standbild pro Szene (schnelle Kontrolle)
node build.mjs --no-captions        # ohne Untertitel
MUSIC=0 node build.mjs              # ohne Hintergrundmusik
```

Benötigt: Node 18+, Playwright mit Chromium, ffmpeg, Python 3 mit numpy.
Kapitelmarken für YouTube landen in `build/kapitel.txt`.

Schriften: Fredoka, Nunito und Caveat (SIL Open Font License, siehe `assets/fonts`).
