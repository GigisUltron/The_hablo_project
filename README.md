# sema

A language-learning demo that **never shows a translation**.

Each concept arrives as a pair — the picture, the word, the sound — with no English gloss
anywhere in the data. Then the quiz hides one half and asks you for the other. What you miss
comes back before the session ends.

Spanish, 42 concepts and 60 phrases, spaced repetition, a semantic map, a lesson builder, and
audio that ships with the app instead of depending on your operating system.

![sema — the Today view](docs/preview.png)

## Run it

Nothing to install. No build step, no dependencies, no network calls after load.

```sh
python3 serve.py
```

That picks the first free port from 8080, prints the URL, opens your browser, and disables
caching so edits show up on reload.

```sh
python3 serve.py --port 9000     # pin a port
python3 serve.py --no-open       # don't launch a browser
make serve                       # same thing
```

Open the printed `http://localhost:…` URL rather than the file directly: browsers gate
microphone access behind a secure context and `file://` doesn't qualify.

Deep links: `#practice` (start a lesson), `#phrases` (phrase lesson), `#quiz`, `#map`, `#stats`.

## How it teaches

1. **Meet the pair.** Picture, word, article, sentence and sound together — that is where the
   association forms. No translation at any point.
2. **Get quizzed.** One half is hidden: word from picture, picture from word, or say it aloud.
3. **Miss and repeat.** A wrong answer is pushed to the back of the same quiz, and scheduled
   ten minutes out rather than tomorrow.

The Today screen is deliberately one button: **Start lesson**, eight cards, about a minute.
Everything else — words or phrases, which fields, session length, mistake review — hides
behind *Tune the lesson* so it cannot distract from starting.

What the screen shows is only what earns a return visit: cards due, the streak, how many
words you know, and how many are solid.

## Verify it

```sh
make check          # syntax gate + full suite
node --test tests/  # 31 tests, stdlib only
```

## Layout

```
index.html            shell, four views
serve.py              local preview server (standard library)
Makefile              make serve / make test / make check
assets/styles.css     the whole visual system — no external fonts, icons or images
assets/audio/         pre-rendered WAVs + manifest.js
src/data.js           42 concepts + semantic relations
src/phrases.js        phrases, with a scene emoji instead of a translation
src/srs.js            scheduling + matching (pure, testable)
src/app.js            views, lesson flow, quiz, speech, map, stats
tools/make_audio.py   regenerates the audio from the dataset (build time only)
tests/                node:test suites
docs/PARALLEL.md      how to run this with three agents at once
DEMO.md               design notes, decisions and honest limits
```

## Design notes

- **No gloss field exists in the data** — not hidden, absent. The app cannot show a
  translation, and a test fails if one is added.
- **Audio is pre-rendered.** Browser speech synthesis needs a voice installed by the OS, and
  many machines have none, which is silence with no error. The WAVs remove that dependency;
  synthesis is only a fallback.
- **The voice is eSpeak by default** — clear, consistent, synthetic. The generator also takes
  `--engine piper`, so one command on a machine with `pip` and a Spanish Piper voice replaces
  all 102 clips with neural ones. See [tools/README.md](tools/README.md).
- **Interface state stays in the browser.** `localStorage`, no accounts, no analytics.

The reasoning, the tradeoffs and what this does *not* do are in [DEMO.md](DEMO.md).

## License

MIT — see [LICENSE](LICENSE).
