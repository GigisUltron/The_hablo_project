# First run: pick everything once

Three screens, under 30 seconds, and the app is configured. Nothing here is a
questionnaire — every answer changes what the next session contains.

## 1. Language

`state.profile.lang` (default `es`). The deck is data, so a language pack is a
folder, not a code path:

```
src/lang/<code>/{concepts,phrases,terms,texts,conv,glosses,alphabet}.js
assets/audio/<code>/*.wav   + manifest.js
```

Spanish exists. A second language is ~120 authored items plus audio — content,
not engineering. Until a pack lands, the picker shows one option and says so.

## 2. Level

Two routes, one value: `state.profile.level` ∈ A1 · A2 · B1.

- **"I'm new"** → A1, skip placement, start at unit 1
- **"Test me"** → the existing eight-question placement, mapped to a level:
  0–2 correct A1, 3–5 A2, 6–8 B1

Level then decides two things: the starting unit (the floor already in `track.js`)
and which items are eligible — see below.

## 3. What for

Field chips (home, food, city, travel, work, health) plus pace: 5 / 8 / 12 cards
a day. Stored as `state.profile.fields` and `.size`, which already drive sessions.

## Item level

Every item needs `level: "A1" | "A2" | "B1"`. Without it, "personalised by level"
is a starting point, not a filter — a B1 learner still meets `la cama`. This is a
content field, one line per item, and it is the single highest-value data change
left: it turns the track from five fixed units into a curriculum that can be
personalised per learner.

Suggested rule for the existing decks: A1 words and greetings, A2 phrases and
food/travel, B1 connectors and abstracts.

## What ships vs what doesn't

| Piece | State |
|---|---|
| Settings screen, fields, size, translations | exists |
| Placement test | exists |
| Profile stored in `state` | **not built** |
| First-run flow | **not built** |
| Second language pack | **not built** — no content |
| Per-item level | **not built** — no data |
