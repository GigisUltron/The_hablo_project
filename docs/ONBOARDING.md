# Language packs and first run

Three screens on first run, under 30 seconds, and the app is configured. Every
answer changes what the next session contains.

## Current packs

| code | name | concepts | phrases | terms | basics | texts | levels | conversations | audio |
|---|---|---|---|---|---|---|---|---|---|
| `es` | Spanish | 47 | 138 | 28 | 16 | 8 | A1–C1 | 3 | 229 |
| `fr` | French | 47 | 138 | 28 | 16 | 8 | A1–C1 | 3 | 229 |
| `en` | English | 45 | 149 | 28 | 16 | 8 | A1–C1 | 3 | 238 |
| `it` | Italian | 29 | 138 | 21 | 16 | 8 | A1–C1 | 3 | 204 |
| `de` | German | 29 | 41 | 8 | 16 | 7 | A1–B2 | 2 | 94 |
| `nl` | Dutch | 29 | 41 | 8 | 16 | 7 | A1–B2 | 2 | 94 |
| `pt` | Portuguese | 29 | 41 | 8 | 16 | 7 | A1–B2 | 2 | 94 |
| `ru` | Russian | 29 | 51 | 8 | 16 | 7 | A1–B2 | 1 | 104 |
| `tr` | Turkish | 29 | 41 | 8 | 16 | 7 | A1–B2 | 1 | 94 |
| `ar` | Arabic | 29 | 40 | 8 | 16 | 7 | A1–B2 | 1 | 93 |
| `hi` | Hindi | 29 | 40 | 8 | 16 | 7 | A1–B2 | 1 | 93 |
| `ja` | Japanese | 29 | 40 | 8 | 13 | 7 | A1–B2 | 1 | 90 |
| `zh` | Chinese | 29 | 40 | 8 | 13 | 7 | A1–B2 | 1 | 90 |

These are the counts from `SemaLangs.load(<code>)`: concepts, phrases and terms
are the deck lengths, `basics` is `basics.items.length`, `texts` is
`texts.texts.length`, `levels` is the CEFR range of items graded in
`levels.js`, `conversations` is `conv.dialogues.length`, and `audio` is the
number of entries in the pack's generated manifest. Every pack ships seven or
eight reading texts and at least one authored conversation; every pack includes
B1 and B2 texts, and the four full courses also include a C1 text.

The loader still treats a missing part as an empty deck, so a pack can grow one
piece at a time without crashing the reader or the chat button.

`state.profile.lang` is the active code. Progress is archived per language under
`state.profile.byLang[code]` (cards, reviews, placement, sessions, memory), so
switching decks never wipes another language. The picker is on first run and in
Settings.

## The runtime contract

A pack is data, not a code path. `src/lang/index.js` exposes:

```js
SemaLangs.define(code, part, value)   // called by each pack file
SemaLangs.load(code)                  // -> { code, name, locale, concepts,
                                      //      phrases, terms, glosses, alphabet,
                                      //      texts, conv, audio }
SemaLangs.list()                      // -> [{ code, name, locale }], picker order
SemaLangs.bind(pack)                  // points window.SEMA_* at the live pack
```

`load()` always returns every key, even when a pack has no texts or
conversations. The app only talks to `load()` and to `bind()`; it never assumes
which language is live.

Each pack file keeps the historical globals (`window.SEMA_DATA`,
`SEMA_PHRASES`, `SEMA_TERMS`, `SEMA_GLOSSES`, `SEMA_ALPHABET`, `SEMA_TEXTS`,
`window.SemaConv`) and registers itself. A file ends like this:

```js
if (typeof module !== "undefined" && module.exports) module.exports = SEMA_DATA;
if (typeof window !== "undefined") {
  window.SEMA_DATA = SEMA_DATA;
  if (window.SemaLangs) window.SemaLangs.define("it", "concepts", SEMA_DATA);
}
```

The `language` header on `concepts.js` supplies the picker name and TTS locale:

```js
language: { code: "it", name: "Italian", locale: "it-IT" },
```

## Adding a pack: the exact recipe

Use `it`, `ru`, `en` or `zh` as `<code>`; the tool insists on two lowercase
letters. Copy the shape of the French pack rather than inventing one.

### 1. Create the folder

```
src/lang/<code>/concepts.js
src/lang/<code>/phrases.js
src/lang/<code>/terms.js
src/lang/<code>/glosses.js
src/lang/<code>/alphabet.js     optional
src/lang/<code>/texts.js        optional
src/lang/<code>/conv.js         optional
src/lang/<code>/audio.js        required once audio exists
```

### 2. Concepts — 29 in a starter deck (45–47 in Spanish, French and English)

Each entry is
`{ id, emoji, word, article, cat, sentence }`.

- `id` is ASCII and stable: `maison`, not `maîson`. Audio file names and the
  progress archive are keyed by it.
- `emoji` is unique within the pack; it is the only anchor shown before recall.
- `article` is the language's definite article (`le`, `la`, `l'`). Use `""` for
  verbs and for languages without articles. The UI renders `article + word`;
  an article ending in an apostrophe is joined without a space by the `.elide`
  rule (French `l'eau`, Italian `l'acqua`).
- `cat` must be one of `home food nature animals body city time emotion action
  abstract`, with the same per-field counts as Spanish/French.
- `sentence` is a short, natural sentence in the target language that contains
  the word and ends in `.`, `?` or `!`.

Keep `categories` and `relationTypes` identical to the other packs. Translate
the `edges` id for id so distractors remain meaningful neighbours, and keep
every edge pointing at a real concept, with no duplicate pairs. Stay consistent
with the pack you are extending: the current decks hold 29 concepts in each
starter pack and in Italian, 45 in English, and 47 in Spanish and French.

### 3. Phrases — 40–51 starter / 138–149 flagship items

Each entry is `{ id, emoji, text, sub, cat }`, with `cat: "phrase"`. `text` is
what is spoken and displayed; `sub` is one line of context in the target
language. Mirror the Spanish situations exactly, in the register a native
speaker would actually use. Ids are `ph-…`, ASCII, unique, and must not collide
with concept ids. Scene emoji are unique within the deck.

### 4. Terms — 8 starter / 21–28 flagship items

Each entry is `{ id, text, gloss, schema, frame, contrast }`.

- `id` matches `^t-[a-z-]+$`.
- `schema` is one of `clock repeat left right fork balance parallel question
  plus chain`.
- `frame` contains exactly one `____` and ends a sentence. The term must fit
  the slot grammatically when inserted.
- `contrast` points at another term in the pack (or is `null`), and the pairing
  is symmetric where an opposite exists.

### 5. Glosses — English, for every item

`glosses.js` maps every item id to a short English gloss. It is the "show
translation" escape hatch the reveal control reads. The English pack ships short
English definitions rather than translations; a gloss that only repeats the
word carries nothing, so leave that entry out. A pack with an empty map simply
has no reveal control.

### 6. Alphabet and optional parts

`alphabet.js` is cheap and optional: `letters: [{ letter, name, hint, example }]`.
`hint` is English pronunciation instruction, `example` a target-language word
containing the letter. Include accented letters and ligatures as their own
entries when they change the sound.

`texts.js` and `conv.js` are optional. If added, keep the existing shapes:
texts are `{ id, title, level, body, questions }`; conversations export the
`SemaConv` API (`dialogues`, `start`, `fits`, `fold`) and register with
`SemaLangs.define("<code>", "conv", api)`.

### 7. Wire it into `index.html`

Add the pack after the existing packs, and add audio immediately after its
manifest. Registration order is picker order:

```html
<script src="src/lang/it/concepts.js"></script>
<script src="src/lang/it/phrases.js"></script>
<script src="src/lang/it/terms.js"></script>
<script src="src/lang/it/glosses.js"></script>
<script src="src/lang/it/alphabet.js"></script>
<script src="assets/audio/it/manifest.js"></script>
<script src="src/lang/it/audio.js"></script>
```

`src/lang/<code>/audio.js` is two lines:

```js
if (typeof window !== "undefined" && window.SemaLangs) {
  window.SemaLangs.define("it", "audio", window.SEMA_AUDIO || {});
}
```

Then extend the expected script list in `tests/markup.test.js` in the same
order.

### 8. Render the audio

The generator reads `src/lang/<code>/` and writes
`assets/audio/<code>/<slug>.wav` plus `assets/audio/<code>/manifest.js`:

```sh
python3 tools/make_audio.py --lang it --engine espeak
python3 tools/make_audio.py --lang it --check
```

The output contract is non-negotiable: mono 16-bit PCM at 16 kHz,
silence-trimmed, edge-faded, peak-normalised, one `<slug>.wav` per concept and
phrase, and a manifest mapping every id to its path. Spanish is the historical
exception: its clips stay flat in `assets/audio/` and must not be regenerated by
accident.

Prefer eSpeak for `it`, `ru` and `en`: it has voices for all three and needs no
network. `--engine auto` uses Piper only when a matching voice is installed.

### 9. Verify before committing

```sh
make check
make audio-check
```

Then check the pack itself:

- counts match the table in **Current packs**, and a gloss for every item
- unique concept and phrase ids and emoji, no id collisions between decks
- every edge resolves, no duplicate pairs
- each term frame has exactly one `____` and ends a sentence
- each contrast is symmetric and not self-referential

Finally render at 390 px: first run with the new pack selected, Today, a study
card and a quiz card, Settings, and a switch back to Spanish. Confirm the
Spanish counts and cards are unchanged after the round trip.

## Per-language notes for the next four

### Italian — `it`

Articles are `il / lo / la / l' / i / gli / le`. The elision support already
handles `l'`. Watch double consonants and accents in ids: keep ids ASCII
(`citta`, not `città`). eSpeak has `it`:

```sh
python3 tools/make_audio.py --lang it --engine espeak
```

### Russian — `ru`

No articles: `article: ""` everywhere. Use the nominative singular for `word`
and keep case government inside `sentence` and term frames. Transliterate ids
to ASCII (`dom`, `voda`, `lyubov`); the Cyrillic word and sentence still render
and are spoken by eSpeak `ru`. The alphabet is 33 Cyrillic letters, with hard
and soft signs as their own entries.

```sh
python3 tools/make_audio.py --lang ru --engine espeak
```

### English — `en`

Articles are `the / a / an`. The app's interface is already English, so a
translation of an English word into English is noise: ship an empty `glosses`
map and let the reveal control disappear. eSpeak has `en`; a Piper `en_US` or
`en_GB` voice is better if quality matters.

```sh
python3 tools/make_audio.py --lang en --engine espeak
```

### Chinese — `zh`

No articles. Keep `word` as the hanzi and put pinyin in the sentence or in
parentheses in `word` if learners need it; ids must be ASCII pinyin (`shui`,
`chi`, `ai`). There is no useful letter-by-letter alphabet, so skip
`alphabet.js` or use a pinyin initial/final table only if it earns its place.

**Do not use eSpeak for Mandarin.** Its Mandarin is poor and has the wrong
tones. Use Piper with a `zh_CN` voice, for example `zh_CN-huayan-medium`:

```sh
python3 tools/make_audio.py --lang zh --engine piper \
  --voice <path>/zh_CN-huayan-medium.onnx
```

The `.onnx.json` config must sit next to the model. `--lang zh` makes the
generator look for `zh_*.onnx`, so dropping the voice in `tools/voices/` also
works without `--voice`. Everything else — manifest, WAV contract, registry,
per-language progress — is identical.

## First run: level

`state.profile.level` ∈ A1 · A2 · B1 · B2 · C1.

- **"I'm new"** → A1, skip placement, start at unit 1
- **"Test me"** → a twelve-question adaptive staircase. Three correct answers in a row move it up a band; a miss steps it back one. A perfect run can reach C1; the band is shown beside the counter.

The level sets the starting unit (the floor in `track.js`) and is the field a
per-item level filter would use. It is stored per profile, not per language.

## Item level

Every item carries `level: "A1" | "A2" | "B1" | "B2" | "C1"` in its pack's
`levels.js`. The placement and the per-item filter read the same field, so a B1
learner does not keep meeting A1 nouns unless the deck has nothing else at
their band.

Suggested rule for the existing decks: A1 words and greetings, A2 phrases and
food/travel, B1 connectors and abstracts.

## What ships vs what doesn't

| Piece | State |
|---|---|
| Settings screen, fields, size, translations | exists |
| Placement test | exists |
| Profile and first-run flow in `state` | exists |
| Per-language progress (`profile.byLang`) | exists |
| Language packs | **13** — four flagship, nine starter |
| Reading texts and conversations | **exist in every pack** |
| Per-item level | **exists** — every item is graded in `levels.js` |
