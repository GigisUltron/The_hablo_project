# hablo

**Learn a language by using it, not by memorising a catalogue of translations.**

hablo is a dependency-free, local-first language app with **13 language packs**. Spanish, French, Italian and English are the full courses; German, Dutch, Portuguese, Russian, Turkish, Arabic, Hindi, Japanese and Chinese are starter courses that use the same learning engine.

There are no accounts, no analytics, no server and no model required. Progress lives in your browser.

![hablo — the Today screen](docs/hablo-preview.png)

## Start it

Use Python 3 (standard library only):

```sh
python3 serve.py
```

The server picks a free port from 8080, prints the URL, opens your browser and disables caching.

```sh
python3 serve.py --port 9000     # pin a port
python3 serve.py --no-open       # do not open a browser
make serve                       # same as python3 serve.py
```

Open the printed `http://localhost:…` address rather than `index.html` directly. Microphone features need a secure context, and `file://` does not provide one.

The app has no build step and no package installation.

## First run

1. Choose the **language you want to learn**.
2. Choose the **interface language**. It stays independent of the learning language.
3. Press **I'm new** to start at the beginning, or **Test me** to take the entry exam.
4. The entry exam adapts while you answer and can open A1–B1. B2 and C1 are earned by studying.

Your first language is added automatically. To add another later, open **Settings → Your languages → Add language**, choose a language, and complete that language's entry exam. Each language keeps its own level, cards, XP, statistics, custom lessons and conversation history.

Removing a language is deliberate: press the **×** on its card, then confirm. Its local progress for that language is deleted and cannot be undone. The last remaining language cannot be removed.

## The learning loop

The primary action on **Today** is **Start lesson**.

A lesson mixes:

- new cards that teach the word, meaning, sound and usage
- recall of words from earlier lessons
- production, listening, matching, sentence building and message completion
- a short end-of-session review for what you missed

Lessons use spaced repetition. What you miss comes back before the session ends and again when it is due.

### Exercise types

- **Choose the meaning** and **choose the target**
- **Type the translation**
- **Listen and type**
- **Listen and choose**
- **Build a sentence**
- **Complete a message**
- **Match three pairs** — all three must be completed; selected, correct and wrong states are visible
- **Say it** where the browser supports speech recognition

### Vocabulary expansion

**Expand vocabulary** is a separate, deliberately minimal mode:

- one word at a time
- meaning hidden until you ask for it
- **Again** and **Got it** feed the same SRS as lessons
- wrong words return in the session
- every second correct answer adds a harder word
- statistics persist per language
- **personal anchors** let you attach a cue such as “my cousin’s wedding”; the cue comes back with the word

### Reading

Each full course has eight reading texts across A1–B2. Starter courses have five. Every text has three multiple-choice questions and an explanation for each wrong option.

### Conversation

**Have a conversation** is usable completely offline. The default **Offline practice** engine uses the app’s own predictor and the active pack’s authored language. It follows authored dialogue turns where they fit, uses recent context, classifies greetings/thanks/yes-no/name/question intents, avoids repeating recent replies and refuses to echo or return runaway text.

A **transfer mission** appears above the conversation. It asks you to use two or three weak/due phrases in the conversation. A phrase counts only when you actually write it; completing the mission gives a small XP award.

A local model is optional. Open **Settings → Conversation engine → Local model**, set an endpoint such as `http://localhost:11434`, and check the model. Without one, no network request is made for conversation.

### Planned lessons

**Plan a lesson** builds a lesson from a natural-language request such as:

- “dinner out, I want pizza”
- “a cousin’s wedding”
- “hotel check-in”
- “pharmacy and doctor”
- “train to the airport”

Choose the lesson language explicitly. The planner detects the situation, selects the strongest matching phrases, adds due revision, and saves the lesson’s language and focus. Saved lessons can be reopened or deleted from Today.

The planner does not invent a town dialect. If a dialect is not in the pack, it uses the standard language and says so.

## Language library

Settings lists every language you are learning with its flag, name and level. Selecting a card switches language. **Add language** starts a new entry exam. **×** removes a language after confirmation.

The interface-language selector is separate and does not change when you switch learning languages.

## What is local

- Progress, XP, levels, streaks, statistics, vocabulary anchors, custom lessons and chat history use `localStorage`.
- The storage key is intentionally `sema.v1` for compatibility with older saves.
- Audio ships with the app as pre-rendered WAV files; browser speech synthesis is a fallback.
- No account, no analytics, no tracking.
- Offline conversation never contacts a server.
- A configured local model receives only the conversation and prompt needed for chat/translation.

## Verify it

```sh
make check                         # syntax gate + full test suite
node --test tests/                 # tests only
python3 tools/make_audio.py --check # audio manifest/files
```

## Repository layout

```text
index.html                 shell and views
assets/styles.css          visual system
assets/audio/              pre-rendered WAVs and manifests
src/app.js                 application flow, lesson loop, views, SRS integration
src/lang/<code>/           per-language concepts, phrases, texts, dialogues, levels, glosses
src/ui-strings.js          base interface strings
src/ui-langs.js            extra interface locale tables
src/ui-extra.js            newer interface strings
src/srs.js                 scheduling and answer matching
src/memory.js              personal sentences and cloze cards
src/chat-engine.js         optional local-model adapter
src/mini-chat.js           dependency-free offline conversation predictor
src/exercises.js           extra exercise helpers
src/track.js               curriculum track
src/curriculum.js          topic and unit resolution
tools/make_audio.py        audio generator and checker
tests/                     node:test suites
serve.py                   local static server
docs/                      preview image and project notes
```

## License

MIT — see [LICENSE](LICENSE).

More design notes and honest limits are in [DEMO.md](DEMO.md).
