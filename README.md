# hablo

**Learn a language by using it, not by memorising a catalogue of translations.**

hablo is a dependency-free, local-first language app with **13 language packs**. Spanish, French, English and Italian are the flagship courses, with full phrase decks; German, Dutch, Portuguese, Russian, Turkish, Arabic, Hindi, Japanese and Chinese are starter courses that use the same learning engine.

There are no accounts, no analytics, no server and no model required. Progress lives in your browser.

![hablo — the Today screen](docs/hablo-preview.png)

## Start it

Use Python 3:

```sh
python3 server.py
```

On first run this creates an isolated `.tools/ai-venv`, installs
`llama-cpp-python[server]`, downloads the small local model (~490 MB), then
starts the app and model together and opens the browser. Later runs reuse the
model and start immediately. The model is optional: if setup cannot finish,
the app still starts with the authored/scripted practice.

```sh
python3 server.py --offline      # app only, no model setup
python3 server.py --port 9000    # pin a port
python3 server.py --no-open      # do not open a browser
make ai                          # same as python3 server.py
```

The app itself is still standard-library only and has no build step. For the
app without the automatic model, use `python3 serve.py` (or `make serve`).

Open the printed `http://localhost:…` address rather than `index.html` directly. Microphone features need a secure context, and `file://` does not provide one.

## First run

1. Choose the **language you want to learn**.
2. Choose the **interface language**. It stays independent of the learning language.
3. Press **I'm new** to start at the beginning, or **Test me** to take the entry exam.
4. The entry exam adapts while you answer: three correct answers in a row move it up a band, a miss steps it back, and a perfect run can open C1. The current band is shown in the counter.

Your first language is added automatically. To add another later, open **Settings → Your languages → Add language**, choose a language, and complete that language's entry exam. Each language keeps its own level, cards, XP, statistics, custom lessons and conversation history.

Removing a language is deliberate: press the **×** on its card, then confirm. Its local progress for that language is deleted and cannot be undone. The last remaining language cannot be removed.

## The learning loop

The primary action on **Today** is **Start lesson**.

A lesson mixes:

- new cards that teach the word, meaning, sound and usage
- recall of words from earlier lessons
- production, listening, matching, sentence building and message completion
- a short end-of-session review for what you missed

Lessons use spaced repetition. What you miss comes back before the session ends and again when it is due. A missed card offers **Ask coach**, a rules-first explanation built from the correct form, its meaning and your answer; it never asks a model to invent grammar. The end screen's coach note is built from the actual kept and missed cards, not model prose. The optional **one sentence with today's words** box still has **Check sentence**, which asks the local model for a suggestion; its output is guarded and falls back plainly. **One more** starts a short pass on real weak or missed items rather than a generic new lesson.

### Exercise types

- **Choose the meaning** and **choose the target**
- **Type the translation**
- **Listen and type**
- **Listen and choose**
- **Build a sentence**
- **Complete a message**
- **Match three pairs** — all three must be completed; selected, correct and wrong states are visible
- **Say it** where the browser supports speech recognition; a model audio button, one low attempt that reveals the target, and a retry before grading

### Vocabulary expansion

**Expand vocabulary** is a separate, deliberately minimal mode:

- one synonym question at a time, never a recall-meaning card in front of it
- the meaning stays hidden until after you answer; a **show translation** control is optional
- every correct answer feeds the same SRS as lessons; wrong words return in the session
- a correct synonym advances by itself; **Continue** appears only after a miss
- after a run of correct answers the task gets harder: more options, then closer same-field distractors
- the synonym pool respects your placed ceiling; the recall fallback starts near your band
- the whole set is authored synonym pairs; a small starter pack repeats its pairs to fill the session
- a missed-word review is one button away at the end
- statistics persist per language; a session also pays XP and coins
- answering feeds the SRS, but it does **not** unlock the next path lesson — only a lesson does that
- skipping a typing card removes it from the queue; it earns no XP, coin, streak or path progress
- **personal anchors** remain available on the recall fallback for packs without synonym pairs

### Advanced vocabulary

Every pack now carries five B1/B2 abstract words — decision, purpose, challenge, achievement and risk — with sentences, English glosses, synonym tasks and local audio. They appear once the learner’s band reaches them, so a C1 placement is no longer opened on A1 words alone. The path is unchanged; these words extend lessons and synonym practice across all thirteen languages.

### Reading

Each full course has eight reading texts across A1–B2. Starter courses have five. Every text has three multiple-choice questions and an explanation for each wrong option. The text screen also has **Listen to text**, which reads the title and body through the same installed voice used by conversation, and **Write me a text**, which asks the local model for a short new text at the learner's level using the personal context. Generated texts get a short cloze comprehension check built from their own sentences; if no model answers, the packed text stays.

### Conversation

**Have a conversation** always works without a model. The local model is the default when one is running; if none answers, the app falls back to its own predictor and the active pack’s authored dialogue. The fallback follows authored turns where they fit, uses recent context, classifies greetings/thanks/yes-no/name/question intents, avoids repeating recent replies and refuses to echo or return runaway text.

Assistant replies are spoken automatically through the browser’s installed speech voices when audio is on. A local target-language voice is preferred; if the device exposes only another installed voice, that is used as a fallback so the reply is not silent. If the voice list arrives late, the reply is queued until a voice appears. **Settings → Speak replies** turns the automatic voice off without muting card audio.

**Settings → Personalize** stores two short local notes: why you are learning and what you like. They are shown on Today, used by the local coach for examples and scenarios, and never sent to a remote service by the app. They are not a quiz and not required.

**Hands-free** is an opt-in voice loop on the conversation screen. Turn it on, speak, and the recognised message is sent; after the assistant replies and finishes speaking, the microphone opens again. It turns off when you leave the screen, when you clear the chat, or when microphone permission is refused. Browser speech recognition still requires a secure context and a supported browser; the typed conversation always remains available.

A **transfer mission** appears above the conversation. It asks you to use two or three weak/due phrases in the conversation. A phrase counts only when you actually write it; completing the mission gives a small XP award. Coach check-ins select real authored phrases and use a rules-first note; the model may open a roleplay or write a practice text, but it is not allowed to replace data-derived coaching with generic self-talk.

A local model is optional but it is now the only conversation-engine path when present: Settings has no engine chooser. Press **Find local model**; the app probes `http://localhost:8080`, `http://localhost:8081` and `http://localhost:11434`, stores the endpoint and model, and uses the first model that answers. Both llama.cpp's `llama-server` / `llama-cpp-python` and Ollama work. Without one, no conversation leaves the device; the authored fallback runs.

The same endpoint is used by the word-set **Suggest words** button and the planned-lesson **Suggest with local model** button. `python3 server.py` is the whole setup:

```sh
python3 server.py
```

It runs [tools/install_ai.py](tools/install_ai.py), which creates an isolated `.tools/ai-venv`, installs `llama-cpp-python[server]` from [tools/requirements-ai.txt](tools/requirements-ai.txt), and downloads a small Qwen 2.5 0.5B Q4 model (~490 MB). It then starts the app and model together. The app probes `8080`, `8081` and `11434`, so it finds the model without changing Settings. It checks free RAM before starting, reduces the context when memory is tight, and stops the model if free memory falls below 350 MB. If no model is running, conversation and the assists fall back to the authored pack rather than failing.

The individual pieces remain available for a custom setup: `python3 tools/install_ai.py` installs/downloads only, and `python3 serve.py --ai` starts an already-installed app + model.

### Planned lessons

**Plan a lesson** builds a lesson from a natural-language request such as:

- “dinner out, I want pizza”
- “a cousin’s wedding”
- “hotel check-in”
- “pharmacy and doctor”
- “train to the airport”

Choose the lesson language explicitly. The planner detects the situation, selects the strongest matching phrases, adds due revision, and saves the lesson’s language and focus. Saved lessons can be reopened or deleted from Today.

The planner does not invent a town dialect. If a dialect is not in the pack, it uses the standard language and says so. With a local model connected, **Suggest with local model** extracts extra keywords and situations from your request; if no model answers, the rule-based planner still builds the lesson.

**Roleplay** starts a conversation from the same request. The local model opens in character in the target language, using the local why/interests, and the app seeds a mission from the matching pack phrases. If no model answers, the authored conversation opens instead and the app says so. The active scene is shown above the conversation.

### Words you need

**Learn specific words** is the narrow version of a planned lesson. Paste a list — one word per line, or separated by commas — and the app matches it against the active pack's concepts, phrases, terms and grammar. It shows:

- the words it will teach, with their meaning
- the words the pack does not have yet, honestly labelled
- up to four due reviews, so the session still maintains what is already learned

The set is saved in **My lessons** and can be reopened or deleted. It does not invent vocabulary: a word the pack has not authored is reported, not guessed. This is the feature for a menu, a work meeting, a hospital visit or any list that a generic course does not cover.

You do not have to bring the list yourself. Name an area — “cooking”, “the gym”, “a job interview” — and press **Suggest words**. With a local model connected, hablo asks it for target words and then matches only authored items; without one, it uses the pack’s topic planner and says so.

## Language library

Settings lists every language you are learning with its flag, name and level. Selecting a card switches language. **Add language** starts a new entry exam. **×** removes a language after confirmation.

The interface-language selector is separate and does not change when you switch learning languages.

## Progress

**Progress** shows the real counts behind the course: level, words met, words solid (interval at least six days), words the learner has produced correctly, cards due, the path, topic rings, confused pairs, kept sentences and session totals. Production is counted only on generated answers, not on multiple-choice recognition, and it does not alter the SRS interval. **Practice producing** starts a short session of cards that were recognized but never produced, using build/write/translate/message tasks instead of multiple choice. A seven-day strip shows the actual cards finished each day from local data; empty days are shown without guilt copy. The **Coach read** is rules-first and written from those counts, not model prose or invented XP. It states the real met/solid/due/produced numbers and a next step; the model is used for generative practice, not for inventing progress.


Coins are **earned**, never bought. A finished lesson pays for first-try answers and a clean sheet; expanding vocabulary pays for each correct word; reaching the daily goal pays once. They buy **looks only** — three accent themes in **Settings → Look**:

| look | cost |
|---|---|
| Ember | free |
| Plum | 60 coins |
| Moss | 120 coins |

There is no pay-to-win, no loot, no energy and no learning locked behind the currency. The point is a small, honest pull to come back and finish a card. Today also shows a thin daily-goal bar, and crossing a 100-XP level adds a short, earned level line to the session summary.

## What is local

Settings → **Your data** downloads a JSON backup of the complete local state and can import one after confirmation. Nothing is uploaded; importing replaces local progress only after the same confirmation dialog used for destructive actions. The format is versioned and validated before it touches storage.


- Progress, XP, coins, levels, streaks, statistics, vocabulary anchors, custom lessons, word sets and chat history use `localStorage`.
- The chosen accent and the unlocked looks are stored with the same state.
- The storage key is intentionally `sema.v1` for compatibility with older saves.
- Audio ships with the app as pre-rendered WAV files, generated with Piper neural voices; browser speech synthesis is the fallback.
- No account, no analytics, no tracking.
- Offline conversation never contacts a server.
- A configured local model receives only the conversation and prompt needed for chat/translation.

## Audio

Every item ships as a pre-rendered WAV clip, so playback does not depend on a voice installed in the operating system. The clips are generated from the pack data with Piper neural voices, one voice per language, then trimmed, edge-faded, peak-normalised and resampled to the app's 16 kHz mono contract. Spanish keeps its historical flat `assets/audio/` folder; every other pack lives in `assets/audio/<code>/`.

The model files are **not** in the repository. To regenerate a pack on a machine with Piper installed:

```sh
python3 tools/make_audio.py --lang fr --engine piper --voice /path/to/fr_FR-siwis-medium.onnx
python3 tools/make_audio.py --lang fr --check
```

`--check` verifies manifest coverage, that every clip exists, and that it is mono 16-bit PCM at 16 kHz. The app never loads Piper or a model at runtime; it only plays the WAV files, and falls back to the browser's speech synthesis if a clip is missing.

## Verify it

```sh
make check                         # syntax gate + full test suite
node --test tests/                 # tests only
python3 tools/make_audio.py --check # audio manifest/files
make integration                   # server + advanced data + audio + real model when installed
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
src/wordset.js             word-list matching for a focused lesson
src/synonyms.js            authored synonym questions in vocabulary expansion
src/ai-tools.js            local-model output parsing
src/economy.js             earned coins and the cosmetic look costs
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

More design notes and honest limits are in [DEMO.md](DEMO.md). The gamification proposal, with its approval checklist, is in [docs/GAMIFICATION.md](docs/GAMIFICATION.md).
