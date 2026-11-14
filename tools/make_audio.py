#!/usr/bin/env python3
"""Pre-render every vocabulary word and phrase to a WAV file.

Why this exists: the browser's speech synthesis needs a voice installed by the
operating system, and plenty of machines have none — the app then "says" the
word into silence. Rendering the audio here removes that dependency: the demo
plays plain WAV files and needs no voices at runtime.

Two backends produce the same output contract:

    piper   neural TTS through the Piper CLI or the piper-tts Python package
    espeak  formant synthesis through libespeak-ng (ctypes, as before)

    python3 tools/make_audio.py                          # auto: Piper if installed, else eSpeak
    python3 tools/make_audio.py --lang fr --engine espeak
    python3 tools/make_audio.py --engine piper --voice es_ES-sharvard-medium
    python3 tools/make_audio.py --check
    python3 tools/make_audio.py --lang fr --check

A pack is read from src/lang/<code>/ and written to assets/audio/<code>/ with
its own manifest.js. Spanish is the historical exception: it keeps the existing
assets/audio/*.wav and assets/audio/manifest.js so its clips are never rewritten
by accident.

Every clip is mono 16-bit PCM at 16 kHz, silence-trimmed, edge-faded and
peak-normalised, and the pack's manifest.js maps every item id to its file.
That contract is what index.html and the tests consume; both backends must
keep it identical.

Quality note: eSpeak is formant synthesis, not a recording of a person. It is
intelligible and deterministic, but it cannot sound human. Piper is the
neural path; see tools/README.md.

Standard library only. Piper is optional and is only needed to *regenerate*
audio neutrally; the app never loads it.
"""

import argparse
import array
import ctypes
import ctypes.util
import importlib.util
import io
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import unicodedata
import wave

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "audio"

AUDIO_OUTPUT_SYNCHRONOUS = 2
ESP_RATE, ESP_VOLUME, ESP_PITCH = 1, 2, 3

NATIVE_RATE = 22050
TARGET_RATE = 16000
TARGET_PEAK = 0.88
FADE_S = 0.006
TRIM_PAD_S = 0.04
MIN_BYTES = 2 * 1024

PIPER_INSTALL = "python3 -m pip install piper-tts"
PIPER_EXAMPLE_VOICE = "es_ES-sharvard-medium"
PREFERRED_VOICES = ("es_ES-sharvard-medium.onnx", "es_ES-davefx-medium.onnx")

# Pack code -> eSpeak voice name. eSpeak has fr; Mandarin is poor and should
# go through Piper instead (see docs/ONBOARDING.md).
ESPEAK_VOICES = {"es": "es", "fr": "fr"}

# Pack code -> Piper voice filenames to look for when --voice is omitted.
PIPER_VOICES = {"es": PREFERRED_VOICES, "fr": ()}

LANG_NAMES = {"es": "Spanish", "fr": "French", "it": "Italian", "ru": "Russian", "en": "English", "zh": "Chinese"}

CANDIDATES = [
    "libespeak-ng.so.1",
    "libespeak-ng.so",
]


class AudioError(Exception):
    """A problem worth printing without a traceback."""


def load_lib():
    names = []
    found = ctypes.util.find_library("espeak-ng")
    if found:
        names.append(found)
    names.extend(n for n in CANDIDATES if n not in names)

    for name in names:
        try:
            return ctypes.CDLL(name)
        except OSError:
            continue
    raise AudioError(
        "libespeak-ng not found. Install the espeak-ng library, or use "
        "--engine piper. The app itself does not need either at runtime."
    )


def slug(text):
    """ASCII-safe file name."""
    folded = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", folded.lower()).strip("-")


def _objects(source):
    """Yield each flat {...} object in a dataset file, in file order.

    The datasets are plain object literals with no nested braces; this avoids
    needing a JavaScript parser for a build-time tool.
    """
    for match in re.finditer(r"\{[^{}]*\}", source):
        yield match.group(0)


def _field(block, name):
    match = re.search(r'\b%s\s*:\s*"([^"]*)"' % re.escape(name), block)
    return match.group(1) if match else None


def pack_dir(code="es"):
    return ROOT / "src" / "lang" / code


def audio_dir(code="es"):
    """Spanish keeps its historical flat folder; every other pack is nested."""
    return OUT if code == "es" else OUT / code


def manifest_path(code="es"):
    return OUT / "manifest.js" if code == "es" else audio_dir(code) / "manifest.js"


def language_name(code):
    return LANG_NAMES.get(code, code)


def items(code="es"):
    """(id, spoken text) for concepts and phrases, without a JS parser."""
    out = []
    folder = pack_dir(code)

    data = (folder / "concepts.js").read_text(encoding="utf-8")
    for block in _objects(data):
        word = _field(block, "word")
        article = _field(block, "article")
        concept_id = _field(block, "id")
        if not concept_id or not word or article is None:
            continue
        if not article:
            spoken = word
        elif article.endswith("'"):
            spoken = article + word
        else:
            spoken = article + " " + word
        out.append((concept_id, spoken))

    phrases = (folder / "phrases.js").read_text(encoding="utf-8")
    for block in _objects(phrases):
        phrase_id = _field(block, "id")
        text = _field(block, "text")
        if phrase_id and phrase_id.startswith("ph-") and text:
            out.append((phrase_id, text))

    return out


def trim(samples, rate=NATIVE_RATE, threshold=260):
    if not samples:
        return samples
    first, last = 0, len(samples) - 1
    while first < last and abs(samples[first]) < threshold:
        first += 1
    while last > first and abs(samples[last]) < threshold:
        last -= 1
    pad = int(rate * TRIM_PAD_S)
    return samples[max(0, first - pad): min(len(samples), last + pad)]


def resample(samples, src=NATIVE_RATE, dst=TARGET_RATE):
    """Linear interpolation. Speech survives 22k -> 16k intact."""
    if src == dst or not samples:
        return samples
    count = int(len(samples) * dst / src)
    out = []
    step = src / dst
    last_index = len(samples) - 1
    for i in range(count):
        pos = i * step
        i0 = int(pos)
        frac = pos - i0
        s0 = samples[i0]
        s1 = samples[i0 + 1] if i0 < last_index else s0
        out.append(int(s0 + (s1 - s0) * frac))
    return out


def normalise(samples, peak=TARGET_PEAK):
    top = max((abs(s) for s in samples), default=0)
    if top == 0:
        return samples
    scale = (peak * 32767) / top
    return [int(s * scale) for s in samples]


def fade(samples, rate=TARGET_RATE, seconds=FADE_S):
    n = min(int(rate * seconds), len(samples) // 2)
    if n <= 0:
        return samples
    for i in range(n):
        gain = i / n
        samples[i] = int(samples[i] * gain)
        samples[-1 - i] = int(samples[-1 - i] * gain)
    return samples


def write_wav(samples, path):
    data = array.array("h", (max(-32768, min(32767, int(s))) for s in samples))
    if sys.byteorder == "big":
        data.byteswap()
    with wave.open(str(path), "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(TARGET_RATE)
        handle.writeframes(data.tobytes())


def read_wav(source):
    """Return (mono int samples, sample rate) from a 16-bit PCM WAV."""
    if hasattr(source, "read"):
        source.seek(0)
        target = source
    else:
        target = str(source)

    try:
        with wave.open(target, "rb") as handle:
            channels = handle.getnchannels()
            width = handle.getsampwidth()
            rate = handle.getframerate()
            raw = handle.readframes(handle.getnframes())
    except (wave.Error, OSError) as exc:
        raise AudioError("could not read WAV %s: %s" % (source, exc))

    if width != 2:
        raise AudioError(
            "Piper produced %d-bit audio; this tool expects 16-bit PCM "
            "(use a standard Piper voice)." % (width * 8)
        )

    data = array.array("h")
    data.frombytes(raw)
    if sys.byteorder == "big":
        data.byteswap()

    if channels == 1:
        samples = list(data)
    else:
        samples = [
            int(round(sum(data[i:i + channels]) / channels))
            for i in range(0, len(data) - channels + 1, channels)
        ]
    return samples, rate


class EspeakBackend:
    name = "espeak"

    def __init__(self, code="es"):
        self.code = code
        self.lib = load_lib()
        self.lib.espeak_Initialize.restype = ctypes.c_int
        self.lib.espeak_Initialize.argtypes = [
            ctypes.c_int, ctypes.c_int, ctypes.c_char_p, ctypes.c_int
        ]

        rate = self.lib.espeak_Initialize(AUDIO_OUTPUT_SYNCHRONOUS, 0, None, 0)
        if rate <= 0:
            raise AudioError("espeak could not start")

        self.buffer = []
        callback_type = ctypes.CFUNCTYPE(
            ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.c_void_p
        )

        def callback(wav, count, _event):
            if count > 0:
                self.buffer.extend(wav[:count])
            return 0

        self._callback = callback_type(callback)
        self.lib.espeak_SetSynthCallback(self._callback)

        self.lib.espeak_SetVoiceByName.argtypes = [ctypes.c_char_p]
        voice_name = ESPEAK_VOICES.get(code, code).encode()
        if self.lib.espeak_SetVoiceByName(voice_name) != 0:
            raise AudioError("no %s voice in espeak" % language_name(code))

        self.lib.espeak_SetParameter(ESP_RATE, 125, 0)   # slower than the 175 default
        self.lib.espeak_SetParameter(ESP_PITCH, 52, 0)   # a touch above flat
        self.lib.espeak_SetParameter(ESP_VOLUME, 100, 0)

        self.lib.espeak_Synth.argtypes = [
            ctypes.c_void_p, ctypes.c_size_t, ctypes.c_uint, ctypes.c_int,
            ctypes.c_uint, ctypes.c_uint, ctypes.POINTER(ctypes.c_uint), ctypes.c_void_p,
        ]

    def synthesize(self, text):
        self.buffer.clear()
        raw = text.encode("utf-8")
        self.lib.espeak_Synth(raw, len(raw) + 1, 0, 1, 0, 1, None, None)
        self.lib.espeak_Synchronize()
        return list(self.buffer), NATIVE_RATE


def voice_dirs():
    """Where a bare --voice name is looked up."""
    dirs = [
        pathlib.Path.cwd(),
        ROOT,
        ROOT / "voices",
        ROOT / "models",
        ROOT / "tools" / "voices",
        ROOT / "assets" / "voices",
    ]
    for variable in ("PIPER_VOICES", "PIPER_VOICE_DIR"):
        for part in os.environ.get(variable, "").split(os.pathsep):
            if part.strip():
                dirs.append(pathlib.Path(part).expanduser())

    seen, unique = set(), []
    for directory in dirs:
        key = str(directory)
        if key not in seen:
            seen.add(key)
            unique.append(directory)
    return unique


def locate_voice(value=None, code="es"):
    """Resolve --voice (a path or a bare name) to a .onnx file, or None."""
    preferred = PIPER_VOICES.get(code, ())
    if value:
        raw = pathlib.Path(value).expanduser()
        if raw.is_file() and raw.suffix.lower() == ".onnx":
            return raw
        if raw.is_dir():
            for name in preferred:
                candidate = raw / name
                if candidate.is_file():
                    return candidate
            matches = sorted(raw.glob(code + "_*.onnx"))
            return matches[0] if matches else None

        name = raw.name if raw.suffix.lower() == ".onnx" else raw.name + ".onnx"
        # A path the caller spelled out is not searched elsewhere under that
        # name; only a bare name is resolved through the search path.
        if raw.parent != pathlib.Path("."):
            return None
        for directory in voice_dirs():
            candidate = directory / name
            if candidate.is_file():
                return candidate
        return None

    for directory in voice_dirs():
        for name in preferred:
            candidate = directory / name
            if candidate.is_file():
                return candidate
    for directory in voice_dirs():
        matches = sorted(directory.glob(code + "_*.onnx"))
        if matches:
            return matches[0]
    return None


def voice_config(model):
    return pathlib.Path(str(model) + ".json")


def piper_module_available():
    try:
        return importlib.util.find_spec("piper") is not None
    except (ImportError, ValueError):
        return False


def find_piper_binary(explicit=None):
    if explicit:
        path = pathlib.Path(explicit).expanduser()
        if path.is_file():
            if not os.access(path, os.X_OK):
                raise AudioError("--piper-bin is not executable: %s" % explicit)
            return str(path)
        found = shutil.which(explicit)
        if found:
            return found
        raise AudioError("--piper-bin not found: %s" % explicit)
    return shutil.which("piper")


def piper_missing_message():
    return (
        "Piper is not installed. Install it with:\n"
        "  %s\n"
        "Then download a voice for the target language and run:\n"
        "  python3 tools/make_audio.py --lang <code> --engine piper --voice <model.onnx>\n"
        "Model URLs are in tools/README.md." % PIPER_INSTALL
    )


def voice_missing_message(value=None, code="es"):
    if value:
        lead = "Piper voice %r was not found." % value
    else:
        lead = "No %s Piper voice was found." % language_name(code)
    return (
        "%s Pass --voice /path/to/<voice>.onnx, or put the model in one of the "
        "searched directories (see tools/README.md).\n"
        "Then run:\n"
        "  python3 tools/make_audio.py --lang %s --engine piper --voice <model.onnx>"
        % (lead, code)
    )


def require_voice_config(model):
    if not voice_config(model).is_file():
        raise AudioError(
            "Piper needs the voice config next to the model: %s.json is missing. "
            "Download both files for the voice." % model.name
        )


def _brief(text, limit=240):
    text = " ".join(str(text).split())
    return text[-limit:]


class PiperBackend:
    name = "piper"

    def __init__(self, model, binary=None):
        self.model = pathlib.Path(model)
        self.binary = binary
        self._voice = None

    def synthesize(self, text):
        with tempfile.TemporaryDirectory(prefix="sema-piper-") as temp_dir:
            out = pathlib.Path(temp_dir) / "clip.wav"
            if self.binary:
                self._run_cli(text, out)
            else:
                self._run_module(text, out)
            return read_wav(out)

    def _run_cli(self, text, out):
        attempts = (
            ("--model", "--output_file"),
            ("--model", "--output-file"),
            ("-m", "-f"),
        )
        errors = []
        for model_flag, out_flag in attempts:
            command = [
                self.binary, model_flag, str(self.model), out_flag, str(out)
            ]
            try:
                result = subprocess.run(
                    command,
                    input=text.encode("utf-8"),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=180,
                )
            except FileNotFoundError:
                raise AudioError("Piper binary is not runnable: %s" % self.binary)
            except subprocess.TimeoutExpired:
                raise AudioError("Piper timed out while saying %r" % _brief(text, 60))

            if result.returncode == 0 and out.is_file() and out.stat().st_size > 44:
                return

            error = result.stderr.decode("utf-8", "replace")
            errors.append(error)
            lowered = error.lower()
            flag_problem = any(
                token in lowered
                for token in ("unrecognized", "unknown option", "no such option", "invalid option")
            )
            if result.returncode != 0 and not flag_problem:
                break

        message = _brief(errors[-1]) if errors else "no output"
        raise AudioError("Piper failed for %r: %s" % (_brief(text, 60), message))

    def _run_module(self, text, out):
        if self._voice is None:
            try:
                import piper
            except Exception as exc:  # noqa: BLE001 - report any import failure plainly
                raise AudioError("piper-tts is not importable: %s" % _brief(exc))
            if not hasattr(piper, "PiperVoice"):
                raise AudioError(
                    "The installed 'piper' module is not piper-tts (no PiperVoice)."
                )
            try:
                self._voice = piper.PiperVoice.load(str(self.model))
            except Exception as exc:  # noqa: BLE001 - surface the library's reason
                raise AudioError(
                    "Piper could not load %s: %s" % (self.model.name, _brief(exc))
                )

        buffer = io.BytesIO()
        try:
            with wave.open(buffer, "wb") as handle:
                if hasattr(self._voice, "synthesize_wav"):
                    self._voice.synthesize_wav(text, handle)
                else:
                    self._voice.synthesize(text, handle)
        except Exception as exc:  # noqa: BLE001 - surface the library's reason
            raise AudioError("Piper synthesis failed: %s" % _brief(exc))

        data = buffer.getvalue()
        if len(data) <= 44:
            raise AudioError("Piper produced no audio for %r" % _brief(text, 60))
        out.write_bytes(data)


def auto_backend(args, code="es"):
    binary = find_piper_binary(args.piper_bin)
    module = piper_module_available()
    model = locate_voice(args.voice, code)

    if not binary and not module:
        reason = "piper-tts not installed — install: %s" % PIPER_INSTALL
    elif model is None:
        reason = "no %s Piper voice found (pass --voice <model.onnx>)" % language_name(code)
    elif not voice_config(model).is_file():
        reason = "Piper voice config missing (%s.json)" % model.name
    else:
        backend = PiperBackend(model, binary)
        route = "piper CLI" if binary else "piper Python package"
        print("audio: engine=piper (voice %s, via %s)" % (model.name, route))
        return backend

    print("audio: engine=espeak (%s)" % reason)
    return EspeakBackend(code)


def choose_backend(args, code="es"):
    if args.engine == "espeak":
        print("audio: engine=espeak (requested)")
        return EspeakBackend(code)

    if args.engine == "piper":
        binary = find_piper_binary(args.piper_bin)
        if not binary and not piper_module_available():
            raise AudioError(piper_missing_message())
        model = locate_voice(args.voice, code)
        if model is None:
            raise AudioError(voice_missing_message(args.voice, code))
        require_voice_config(model)
        print(
            "audio: engine=piper (voice %s, via %s)"
            % (model.name, "piper CLI" if binary else "piper Python package")
        )
        return PiperBackend(model, binary)

    return auto_backend(args, code)


def render(backend, code="es"):
    out = audio_dir(code)
    out.mkdir(parents=True, exist_ok=True)
    manifest = {}
    total = 0
    seen_slugs = {}
    prefix = "assets/audio/" if code == "es" else "assets/audio/%s/" % code

    all_items = items(code)
    if not all_items:
        raise AudioError(
            "no items found in %s" % (pack_dir(code) / "concepts.js").relative_to(ROOT)
        )

    for item_id, spoken in all_items:
        name = slug(item_id) + ".wav"
        if name in seen_slugs and seen_slugs[name] != item_id:
            raise AudioError(
                "ids %r and %r both map to %s" % (seen_slugs[name], item_id, name)
            )
        seen_slugs[name] = item_id

        raw, source_rate = backend.synthesize(spoken)
        samples = resample(trim(raw, source_rate), source_rate, TARGET_RATE)
        samples = normalise(samples)
        samples = fade(samples)
        if not samples:
            print("  ! empty audio for", item_id)
            continue

        path = out / name
        write_wav(samples, path)

        manifest[item_id] = prefix + name
        total += path.stat().st_size
        print("  %-12s %5d bytes  %s" % (item_id, path.stat().st_size, spoken))

    manifest_path(code).write_text(
        "/* generated by tools/make_audio.py — do not edit by hand */\n"
        "window.SEMA_AUDIO = " + json.dumps(manifest, ensure_ascii=False).replace(", ", ",") + ";\n",
        encoding="utf-8",
    )

    print("\n%d files, %.0f KB total at %d Hz" % (len(manifest), total / 1024, TARGET_RATE))


def load_manifest(code="es"):
    path = manifest_path(code)
    if not path.is_file():
        raise AudioError("%s is missing; run the generator first." % path.relative_to(ROOT))
    source = path.read_text(encoding="utf-8")
    match = re.search(r"window\.SEMA_AUDIO\s*=\s*(\{.*\})\s*;?\s*$", source, re.S)
    if not match:
        raise AudioError("%s does not define window.SEMA_AUDIO." % path.relative_to(ROOT))
    try:
        manifest = json.loads(match.group(1))
    except json.JSONDecodeError as exc:
        raise AudioError("%s is not valid JSON: %s" % (path.relative_to(ROOT), exc))
    if not isinstance(manifest, dict):
        raise AudioError("%s does not contain an object." % path.relative_to(ROOT))
    return manifest


def run_check(code="es"):
    all_items = items(code)
    manifest = load_manifest(code)

    problems = []
    if not all_items:
        problems.append("no items found in %s" % (pack_dir(code) / "concepts.js").relative_to(ROOT))

    seen = set()
    for item_id, _spoken in all_items:
        if item_id in seen:
            problems.append('duplicate item id "%s"' % item_id)
        seen.add(item_id)
        if item_id not in manifest:
            problems.append('no manifest entry for "%s"' % item_id)

    audio_root = audio_dir(code).resolve()
    total = 0
    for item_id, relative in manifest.items():
        if not isinstance(relative, str) or not relative:
            problems.append('manifest entry for "%s" is not a path' % item_id)
            continue

        path = ROOT / relative
        try:
            resolved = path.resolve()
        except OSError:
            problems.append('unreadable path for "%s": %s' % (item_id, relative))
            continue

        if resolved != audio_root and audio_root not in resolved.parents:
            problems.append('path for "%s" is outside assets/audio' % item_id)
            continue
        if not resolved.is_file():
            problems.append('missing file for "%s": %s' % (item_id, relative))
            continue

        size = resolved.stat().st_size
        total += size
        if size <= MIN_BYTES:
            problems.append(
                'clip too small for "%s": %d bytes (need > %d)' % (item_id, size, MIN_BYTES)
            )
            continue

        try:
            with wave.open(str(resolved), "rb") as handle:
                channels = handle.getnchannels()
                width = handle.getsampwidth()
                rate = handle.getframerate()
                frames = handle.getnframes()
        except (wave.Error, OSError) as exc:
            problems.append('unreadable WAV for "%s": %s' % (item_id, exc))
            continue

        if (channels, width, rate) != (1, 2, TARGET_RATE) or frames == 0:
            problems.append(
                'clip for "%s" is %d ch / %d-bit / %d Hz, expected 1 ch / 16-bit / %d Hz'
                % (item_id, channels, width * 8, rate, TARGET_RATE)
            )

    if problems:
        print("make_audio --check: %d problem(s)" % len(problems))
        for problem in problems:
            print("  - " + problem)
        return 1

    stale = sorted(set(manifest) - seen)
    print("make_audio --check: OK")
    print("  items: %d" % len(all_items))
    print("  clips: %d, %.0f KB" % (len(manifest), total / 1024))
    print("  every item has a manifest entry")
    print("  every clip exists, is > 2 KB, and is mono 16-bit PCM at 16 kHz")
    if stale:
        print("  warning: %d manifest entr%s no longer in the decks: %s"
              % (len(stale), "y" if len(stale) == 1 else "ies", ", ".join(stale)))
    return 0


def lang_code(value):
    if not re.fullmatch(r"[a-z]{2}", value or ""):
        raise argparse.ArgumentTypeError("--lang must be a two-letter pack code, e.g. es or fr")
    return value


def parse_args(argv=None):
    parser = argparse.ArgumentParser(
        description="Pre-render the Python-free audio for the sema demo.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Backends:\n"
            "  auto    Piper when a binary/package and a Spanish voice are found, otherwise eSpeak\n"
            "  piper   neural TTS; fails loudly if Piper or the voice is missing\n"
            "  espeak  libespeak-ng via ctypes (the no-network fallback)\n"
            "\n"
            "Neural path on a machine with internet:\n"
            "  %s\n"
            "  python3 tools/make_audio.py --engine piper --voice %s\n"
            % (PIPER_INSTALL, PIPER_EXAMPLE_VOICE)
        ),
    )
    parser.add_argument(
        "--engine", choices=("auto", "espeak", "piper"), default="auto",
        help="TTS backend (default: auto)",
    )
    parser.add_argument(
        "--voice", metavar="PATH|NAME",
        help="Piper .onnx model, or a bare name resolved from the search path",
    )
    parser.add_argument(
        "--piper-bin", metavar="PATH", help="path to the piper executable",
    )
    parser.add_argument(
        "--lang", metavar="CODE", type=lang_code, default="es",
        help="pack code under src/lang/ (default: es)",
    )
    parser.add_argument(
        "--check", action="store_true",
        help="verify manifest coverage and WAVs without rendering",
    )
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)
    try:
        if args.check:
            return run_check(args.lang)
        backend = choose_backend(args, args.lang)
        render(backend, args.lang)
    except AudioError as exc:
        print("make_audio: %s" % exc, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
