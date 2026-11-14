# Running this repo with three agents in parallel

The constraint that makes or breaks parallel work here is **file ownership**, not task size.
Two agents editing `src/app.js` at once will produce conflicts that cost more than the
serial work. So the split below gives each workstream whole files, and pins the interfaces
between them so nobody has to guess.

Read this before touching anything. If a change requires crossing an ownership line, it goes
through the integration checkpoint instead of straight into `main`.

## Who is who

The assistant that built this repo (DSH) is **not one of the three** — it has been playing
all three roles serially, and it is the natural owner of the **interface & flows** lane,
because that lane holds the contracts everything else assembles against.

What is worth handing out:

| Hand this to | Why it is separate | What they need from you |
|---|---|---|
| **Audio & speech** | Self-contained tool plus generated files; quality work benefits from someone who can listen | The item list, and a decision on whether a neural voice is allowed |
| **Curriculum & content** | Pure data plus tests; the highest-value lane if the goal is real fluency | A frequency list or a target corpus, and someone who speaks the language |
| **Interface & flows** | The contract holder; conflicts here hurt most | Nothing — but it should not be split between two agents |

If you are assigning to three others, give them the three lanes above and keep the
integration checkpoint (merge order + `make check`) for yourself. Do not hand the interface
lane to two agents at once; that is the one split the plan does not survive.

## Workstreams

| # | Agent | Owns | Delivers |
|---|---|---|---|
| 1 | **Audio & speech** | `tools/make_audio.py`, `assets/audio/**`, `src/audio.js`* | Pronunciation quality, playback, audio status |
| 2 | **Curriculum & content** | `src/data.js`, `src/phrases.js`, `tests/data.test.js`, `tests/phrases.test.js` | Concepts, phrases, semantic relations, usefulness ordering |
| 3 | **Interface & flows** | `index.html`, `assets/styles.css`, `src/app.js`, `src/session.js`, `tests/markup.test.js` | Screens, drill flow, builder, map, stats, accessibility |

Tests split along the same lines, so each agent can run its own suite without tripping over
another's.

\* Playback currently lives inside `src/app.js`. **Step 0 of the fan-out is extracting it
into `src/audio.js`** — about 80 lines: `speak`, `sayItem`, `audioStatus`, `updateAudioChip`.
Without that extraction the audio agent and the interface agent both need `app.js`, which is
exactly the conflict this document exists to prevent.

## Contracts

These are the only things agents may rely on. They change by agreement, not unilaterally.

**1. Item schema** (owned by agent 2, consumed by 1 and 3)

An item is anything a lesson can teach. Both files export the same shape:

```js
{ id: "casa",          // unique; phrase ids are prefixed "ph-"
  emoji: "🏠",         // the anchor; unique within its file
  text: "la casa",     // what is spoken and shown
  sub: "Mi casa está cerca del mar.",  // optional context line
  cat: "home" }        // field, for the builder
```

**2. Audio manifest** (produced by agent 1, consumed by 3)

`assets/audio/manifest.js` defines `window.SEMA_AUDIO = { "<item id>": "<relative path>" }`.
The path is relative to `index.html`. If an id is missing, the interface falls back to speech
synthesis — it must never hard-fail on a missing file.

**3. Session state** (owned by 3, read by nobody else)

The interface keeps scheduling state in `localStorage` under `sema.v1`, keyed by item id.
Agent 1 and 2 must not read or write it.

**4. Script order** (owned by 3, enforced by `tests/markup.test.js`)

```
src/data.js  →  src/phrases.js  →  assets/audio/manifest.js  →  src/srs.js  →  src/audio.js  →  src/app.js
```

## Order of work

1. **Contract freeze (short, serial).** Agree the item schema and the manifest shape. Nothing
   else starts before this, because both other streams build against it.
2. **Parallel build.** Three agents work in their lanes. Each commits to its own branch and
   runs its own test file.
3. **Integration checkpoint (serial).** Merge in this order: content → audio → interface. The
   interface merges last because it consumes both. Run `make check` on the merged result; it
   is the gate, not a suggestion.
4. **Render check.** Screenshot the views the merged change touched. Layout bugs in a
   no-build front end do not show up in tests.

## Rules of engagement

- **Never edit a file you do not own.** If you need a change there, send the owner a request
  instead of a patch.
- **Regenerating `assets/audio/**` requires the item list**, so it happens after content
  merges — or the audio agent regenerates from `main` at the start of its own work.
- **No agent adds a dependency.** Anything new must be standard library, browser-native, or
  already present. This is a standing project rule, not a preference.
- **No personal data anywhere** — not in fixtures, commit messages, or audio metadata.
- **Deleting or rewriting another agent's work needs the owner's explicit approval.**
- **Small commits, one concern each**, with the workstream name at the start of the subject:
  `audio:`, `content:`, `ui:`.

## Definition of done, per workstream

- **Audio:** every item in the manifest resolves to a real file over ~2 KB; `make check`
  passes; the footer chip reports which audio path is active.
- **Content:** every item has the schema fields; ids and emoji unique within a file; every
  relation points at a real item; the dataset tests pass.
- **Interface:** every `$("id")` in the script exists in the markup or is generated by it;
  keyboard paths work; all four views render at 390 px and 1280 px.

## When it is not worth three agents

Sequential is faster for: a single-file refactor, anything touching the session state machine,
and visual restyling. Parallelise when the work is additive — new content, new audio, new
screens behind an existing contract.
