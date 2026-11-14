# sema — meaning-first language learning

A working front-end demo of a language app that **never shows a translation**.

Instead of `casa = house`, a concept is anchored to a picture and a sound. You hear the
word, pick the picture; then you see the picture, say the word, and only then see how it's
written. Neighbouring concepts become wrong-answer options, so the mistakes a learner
makes are the semantically meaningful ones — and those get recorded.

42 Spanish concepts, 43 semantic relations, spaced repetition, microphone scoring, and a
map of the semantic web. No dependencies, no build step, no backend.

![sema — the Today view](docs/preview.png)

## Run it

Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8080   # then http://localhost:8080
```

Use `localhost` (not `file://`) if you want the microphone: browsers gate speech
recognition behind a secure context.

Shareable deep links: `#map`, `#stats`, `#practice` (jumps straight into a drill).

## What is implemented

| Feature | Where | Notes |
|---|---|---|
| Image → sound recall | `renderReceptive` | Four pictures, audio prompt, no text |
| Production with mic | `renderProductive` | Browser `SpeechRecognition`, scored by edit distance |
| Self-check fallback | `renderProductive` | Where recognition is unavailable, reveal and grade |
| Spaced repetition | `src/srs.js` | SM-2; a lapse reschedules to 10 minutes, not a day |
| Semantic distractors | `pickDistractors` | Neighbours first, then random fill |
| Confusion tracking | `recordConfusion` | Surfaces as "most confused pairs" in Progress |
| Semantic map | `buildMap` | 42 nodes, relations drawn as curves, learned nodes lit |
| Context sentences | `src/data.js` | Target-language only, target word highlighted |
| Progress by field | `renderStats` | Coverage bars per semantic category |

Everything a learner does is stored in `localStorage` under `sema.v1`. Nothing leaves the
browser; there is no analytics and no network call after the page loads.

## Design decisions worth knowing

- **No gloss field exists in the data.** Not "hidden until reveal" — absent. The app
  physically cannot show a translation, and `tests/markup.test.js` fails if one is added.
- **Production is not optional.** A card is only graded after the learner has tried to say
  the word, so recognition is never mistaken for knowledge.
- **Lapses return within the session.** Ten minutes, not tomorrow: the point is to repair
  the sound–image link while the confusion is still warm.
- **Content never depends on animation.** The view transition animates position only; an
  earlier version faded from `opacity: 0` and, when animation did not run, left the page
  blank. Visibility is not a side effect of a CSS animation.

## Verify it

```sh
node --test tests/
```

24 tests, standard library only. They cover scheduling arithmetic, the similarity matcher,
queue construction, distractor selection, dataset integrity (unique ids, unique images, no
dangling relations) and static consistency between `index.html` and `src/app.js` — the kind
of breakage a no-build front end otherwise surfaces only in the browser.

## Layout

```
index.html          shell, four views
assets/styles.css   design system, no external fonts or images
src/data.js         42 concepts + semantic relations
src/srs.js          scheduling + matching (pure, testable)
src/app.js          views, drills, speech, map, stats
tests/              node:test suites
```

## Honest limits

This is a demo, not a product:

- **40 concepts, one language.** The interesting question — does this teach better than
  flashcards? — needs a real study, not a screenshot.
- **Voice quality is the browser's.** `speechSynthesis` voices vary a lot per platform, and
  recognition is strongest in Chromium; Firefox exposes neither reliably.
- **No accounts, no sync, no backend.** Clearing storage resets progress.
- **The map is a curated 42-node graph**, not something inferred from a corpus.
- Pronunciation feedback is word-level, not phoneme-level. The interesting version —
  listener-disagreement scoring — is not in this demo.

## If this were continued

1. Phoneme-level feedback from a listener panel rather than a single recogniser.
2. Concepts mined from a frequency corpus and ordered by usefulness, not hand-picked.
3. Spoken production prompts ("describe what you did today") instead of single words.
4. A real retention study with two arms: image-anchored vs translated flashcards.
