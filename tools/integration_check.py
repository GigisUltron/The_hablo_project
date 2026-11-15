#!/usr/bin/env python3
"""Integration checks for the shipped content and optional local model.

Run from the repository root:

    .tools/venv/bin/python tools/integration_check.py --model .tools/models/qwen2.5-0.5b-instruct-q4_k_m.gguf

This is deliberately outside `make check`: a model is optional. Without one it
still verifies the five advanced packs, their levels, glosses, synonyms,
manifests and WAV files. With one it loads the GGUF and asks for a real reply.
"""
import argparse
import json
import pathlib
import socket
import subprocess
import sys
import tempfile
import time
import wave

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import model_policy  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
ADVANCED = {
    "es": ["decisión", "propósito", "desafío", "logro", "riesgo"],
    "fr": ["décision", "but", "défi", "réussite", "risque"],
    "en": ["en-decision", "en-purpose", "en-challenge", "en-achievement", "en-risk"],
    "it": ["it-decisione", "it-scopo", "it-sfida", "it-risultato", "it-rischio"],
    "ru": ["ru-reshenie", "ru-tsel", "ru-vyzov", "ru-dostizhenie", "ru-risk"],
    "pt": ["pt-decision", "pt-purpose", "pt-challenge", "pt-achievement", "pt-risk"],
    "de": ["de-decision", "de-purpose", "de-challenge", "de-achievement", "de-risk"],
    "nl": ["nl-decision", "nl-purpose", "nl-challenge", "nl-achievement", "nl-risk"],
    "tr": ["tr-decision", "tr-purpose", "tr-challenge", "tr-achievement", "tr-risk"],
    "ar": ["ar-decision", "ar-purpose", "ar-challenge", "ar-achievement", "ar-risk"],
    "hi": ["hi-decision", "hi-purpose", "hi-challenge", "hi-achievement", "hi-risk"],
    "ja": ["ja-decision", "ja-purpose", "ja-challenge", "ja-achievement", "ja-risk"],
    "zh": ["zh-decision", "zh-purpose", "zh-challenge", "zh-achievement", "zh-risk"],
}
BANDS = {"B1", "B2", "C1"}


def fail(message):
    print("FAIL " + message)
    raise SystemExit(1)


def load_js(path):
    import subprocess
    result = subprocess.run(
        ["node", "-e", "const x=require(%s); console.log(JSON.stringify(x));" % json.dumps(str(path))],
        cwd=ROOT, capture_output=True, text=True
    )
    if result.returncode != 0:
        fail("could not read %s: %s" % (path, result.stderr.strip()))
    return json.loads(result.stdout)


def check_content():
    for code, ids in ADVANCED.items():
        base = ROOT / "src" / "lang" / code
        concepts = load_js(base / "concepts.js")["concepts"]
        levels = load_js(base / "levels.js")
        glosses = load_js(base / "glosses.js")
        by_id = {item["id"]: item for item in concepts}
        for item_id in ids:
            item = by_id.get(item_id)
            if not item:
                fail("%s/%s missing" % (code, item_id))
            if levels.get(item_id) not in BANDS:
                fail("%s/%s has no advanced level" % (code, item_id))
            if not glosses.get(item_id):
                fail("%s/%s has no English gloss" % (code, item_id))
            if not item.get("synonyms"):
                fail("%s/%s has no synonym task" % (code, item_id))
        print("ok  %-2s %d advanced words" % (code, len(ids)))


def manifest(code):
    path = ROOT / "assets" / "audio" / ("manifest.js" if code == "es" else code + "/manifest.js")
    source = path.read_text(encoding="utf-8")
    return json.loads(source[source.index("{"):source.rindex("}") + 1])


def check_audio():
    for code, ids in ADVANCED.items():
        table = manifest(code)
        for item_id in ids:
            relative = table.get(item_id)
            if not relative:
                fail("%s/%s has no audio manifest entry" % (code, item_id))
            path = ROOT / relative
            if not path.is_file():
                fail("%s/%s audio missing: %s" % (code, item_id, relative))
            with wave.open(str(path), "rb") as wav:
                if wav.getnchannels() != 1 or wav.getsampwidth() != 2 or wav.getframerate() != 16000:
                    fail("%s/%s is not mono 16-bit 16 kHz" % (code, item_id))
        print("ok  %-2s %d audio clips" % (code, len(ids)))


def check_model_policy():
    with tempfile.TemporaryDirectory() as temp:
        root = pathlib.Path(temp)
        for spec in model_policy.MODELS:
            (root / spec["file"]).write_bytes(b"x")
        cases = [(None, "qwen2.5-0.5b"), (1200, "qwen2.5-0.5b"), (3000, "qwen2.5-1.5b"),
                 (5500, "qwen2.5-3b"), (8000, "qwen3-4b")]
        for free, expected in cases:
            spec, path = model_policy.choose(free, root)
            if not spec or spec["id"] != expected:
                fail("model policy chose %s for %s MB, expected %s" %
                     (spec and spec["id"], free, expected))
            if path is None or not path.is_file():
                fail("model policy returned no file for %s MB" % free)
    print("ok  model policy: 0.5B / 1.5B / 3B / 4B by free RAM")


def check_server():
    """Start the real static server on a free local port and prove it stays up."""
    sock = socket.socket()
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
    sock.close()
    process = subprocess.Popen(
        [sys.executable, "-u", str(ROOT / "serve.py"), "--no-open", "--port", str(port)],
        cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True
    )
    try:
        time.sleep(1.2)
        if process.poll() is not None:
            output = process.stdout.read() if process.stdout else ""
            fail("static server exited early: " + output.strip()[-300:])
        print("ok  static server started on port %d" % port)
    finally:
        process.terminate()
        try:
            process.wait(timeout=4)
        except subprocess.TimeoutExpired:
            process.kill()


def check_model(model):
    try:
        from llama_cpp import Llama
    except ImportError:
        print("skip local model: llama-cpp-python is not installed in this interpreter")
        return False
    if not model.is_file():
        print("skip local model: %s not found" % model)
        return False
    print("run local model inference: %s" % model.name)
    llm = Llama(model_path=str(model), n_ctx=512, n_threads=2, verbose=False)
    out = llm.create_chat_completion(
        messages=[
            {"role": "system", "content": "Reply in Spanish with exactly one short sentence."},
            {"role": "user", "content": "Di hola a una nueva estudiante."},
        ],
        max_tokens=24, temperature=0.2
    )
    text = (out["choices"][0]["message"]["content"] or "").strip()
    if not text:
        fail("local model returned an empty reply")
    print("ok  local model reply: " + text.replace("\n", " ")[:160])
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=pathlib.Path,
                        default=ROOT / ".tools" / "models" / "qwen2.5-0.5b-instruct-q4_k_m.gguf")
    parser.add_argument("--no-model", action="store_true")
    args = parser.parse_args()
    check_content()
    check_audio()
    check_model_policy()
    check_server()
    if not args.no_model:
        check_model(args.model)
    print("integration check passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
