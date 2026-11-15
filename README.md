# sema

A language-learning app with thirteen packs — full courses in Spanish, French, English and
Italian, and starter courses in nine more — with translations on by default.

Each concept arrives as a pair — the picture, the word, the sound — with no English gloss
anywhere in the data. Then the quiz hides one half and asks you for the other. What you miss
comes back before the session ends.

The flagship decks carry 42 concepts, 120 phrases, five texts and three conversations;
starter decks carry 24 concepts, 32 phrases and three texts. Spaced repetition, a semantic
map, a nine-unit path, a lesson builder, and audio that ships with the app instead of
depending on your operating system.

![sema — the Today view](docs/preview.png)

## Run it

Nothing to install. No build step, no dependencies, and no network calls unless you open the
chat.

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

Deep links: `#practice` (start a lesson), `#quiz`, `#chat`, `#read`, `#stats`.


## Chat with a local model

The conversation view can talk to a model on your own machine. Nothing is bundled and nothing
is required: the app is fully usable without a model, and the conversation view falls back to a
short scripted partner and says so.

The one-command setup with Ollama:

```sh
ollama run llama3.2
```

That starts the server and downloads the model the first time. Leave it running, then open
**Settings → Chat with a local model**. The endpoint defaults to `http://localhost:11434`;
press **Check model**. To use llama.cpp server, LM Studio or another OpenAI-compatible server,
enter its base URL there instead, for example `http://localhost:1234/v1`.

- **No model found:** the view says `no local model found — run ollama serve`, and every
  fallback reply is labelled `scripted`. It does not pretend to be a model.
- **Speak and listen:** replies are read with the browser's speech synthesis in the active
  pack's locale. The microphone button appears only where the browser has speech recognition.
- **Images:** an attached image is stored with the turn. It is sent only when the selected model
  declares vision support; otherwise the turn is marked text-only and the image stays in the
  conversation.
- **Memory:** a chat line is kept for review when it contains a word from the deck. There is no
  grammar check, so a nonsense line that happens to contain a known word can still become a
  cloze card; only the lines you want to review should be kept.
- **Privacy:** requests go only to the endpoint you set. With the default, that is your own
  machine. There is no account, no key and no tracking.

Serve the app over `http://` as described above rather than opening the file directly, so the
browser can reach the local endpoint and the microphone.


## What is translated

The **content** is translated: new cards and answer states show the English meaning by
default, and Settings can turn it off. Quiz prompts stay in the target language so the answer
is not given away; every fourth reviewed card is a translation exercise instead of a
picture match. The **interface** is translated into all thirteen deck languages
(`src/ui-strings.js` plus `src/ui-langs.js`, chosen with `profile.uiLang`); some session
summaries, toasts and reader copy are still English only.

## How it teaches

1. **Meet the pair.** Picture, word, article, sentence and sound together — with the English
   meaning visible on the card. That is where the association forms.
2. **Get quizzed.** One half is hidden: word from picture, picture from word, or say it aloud.
3. **Miss and repeat.** A wrong answer is pushed to the back of the same quiz, and scheduled
   ten minutes out rather than tomorrow.
4. **Write one line.** At the end of a session you can keep a sentence of your own, in
   Spanish. It is stored, and a day later it comes back as a card with one word blanked out —
   your own words, your own gap. Nothing else in the app is made of your writing, and that is
   exactly why it works.

The Today screen has one primary action: **Start lesson**, eight cards, about a minute. The
nine-unit path, review rows and two quiet routes (read a text, have a conversation) sit below
it; words or phrases, fields, session length and level live in Settings so they cannot
distract from starting.

What the screen shows is only what earns a return visit: cards due, the streak, how many
words you know, and how many are solid.

## Verify it

```sh
make check          # syntax gate + full suite
node --test tests/  # full suite, stdlib only
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
src/memory.js         persistent learner memory: sentences, cloze, weak items (pure)
src/chat-engine.js    model adapter, prompt and request shape (no DOM)
src/chat.js           the scripted conversation partner used when no model answers
src/app.js            views, lesson flow, quiz, speech, map, stats, chat UI
tools/make_audio.py   regenerates the audio from the dataset (build time only)
tests/                node:test suites
docs/PARALLEL.md      how to run this with three agents at once
DEMO.md               design notes, decisions and honest limits
```

## Design notes

- **Glosses exist and are shown on request.** Every item carries one, the card offers it,
  and Settings can turn it off — a test fails if an item ships without a gloss.
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
