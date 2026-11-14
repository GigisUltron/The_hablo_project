# sema — meaning-first language learning

A working front-end demo of a language app that **never shows a translation**.

A concept is introduced as a pair — picture, word, sound — with no English gloss anywhere in
the data. Then the quiz hides one half and asks you for the other: picture → word, word →
picture, or say it aloud. What you miss comes back before the session ends.

42 Spanish concepts, 43 semantic relations, spaced repetition, microphone scoring, a map of
the semantic web, and audio that fails loudly instead of silently.

![sema — the Today view](docs/preview.png)

## Run it

One command, standard library only:

```sh
python3 serve.py
```

That serves the folder on the first free port from 8080, prints the URL, opens your browser,
and sends no-cache headers so edits show up on reload.

```sh
python3 serve.py --port 9000     # pin a port
python3 serve.py --no-open       # don't launch a browser
make serve                       # same thing, if you prefer make
```

Use the printed `http://localhost:…` URL rather than opening `index.html` from the
filesystem: browsers gate microphone access behind a secure context, and `file://` doesn't
qualify. Any other static server works too — there is no build step.

Deep links: `#practice` (start a session), `#quiz` (quiz only, no teaching), `#map`,
`#stats`.

## The loop

1. **Learn.** A new concept is shown whole: picture, word, article, a sentence, and the
   sound. Both halves visible at once — that is where the association forms.
2. **Quiz.** One half is hidden. Four ways to answer: pick the word for a picture, pick the
   picture for a word, or say it (browser recognition, scored by edit distance).
3. **Miss and repeat.** A wrong answer is pushed to the back of the same quiz, so it is
   re-tested before you leave — and scheduled 10 minutes out, not tomorrow.

## What is implemented

| Feature | Where | Notes |
|---|---|---|
| Study phase | `renderStudy` | Picture + word + sentence + audio, one concept at a time |
| Quiz: word from picture | `renderPickWord` | Spanish options only; distractors are semantic neighbours |
| Quiz: picture from word | `renderPickPicture` | Word shown, four pictures |
| Quiz: production | `renderSay` | Browser recognition + edit-distance score, self-check fallback |
| In-session requeue | `answer` | A miss reappears before the session ends |
| Spaced repetition | `src/srs.js` | SM-2; a lapse reschedules to 10 minutes |
| Confusion tracking | `recordConfusion` | Surfaces as "most confused pairs" in Progress |
| Semantic map | `buildMap` | 42 nodes, relations drawn as curves, learned nodes lit |
| Audio diagnostics | `audioStatus` | Reports voice availability instead of playing nothing |
| Progress | `renderStats` | Coverage per field, sessions, recalls, lapses |

Everything is stored in `localStorage` under `sema.v1`. No analytics, no network calls after
the page loads.

## Audio

Pronunciation comes from the browser's own speech synthesis, which depends entirely on the
voices installed in the operating system. On a machine with no Spanish voice, the audio is
simply absent — so the app **says so**:

- the footer chip shows `1 Spanish voice` when audio will work, or `no voice on this device`
  after a short grace period, so a silent device never looks like a loading one;
- the first card that tries to speak explains itself once, instead of failing quietly;
- the chip is a button: tap it to hear a test word.

Nothing in the learning loop requires audio. Everything is also written.

## Verify it

```sh
make check          # syntax gate + full suite
node --test tests/  # the tests on their own
```

24 tests, standard library only: scheduling arithmetic, the similarity matcher, queue
construction, distractor selection, dataset integrity (unique ids, unique images, no
dangling relations) and consistency between the markup and the script — the kind of breakage
a no-build front end otherwise surfaces only in the browser.

## Layout

```
index.html          shell, four views
serve.py            local preview server (stdlib only)
Makefile            make serve / make test / make check
assets/styles.css   the whole visual system: riso-poster, no external assets
src/data.js         42 concepts + semantic relations
src/srs.js          scheduling + matching (pure, testable)
src/app.js          views, study, quiz, speech, map, stats
tests/              node:test suites
```

## The look

Warm paper, near-black ink, chili/paprika/saffron accents, 3px rules and hard offset shadows
— a printed-poster feel rather than a dashboard. Texture is a single inline SVG noise filter
plus a halftone dot pattern, and the tape on top of the drill card is a pseudo-element. No
fonts, icons or images are downloaded, so the page still works with the network switched off.

## Honest limits

- **42 hand-picked concepts, one language.** Whether picture-anchoring beats translated
  flashcards needs a two-arm retention study, not a demo.
- **Pronunciation is word-level.** Recognition scores the word, not the phonemes; accent
  feedback is out of scope here.
- **Recognition is Chromium-strongest.** Firefox exposes neither recognition nor voices
  reliably on Linux, hence the self-check path and the audio chip.
- **Audio quality is the OS's**, not the app's.
- **The map is a curated graph**, not something inferred from a corpus.
- **No accounts or sync** — clearing storage resets progress.

## If this were continued

1. Phoneme-level feedback from a listener panel rather than one recogniser.
2. Concepts mined from a frequency corpus, ordered by usefulness.
3. Spoken prompts ("describe what you did today") instead of single words.
4. A retention study with two arms: image-anchored vs translated flashcards.
