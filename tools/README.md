# `make_audio.py` — pre-rendered pronunciation

The app plays ordinary WAV files, so it needs no installed system voice at
runtime. This tool renders one clip per item in `src/lang/<code>/concepts.js`,
`phrases.js`, `terms.js` and `basics.js`, and writes the manifest the app loads.

```sh
python3 tools/make_audio.py --engine espeak        # fallback, no network needed
python3 tools/make_audio.py --lang fr --engine espeak
python3 tools/make_audio.py                        # auto: Piper if available, else eSpeak
python3 tools/make_audio.py --check                # verify without rendering
python3 tools/make_audio.py --lang fr --check
```

| | |
|---|---|
| Backend | `espeak` (libespeak-ng via ctypes) or `piper` (neural TTS) |
| Output | `assets/audio/<code>/<slug>.wav`, one clip per item (Spanish stays flat in `assets/audio/`) |
| Format | mono, 16-bit PCM, 16 kHz |
| Processing | silence-trimmed, edge-faded, peak-normalised |
| Manifest | `assets/audio/<code>/manifest.js` — `window.SEMA_AUDIO = { "<id>": "assets/audio/<code>/<slug>.wav", ... }` |

The output contract is deliberately the same for both backends. `index.html`
and `tests/packs.test.js` depend on it; changing the format means changing
the app, which is out of scope for this tool.

## Voices used for the shipped clips

The clips in `assets/audio/` were generated from the pack data with these
Piper voices (models from `rhasspy/piper-voices`, not committed):

| pack | voice |
|---|---|
| `es` | `es_ES-sharvard-medium` |
| `fr` | `fr_FR-siwis-medium` |
| `it` | `it_IT-paola-medium` |
| `en` | `en_GB-cori-high` |
| `de` | `de_DE-thorsten-high` |
| `nl` | `nl_NL-alex-medium` |
| `pt` | `pt_PT-tugão-medium` |
| `ru` | `ru_RU-dmitri-medium` |
| `tr` | `tr_TR-dfki-medium` |
| `ar` | `ar_JO-kareem-medium` |
| `hi` | `hi_IN-pratham-medium` |
| `ja` | `ja_JP-hi_fi_captain-medium` |
| `zh` | `zh_CN-huayan-medium` |

The Python module from `piper-tts==1.8.0` was used, not the 2023 standalone
binary: that binary predates the current phoneme maps and fails on these
voices with `aɪ is not a single codepoint`. Japanese needs the extra
phonemizer (`python3 -m pip install pyopenjtalk-plus`); without it Piper
reports `No module named 'pyopenjtalk'`.

Example, for one pack:

```sh
python3 tools/make_audio.py --lang ja --engine piper --voice /path/to/ja_JP-hi_fi_captain-medium.onnx
python3 tools/make_audio.py --lang ja --check
```

## The local conversation model

`local_model.sh` starts the llama.cpp server built under `.tools/`, using the
small GGUF model. It is optional: the app keeps Offline practice when it is not
running, and every AI assist falls back to the authored pack.

```sh
# once, on a machine with a C++ toolchain and cmake
cmake -S .tools/llama.cpp -B .tools/llama.cpp/build -DCMAKE_BUILD_TYPE=Release
cmake --build .tools/llama.cpp/build -j --target llama-server

# download one small model (Qwen 2.5 1.5B Q4 is about 1.1 GB)
curl -fL -o .tools/models/qwen2.5-1.5b-instruct-q4_k_m.gguf \
  https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf

# run it on the port the app probes
tools/local_model.sh
```

The server exposes an OpenAI-compatible `/v1` API. In **Settings**, press
**Find local model**; the app probes `http://localhost:8080` and
`http://localhost:11434`, stores the endpoint and model, and switches the
conversation engine to the local model. The same endpoint is used by
**Suggest words** on the word-set screen and **Suggest with local model** on a
planned lesson. If the server is not running, those buttons use the pack's
topic planner instead.

The app never loads the model, a Python binding or a browser runtime itself. It
talks HTTP to the local server, so there is no new runtime dependency.

## The neural path (a machine with internet)

Piper is not a dependency of the repo. It is only needed when you want to
*regenerate* the clips with a neural voice. On a machine where you can install
packages:

1. Install Piper. The package ships the `piper` CLI:

   ```sh
   python3 -m pip install piper-tts
   ```

2. Download a Spanish voice. Piper needs the model **and** its `.onnx.json`
   sidecar. For example, `es_ES-sharvard-medium`:

   ```sh
   curl -L -o es_ES-sharvard-medium.onnx \
     https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx
   curl -L -o es_ES-sharvard-medium.onnx.json \
     https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx.json
   ```

   Another good choice is `es_ES-davefx-medium`; use the same two URLs with
   `davefx` in both path and file name. Keep both files together.

3. Render. Either pass the model path directly:

   ```sh
   python3 tools/make_audio.py --engine piper --voice ./es_ES-sharvard-medium.onnx
   ```

   or a bare name, which is looked up in the search path described below:

   ```sh
   python3 tools/make_audio.py --engine piper --voice es_ES-sharvard-medium
   ```

That is the whole neural path: install Piper, download a voice, run one
command. The generator still trims, resamples, fades and normalises, so the
browser contract does not change.

`--engine piper` is strict: if Piper or the voice is missing it prints an
actionable error and exits non-zero. It never silently renders eSpeak audio and
calls it neural.

### Voice search path

A bare `--voice` name is resolved in this order:

- the current directory, the repo root, `voices/`, `models/`, `tools/voices/`,
  `assets/voices/`
- directories listed in `PIPER_VOICES` or `PIPER_VOICE_DIR` (split like `PATH`)

`es_ES-sharvard-medium.onnx` and `es_ES-davefx-medium.onnx` are preferred; any
other `es_*.onnx` is a fallback. The `.onnx.json` sidecar must sit next to the
chosen model.

## The fallback used here (eSpeak)

eSpeak NG needs no download and no Python package: the generator loads
`libespeak-ng` with `ctypes`. If the shared library is available:

```sh
python3 tools/make_audio.py --engine espeak
```

This is the path to use on a machine with no network access, no pip, or no
willingness to install a neural runtime. `auto` selects it when Piper is not
fully available, and says in one line which backend it is using and why.

**Be honest about the quality:** eSpeak is formant synthesis. It produces clear,
deterministic Spanish, but it is synthetic speech processing, not a human
recording. It can never sound human. It is the offline fallback, not the
quality target. If voice quality matters, use Piper.

## CLI

```
python3 tools/make_audio.py [--lang CODE] [--engine auto|espeak|piper]
                            [--voice PATH|NAME] [--piper-bin PATH]
                            [--check]
```

- `--lang CODE` — pack under `src/lang/` (default `es`). Spanish keeps its
  historical flat output; every other pack writes `assets/audio/<code>/`.

- `--engine auto` (default) — Piper when both a Piper backend (CLI or Python
  package) and a voice are found; otherwise eSpeak, with a one-line reason.
- `--engine espeak` — libespeak-ng via ctypes.
- `--engine piper` — Piper only. Requires `--voice` (or a detectable voice);
  fails with the install command if the backend is missing.
- `--voice PATH|NAME` — the `.onnx` model, or a bare name from the search path.
- `--piper-bin PATH` — use a specific `piper` executable instead of `piper` on
  `PATH`.
- `--check` — read the pack's two decks and manifest, then verify that every item
  id has an entry, every referenced file exists and is larger than 2 KB, and
  every file is mono 16-bit PCM at 16 kHz. It renders nothing. It exits `0`
  when complete and `1` with a list of gaps otherwise.

### Typical output

```text
$ python3 tools/make_audio.py --check
make_audio --check: OK
  items: 102
  clips: 102, 4007 KB
  every item has a manifest entry
  every clip exists, is > 2 KB, and is mono 16-bit PCM at 16 kHz
```

The item count follows the decks; it changes when content changes. Regenerate
after editing the pack's `concepts.js` or `phrases.js`.

## What gets generated

Concepts are spoken as `article + word` (`la casa`, `el agua`). A French
elided article is joined without a space (`l'eau`, not `l' eau`). Phrases are
spoken as their `text`. Ids become ASCII-safe file names:
`café` → `cafe.wav`, `ph-como-estas` → `ph-como-estas.wav`. The manifest key
remains the original id.

The parser is intentionally small: it reads the flat `{ ... }` object literals
in the two data files, so the tool needs no JavaScript runtime and adds no
Python dependency.

## Troubleshooting

- **“Piper is not installed”** — run `python3 -m pip install piper-tts`, or
  point `--piper-bin` at an existing `piper` executable. On a machine without
  pip or network, use `--engine espeak`.
- **“No Spanish Piper voice found”** — pass `--voice /path/to/model.onnx` or
  place the model in one of the search directories. Download both the `.onnx`
  and `.onnx.json` files.
- **“voice config … is missing”** — the `.onnx.json` sidecar was not downloaded
  or was renamed. Piper cannot load a model without it.
- **Audio exists but `--check` fails** — a deck changed after the last render.
  Re-run the generator, then re-run `--check`.
- **Verify the whole app** — `node --test tests/*.test.js`. The audio coverage
  test in `tests/phrases.test.js` checks the manifest against both decks; it
  should pass exactly when `--check` passes.
