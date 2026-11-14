# `make_audio.py` — pre-rendered pronunciation

The app plays ordinary WAV files, so it needs no installed system voice at
runtime. This tool renders one clip per item in `src/data.js` and
`src/phrases.js` and writes the manifest the app loads.

```sh
python3 tools/make_audio.py --engine espeak   # fallback, no network needed
python3 tools/make_audio.py                   # auto: Piper if available, else eSpeak
python3 tools/make_audio.py --check           # verify without rendering
```

| | |
|---|---|
| Backend | `espeak` (libespeak-ng via ctypes) or `piper` (neural TTS) |
| Output | `assets/audio/<slug>.wav`, one clip per item |
| Format | mono, 16-bit PCM, 16 kHz |
| Processing | silence-trimmed, edge-faded, peak-normalised |
| Manifest | `assets/audio/manifest.js` — `window.SEMA_AUDIO = { "<id>": "assets/audio/<slug>.wav", ... }` |

The output contract is deliberately the same for both backends. `index.html`
and `tests/phrases.test.js` depend on it; changing the format means changing
the app, which is out of scope for this tool.

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
python3 tools/make_audio.py [--engine auto|espeak|piper]
                            [--voice PATH|NAME] [--piper-bin PATH]
                            [--check]
```

- `--engine auto` (default) — Piper when both a Piper backend (CLI or Python
  package) and a voice are found; otherwise eSpeak, with a one-line reason.
- `--engine espeak` — libespeak-ng via ctypes.
- `--engine piper` — Piper only. Requires `--voice` (or a detectable voice);
  fails with the install command if the backend is missing.
- `--voice PATH|NAME` — the `.onnx` model, or a bare name from the search path.
- `--piper-bin PATH` — use a specific `piper` executable instead of `piper` on
  `PATH`.
- `--check` — read the two decks and the manifest, then verify that every item
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
after editing `src/data.js` or `src/phrases.js`.

## What gets generated

`src/data.js` concepts are spoken as `article + word` (`la casa`, `el agua`);
phrases are spoken as their `text`. Ids become ASCII-safe file names:
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
