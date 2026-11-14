# Briefs — handing a lane to another agent

Three ways to point an agent at work in this repo. Pick whichever matches where the agent is
running.

**1. In a DSH session on this workspace.** Just say what you want delegated: *"give the audio
lane to another agent."* The briefs below are what that agent gets.

**2. A fresh session, this checkout.** One line:

> Read `AGENTS.md` and `docs/BRIEFS.md`. Do the **audio** brief. Report what you changed and
> the exact verification output.

**3. Any other coding agent** (Claude Code, Codex, Cursor, Aider) on a clone: same line. The
briefs are written to be self-contained — they name files, constraints, commands and the
definition of done.

Before handing off, tell the agent two things it cannot infer: **which lane** (they own
different files) and **that it must not commit or push** unless you say so.

---

## Brief: neural audio

**Needs:** a machine with internet, `pip`, and write access. This is the one lane that cannot
be completed in the sandbox this repo was built in — no pip, no route to PyPI.

**You own:** `tools/make_audio.py`, `tools/README.md`, `assets/audio/**`.
**Read but never edit:** `src/data.js`, `src/phrases.js`.

**Goal.** Replace the eSpeak clips with a neural voice (Piper), without changing the
contract the app depends on.

```sh
pip install piper-tts
# a Spanish voice, e.g. es_ES-sharvard-medium or es_ES-davefx-medium (.onnx + .onnx.json)
python3 tools/make_audio.py --engine piper --voice /path/to/es_ES-sharvard-medium.onnx
python3 tools/make_audio.py --check
```

**Contract — non-negotiable:**
- one file per item at `assets/audio/<slug>.wav` (slug = ASCII-folded id, e.g. `montaña` →
  `montana`, `ph-hola` → `ph-hola`)
- mono, 16-bit PCM, 16 kHz, silence-trimmed, edge-faded, peak-normalised
- `assets/audio/manifest.js` exporting `window.SEMA_AUDIO = {"<item id>": "assets/audio/<slug>.wav"}`
- every id in `src/data.js` **and** `src/phrases.js` covered

**Done when:** `--check` exits 0, `node --test tests/*.test.js` passes, and you have listened
to at least three clips — one word, one short phrase, one long phrase.

**Rules:** an explicit `--engine piper` must fail loudly if Piper or the voice is missing;
never silently fall back to eSpeak. Say plainly in `tools/README.md` that eSpeak is formant
synthesis and cannot sound human.

---

## Brief: content

**You own:** `src/data.js`, `src/phrases.js`, `tests/data.test.js`, `tests/phrases.test.js`.

**Goal.** More Spanish, better chosen — phrases at 60+, concepts expanded with real semantic
relations, and usefulness ordering so the first lessons teach the highest-frequency material.

**Constraints the tests enforce:**
- concepts: `{id, emoji, word, article, cat, sentence}`; ids and emoji unique; every edge
  points at a real concept; no orphan concepts; sentence ends in punctuation
- phrases: `{id, emoji, text, sub, cat}`; `ph-` prefix; ids and emoji unique in the file
- **no English gloss field of any kind** — the app's premise is that a translation does not
  exist in the data
- `sub` is Spanish, eight words or fewer

**Done when:** dataset tests pass and every new id has audio (run the audio lane after this
one, or `--check` will name the gaps).

---

## Brief: interface

**You own:** `index.html`, `src/app.js`, `src/session.js`, `assets/styles.css`,
`tests/markup.test.js`.

**Goal.** Keep the Today screen as it is — headline, one sentence, one **Start lesson**
button, a stats line, a collapsed *Tune the lesson* — while the decks grow behind it. No new
panels, no new nav, no decoration.

**Constraints the tests enforce:**
- every `$("id")` in the script resolves to markup or to an id the script itself generates
- script order: `src/data.js`, `src/phrases.js`, `assets/audio/manifest.js`, `src/srs.js`,
  `src/app.js`
- all four views render at 390 px and 1280 px

**Done when:** `node --check src/app.js` and `node --test tests/*.test.js` pass, and you have
opened the page and looked at it — a no-build front end breaks in ways tests cannot see.

---

## Invariants, all lanes

- **No new dependency** unless the owner approved it in the current conversation.
- **No personal data** in files, fixtures, commit messages or audio metadata.
- **Never edit a file you do not own**; send the request instead.
- **Commit locally, never push.** One concern per commit, subject prefixed with your lane
  (`content:`, `audio:`, `ui:`), and a `Co-authored-by: <lane> agent <lane@local>` trailer so
  the work is attributable. Pushing is the owner's call.
- **`make check` is the gate**, not a suggestion.
