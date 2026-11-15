#!/usr/bin/env python3
"""Install and optionally start hablo's optional local model.

One command on a normal Python 3.9+ machine:

    python3 tools/install_ai.py --start

It installs llama-cpp-python's OpenAI-compatible server into an isolated
.tools/ai-venv, downloads a small Qwen GGUF into .tools/models, and starts the
server on http://127.0.0.1:8080. Nothing here is required by the app; without
it, conversation stays offline and every AI assist falls back to the pack.

The model and venv are ignored by git. On platforms without a prebuilt wheel,
pip may need a C++ compiler; the installer says so rather than pretending.
"""
import argparse
import os
import pathlib
import shutil
import subprocess
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
TOOLS = ROOT / "tools"
MODELS = ROOT / ".tools" / "models"
DEFAULT_MODEL = MODELS / "qwen2.5-0.5b-instruct-q4_k_m.gguf"
DEFAULT_URL = ("https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/"
               "resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf")
ALIAS = "qwen2.5-0.5b-instruct"
CPU_INDEX = "https://abetlen.github.io/llama-cpp-python/whl/cpu"


def say(message):
    print("ai: " + message, flush=True)


def short(value):
    """A command-line path that does not echo the machine's home directory."""
    path = pathlib.Path(str(value))
    try:
        return str(path.resolve().relative_to(ROOT))
    except (ValueError, OSError):
        return path.name if path.is_absolute() else str(value)


def run(command, **kwargs):
    say("$ " + " ".join(short(x) for x in command))
    return subprocess.run(command, **kwargs)


def venv_python(prefix):
    if os.name == "nt":
        return prefix / "Scripts" / "python.exe"
    return prefix / "bin" / "python"


def has_server(python):
    if not pathlib.Path(python).is_file():
        return False
    result = subprocess.run(
        [str(python), "-c", "import llama_cpp, llama_cpp.server"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    return result.returncode == 0


def choose_python(explicit):
    if explicit:
        if not has_server(explicit):
            raise SystemExit("ai: %s cannot import llama_cpp.server" % explicit)
        return str(explicit)

    candidates = [
        sys.executable,
        venv_python(ROOT / ".tools" / "venv"),
        venv_python(ROOT / ".tools" / "ai-venv"),
    ]
    for python in candidates:
        if has_server(python):
            return str(python)

    prefix = ROOT / ".tools" / "ai-venv"
    say("creating isolated environment at .tools/ai-venv")
    prefix.parent.mkdir(parents=True, exist_ok=True)
    made = run([sys.executable, "-m", "venv", str(prefix)], check=False)
    python = venv_python(prefix)
    if made.returncode != 0 or not python.is_file():
        raise SystemExit(
            "ai: could not create a venv. Install Python pip/venv, or run:\n"
            "    %s -m pip install -r tools/requirements-ai.txt"
            % sys.executable
        )

    say("installing llama-cpp-python[server]")
    run([str(python), "-m", "pip", "install", "--upgrade", "pip"], check=False)
    command = [str(python), "-m", "pip", "install", "-r", str(TOOLS / "requirements-ai.txt")]
    first = run(command + ["--extra-index-url", CPU_INDEX], check=False)
    if first.returncode != 0:
        say("prebuilt wheel index did not fit; trying the normal package index")
        run(command)

    if not has_server(python):
        raise SystemExit(
            "ai: llama-cpp-python installed but will not import.\n"
            "    On Linux/macOS install a C++ toolchain and cmake, then rerun.\n"
            "    On Windows install Visual Studio Build Tools, then rerun."
        )
    return str(python)


def available_mb():
    """Best-effort free physical memory, in MB."""
    try:
        with open("/proc/meminfo", "r", encoding="ascii") as handle:
            for line in handle:
                if line.startswith("MemAvailable:"):
                    return int(line.split()[1]) // 1024
    except OSError:
        pass
    try:
        page = os.sysconf("SC_PAGE_SIZE")
        available = os.sysconf("SC_AVPHYS_PAGES")
        if page > 0 and available > 0:
            return int(page * available) // (1024 * 1024)
    except (ValueError, OSError, AttributeError):
        pass
    return None


def download(url, destination):
    if destination.is_file() and destination.stat().st_size > 1024 * 1024:
        say("model already present: %s" % destination.relative_to(ROOT))
        return destination
    destination.parent.mkdir(parents=True, exist_ok=True)
    partial = destination.with_suffix(destination.suffix + ".part")
    say("downloading %s" % url)
    request = urllib.request.Request(url, headers={"User-Agent": "hablo-installer"})
    with urllib.request.urlopen(request, timeout=60) as response:
        total = int(response.headers.get("Content-Length") or 0)
        done = 0
        with open(partial, "wb") as handle:
            while True:
                chunk = response.read(1024 * 1024)
                if not chunk:
                    break
                handle.write(chunk)
                done += len(chunk)
                if total:
                    pct = done * 100 // total
                    if pct % 10 == 0:
                        print("  %3d%%  %.1f / %.1f MB" % (
                            pct, done / 1048576, total / 1048576), flush=True)
    partial.replace(destination)
    say("model saved: %s" % destination.relative_to(ROOT))
    return destination


def main():
    parser = argparse.ArgumentParser(description="Install hablo's optional local model.")
    parser.add_argument("--start", action="store_true", help="start the OpenAI-compatible server after setup")
    parser.add_argument("--port", type=int, default=8080, help="server port (default 8080)")
    parser.add_argument("--model", type=pathlib.Path, help="already-downloaded GGUF")
    parser.add_argument("--model-url", default=DEFAULT_URL, help="GGUF to download")
    parser.add_argument("--python", help="Python that already has llama-cpp-python installed")
    parser.add_argument("--no-model", action="store_true", help="install the library but do not download a model")
    args = parser.parse_args()

    if sys.version_info < (3, 9):
        raise SystemExit("ai: Python 3.9 or newer is required")

    python = choose_python(args.python)
    model = pathlib.Path(args.model) if args.model else DEFAULT_MODEL
    if not model.is_absolute():
        model = (ROOT / model).resolve()
    if not args.no_model and not model.is_file():
        model = download(args.model_url, model)
    if not model.is_file():
        raise SystemExit("ai: no model at %s; pass --model or drop --no-model" % model)

    try:
        label = model.relative_to(ROOT)
    except ValueError:
        label = model
    say("ready: %s" % label)
    say("start the app; the conversation view finds the model on port %d automatically" % args.port)
    if not args.start:
        say("start with: %s -m llama_cpp.server --model %s --port %d" % (
            short(python), short(model), args.port))
        return 0

    free = available_mb()
    if free is not None and free < 1200:
        say("not starting: only %d MB free. Close something or use a machine with more RAM." % free)
        return 1
    ctx = 1024 if free is not None and free < 2500 else 2048
    threads = max(1, min(4, (os.cpu_count() or 2) // 2))
    if free is not None:
        say("RAM guard: %d MB free, context %d, threads %d" % (free, ctx, threads))
    command = [
        python, "-m", "llama_cpp.server",
        "--model", str(model),
        "--model_alias", ALIAS,
        "--n_ctx", str(ctx),
        "--n_threads", str(threads),
        "--host", "127.0.0.1",
        "--port", str(args.port),
    ]
    say("starting the local model; press Ctrl-C to stop")
    return subprocess.call(command)


if __name__ == "__main__":
    raise SystemExit(main())
