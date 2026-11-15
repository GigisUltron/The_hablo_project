#!/usr/bin/env python3
"""hablo — local app and local model.

One command starts both:

    python3 serve.py

The app itself is standard library only. The first run also installs the
optional local model into an isolated .tools directory, downloads the best
Qwen tier this machine can run, and starts it beside the app on 127.0.0.1.
Later runs reuse it. If setup cannot finish, the app still starts and the
authored conversation practice takes over.

    python3 serve.py --offline    # app only: no install, no model
    python3 serve.py --port 9000  # pin the app port
    python3 serve.py --no-open    # do not open a browser

Speech recognition needs a secure context, so use the http://localhost URL this
prints rather than opening index.html from the filesystem.
"""

import argparse
import atexit
import functools
import http.server
import os
import pathlib
import signal
import socket
import subprocess
import sys
import threading
import time
import urllib.request
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
ROOT_PATH = pathlib.Path(ROOT)
sys.path.insert(0, str(ROOT_PATH / "tools"))
import model_policy as policy  # noqa: E402


def _ai_python():
    """The interpreter that can import llama_cpp.server, if any."""
    candidates = [sys.executable]
    for venv in (".tools/ai-venv", ".tools/venv"):
        for rel in ("bin/python", "Scripts/python.exe"):
            candidates.append(str(ROOT_PATH / venv / rel))
    for python in candidates:
        if not os.path.isfile(python):
            continue
        try:
            check = subprocess.run(
                [python, "-c", "import llama_cpp.server"],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=10
            )
        except (OSError, subprocess.TimeoutExpired):
            continue
        if check.returncode == 0:
            return python
    return None


def _ai_model():
    models = ROOT_PATH / ".tools" / "models"
    return policy.choose(available_mb(), models)


def model_answers(port):
    """Whether an OpenAI-compatible model already answers on 127.0.0.1:port."""
    try:
        request = urllib.request.Request(
            "http://127.0.0.1:%d/v1/models" % port,
            headers={"Accept": "application/json"},
        )
        with urllib.request.urlopen(request, timeout=1.0) as reply:
            return getattr(reply, "status", 200) == 200
    except (OSError, ValueError):
        return False


def running_model_port():
    for port in (8080, 8081, 11434):
        if model_answers(port):
            return port
    return None


def available_mb():
    """Best-effort free physical memory, in MB. None means "do not guard"."""
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
    if sys.platform == "win32":
        try:
            import ctypes

            class MemoryStatus(ctypes.Structure):
                _fields_ = [
                    ("length", ctypes.c_ulong), ("memory_load", ctypes.c_ulong),
                    ("total_phys", ctypes.c_ulonglong), ("avail_phys", ctypes.c_ulonglong),
                    ("total_page_file", ctypes.c_ulonglong), ("avail_page_file", ctypes.c_ulonglong),
                    ("total_virtual", ctypes.c_ulonglong), ("avail_virtual", ctypes.c_ulonglong),
                    ("avail_extended_virtual", ctypes.c_ulonglong),
                ]

            status = MemoryStatus()
            status.length = ctypes.sizeof(MemoryStatus)
            if ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(status)):
                return int(status.avail_phys // (1024 * 1024))
        except (OSError, AttributeError):
            pass
    return None


def ai_limits(spec=None):
    free = available_mb()
    if free is not None and free < 1200:
        print("  local model: skipped — only %d MB free; using scripted practice" % free)
        return None
    ctx = (spec or {}).get("ctx", 2048)
    if free is not None and free < 2500:
        ctx = 1024
    threads = max(1, min(4, (os.cpu_count() or 2) // 2))
    if free is not None:
        print("  local model: RAM guard %d MB free, context %d, threads %d" % (free, ctx, threads))
    return {"ctx": ctx, "threads": threads}


def _watch_memory(process, floor_mb=350, interval=10):
    """Stop the model rather than let the OS kill the tab or the machine."""
    while process.poll() is None:
        free = available_mb()
        if free is not None and free < floor_mb:
            print("  local model: stopped — only %d MB free; scripted practice takes over" % free)
            try:
                process.terminate()
            except OSError:
                pass
            return
        time.sleep(interval)


def wait_for_model(port, timeout=20.0, process=None):
    """Wait until the model answers, so the browser does not open on a race."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        if model_answers(port):
            return True
        if process is not None and process.poll() is not None:
            return False
        time.sleep(0.4)
    return False


def start_ai(port=8080):
    """Start the optional local model in the background. Returns the process."""
    python = _ai_python()
    spec, model = _ai_model()
    if not python or not model:
        print("  local model: not installed (run: python3 tools/install_ai.py)")
        return None
    limits = ai_limits(spec)
    if not limits:
        return None
    log = ROOT_PATH / ".tools" / "local-model.log"
    log.parent.mkdir(parents=True, exist_ok=True)
    command = [
        python, "-m", "llama_cpp.server",
        "--model", str(model),
        "--model_alias", spec["alias"],
        "--n_ctx", str(limits["ctx"]),
        "--n_threads", str(limits["threads"]),
        "--host", "127.0.0.1",
        "--port", str(port),
    ]
    handle = open(log, "w")
    try:
        process = subprocess.Popen(command, stdout=handle, stderr=subprocess.STDOUT)
    except OSError as exc:
        handle.close()
        print("  local model: could not start (%s)" % exc)
        return None
    atexit.register(lambda: (process.poll() is None and process.terminate(), handle.close()))
    threading.Thread(target=_watch_memory, args=(process,), daemon=True).start()
    print("  local model: %s (%s) on http://127.0.0.1:%d" % (model.name, spec["id"], port), flush=True)
    if wait_for_model(port, process=process):
        print("  local model: ready", flush=True)
    else:
        print("  local model: still loading; the app will use it when it answers", flush=True)
    print("  local model log: %s" % log.relative_to(ROOT_PATH), flush=True)
    return process


def ensure_ai(port=8081):
    """Start the local model, installing it on the first run.

    serve.py is the one command a learner runs. The model is optional for the
    app but it is the intended conversation engine, so the first run sets it up
    through the same installer and isolated venv the project already uses. If
    setup cannot finish, the app still starts with the authored practice.
    """
    running = running_model_port()
    if running:
        print("  local model: already answering on http://127.0.0.1:%d" % running, flush=True)
        return None

    if not _ai_python() or not _ai_model()[1]:
        installer = ROOT_PATH / "tools" / "install_ai.py"
        if not installer.is_file():
            print("  local model: installer missing; using authored practice", flush=True)
            return None
        print("  local model: first run — installing the small model; this can take a few minutes", flush=True)
        try:
            code = subprocess.call([sys.executable, str(installer)])
        except OSError as exc:
            print("  local model: setup failed (%s); using authored practice" % exc, flush=True)
            return None
        if code != 0:
            print("  local model: setup did not finish; using authored practice", flush=True)
            return None

    return start_ai(port)


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serves the folder, and refuses to let the browser cache anything.

    Without the no-store headers, editing the CSS and reloading shows the old
    file about half the time, which is the single most annoying thing about
    previewing a static site.
    """

    extensions_map = dict(http.server.SimpleHTTPRequestHandler.extensions_map, **{
        ".webmanifest": "application/manifest+json",
        ".svg": "image/svg+xml",
    })

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))


def free_port(start, tries=40):
    for port in range(start, start + tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind(("127.0.0.1", port))
            except OSError:
                continue
            return port
    raise SystemExit("serve.py: no free port between %d and %d" % (start, start + tries))


def main():
    parser = argparse.ArgumentParser(description="Serve hablo locally, with the local model when possible.")
    parser.add_argument("-p", "--port", type=int, default=8080, help="first app port to try (default 8080)")
    parser.add_argument("--no-open", action="store_true", help="don't open a browser")
    parser.add_argument("--host", default="127.0.0.1", help="interface to bind (default 127.0.0.1)")
    parser.add_argument("--offline", action="store_true", help="app only: do not install or start the local model")
    parser.add_argument("--ai", action="store_true", help=argparse.SUPPRESS)
    parser.add_argument("--ai-port", type=int, default=8081, help="local model port (default 8081)")
    args = parser.parse_args()

    def stop_on_signal(signum, frame):
        raise SystemExit(0)

    try:
        signal.signal(signal.SIGTERM, stop_on_signal)
    except (ValueError, OSError):
        pass

    if args.offline:
        print("  local model: off (--offline); authored practice only", flush=True)
    else:
        ensure_ai(args.ai_port)

    port = args.port
    handler = functools.partial(Handler, directory=ROOT)
    try:
        server = http.server.ThreadingHTTPServer((args.host, port), handler)
    except OSError:
        port = free_port(args.port)
        server = http.server.ThreadingHTTPServer((args.host, port), handler)

    url = "http://localhost:%d/" % port
    print("", flush=True)
    print("  hablo — meaning-first language learning")
    print("  serving local app", flush=True)
    print("")
    print("  →  %s" % url, flush=True)
    print("  →  %s#practice  ·  %s#stats  ·  %s#conv" % (url, url, url))
    print("")
    print("  microphone needs localhost, not file://")
    print("  ctrl-c to stop")
    print("")

    if not args.no_open:
        try:
            webbrowser.open(url)
        except Exception:
            pass

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  stopped")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
