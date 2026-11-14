#!/usr/bin/env python3
"""Pre-render every vocabulary word and phrase to a WAV file.

Why this exists: the browser's speech synthesis needs a voice installed by the
operating system, and plenty of machines have none — the app then "says" the
word into silence. Rendering the audio here removes that dependency: the demo
plays plain WAV files and needs no voices at runtime.

Standard library only (ctypes + wave). It borrows libespeak-ng if it happens to
be installed, so this is a build-time tool, not a runtime dependency.

    python3 tools/make_audio.py

Quality notes — eSpeak is formant synthesis, so it will always sound synthetic.
What is worth doing, and is done here: speak slower than default, keep the full
22 kHz output before resampling to 16 kHz (rather than the 11 kHz of the first
version), trim silence, fade the edges to kill clicks, and normalise the peak so
no word is quieter than another.
"""

import ctypes
import json
import pathlib
import re
import sys
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

CANDIDATES = [
    "/usr/lib/aarch64-linux-gnu/libespeak-ng.so.1",
    "/usr/lib/x86_64-linux-gnu/libespeak-ng.so.1",
    "libespeak-ng.so.1",
]


def load_lib():
    for path in CANDIDATES:
        try:
            return ctypes.CDLL(path)
        except OSError:
            continue
    sys.exit("make_audio: libespeak-ng not found — this tool needs it, the app does not.")


def slug(text):
    """ASCII-safe file name."""
    folded = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", folded.lower()).strip("-")


def items():
    """(id, spoken text) for concepts and phrases, without a JS parser."""
    out = []

    data = (ROOT / "src" / "data.js").read_text(encoding="utf-8")
    for m in re.finditer(
        r'id:\s*"([^"]+)"[^}]*?word:\s*"([^"]+)"[^}]*?article:\s*"([^"]*)"', data, re.S
    ):
        cid, word, article = m.group(1), m.group(2), m.group(3)
        out.append((cid, ("%s %s" % (article, word)) if article else word))

    phrases = (ROOT / "src" / "phrases.js").read_text(encoding="utf-8")
    for m in re.finditer(r'id:\s*"(ph-[^"]+)"[^}]*?text:\s*"([^"]+)"', phrases, re.S):
        out.append((m.group(1), m.group(2)))

    return out


def trim(samples, threshold=260):
    first, last = 0, len(samples) - 1
    while first < last and abs(samples[first]) < threshold:
        first += 1
    while last > first and abs(samples[last]) < threshold:
        last -= 1
    pad = int(NATIVE_RATE * TRIM_PAD_S)
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


def main():
    lib = load_lib()
    lib.espeak_Initialize.restype = ctypes.c_int
    lib.espeak_Initialize.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_char_p, ctypes.c_int]

    rate = lib.espeak_Initialize(AUDIO_OUTPUT_SYNCHRONOUS, 0, None, 0)
    if rate <= 0:
        sys.exit("make_audio: espeak could not start")

    buffer = []

    CB = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.c_void_p)

    def callback(wav, count, _event):
        if count > 0:
            buffer.extend(wav[:count])
        return 0

    keep_alive = CB(callback)
    lib.espeak_SetSynthCallback(keep_alive)

    lib.espeak_SetVoiceByName.argtypes = [ctypes.c_char_p]
    if lib.espeak_SetVoiceByName(b"es") != 0:
        sys.exit("make_audio: no Spanish voice in espeak")

    lib.espeak_SetParameter(ESP_RATE, 125, 0)   # slower than the 175 default
    lib.espeak_SetParameter(ESP_PITCH, 52, 0)   # a touch above flat
    lib.espeak_SetParameter(ESP_VOLUME, 100, 0)

    lib.espeak_Synth.argtypes = [
        ctypes.c_void_p, ctypes.c_size_t, ctypes.c_uint, ctypes.c_int,
        ctypes.c_uint, ctypes.c_uint, ctypes.POINTER(ctypes.c_uint), ctypes.c_void_p,
    ]

    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    total = 0

    for item_id, spoken in items():
        buffer.clear()
        raw = spoken.encode("utf-8")
        lib.espeak_Synth(raw, len(raw) + 1, 0, 1, 0, 1, None, None)
        lib.espeak_Synchronize()

        samples = resample(trim(buffer))
        samples = normalise(samples)
        samples = fade(samples)
        if not samples:
            print("  ! empty audio for", item_id)
            continue

        name = slug(item_id) + ".wav"
        path = OUT / name
        with wave.open(str(path), "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(TARGET_RATE)
            w.writeframes(b"".join(int(s).to_bytes(2, "little", signed=True) for s in samples))

        manifest[item_id] = "assets/audio/" + name
        total += path.stat().st_size
        print("  %-12s %5d bytes  %s" % (item_id, path.stat().st_size, spoken))

    (OUT / "manifest.js").write_text(
        "/* generated by tools/make_audio.py — do not edit by hand */\n"
        "window.SEMA_AUDIO = " + json.dumps(manifest, ensure_ascii=False).replace(", ", ",") + ";\n",
        encoding="utf-8",
    )

    print("\n%d files, %.0f KB total at %d Hz" % (len(manifest), total / 1024, TARGET_RATE))


if __name__ == "__main__":
    main()
