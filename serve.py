#!/usr/bin/env python3
"""sema — local preview server.

One command, standard library only, nothing to install:

    python3 serve.py

It serves this folder on the first free port from 8080 up, prints the URL, and
opens your browser. Pass --port to pin one, --no-open to stay quiet.

Speech recognition needs a secure context, so use the http://localhost URL this
prints rather than opening index.html from the filesystem.
"""

import argparse
import atexit
import functools
import http.server
import os
import pathlib
import socket
import subprocess
import sys
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
ROOT_PATH = pathlib.Path(ROOT)


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
    preferred = models / "qwen2.5-0.5b-instruct-q4_k_m.gguf"
    if preferred.is_file():
        return preferred
    found = sorted(models.glob("*.gguf")) if models.is_dir() else []
    return found[0] if found else None


def start_ai(port=8080):
    """Start the optional local model in the background. Returns the process."""
    python = _ai_python()
    model = _ai_model()
    if not python or not model:
        print("  local model: not installed (run: python3 tools/install_ai.py)")
        return None
    log = ROOT_PATH / ".tools" / "local-model.log"
    log.parent.mkdir(parents=True, exist_ok=True)
    command = [
        python, "-m", "llama_cpp.server",
        "--model", str(model),
        "--model_alias", "qwen2.5-0.5b-instruct",
        "--n_ctx", "2048",
        "--n_threads", str(max(1, (os.cpu_count() or 2) // 2)),
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
    print("  local model: %s on http://127.0.0.1:%d" % (model.name, port))
    print("  local model log: %s" % log.relative_to(ROOT_PATH))
    return process


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serves the folder, and refuses to let the browser cache anything.

    Without the no-store headers, editing the CSS and reloading shows the old
    file about half the time, which is the single most annoying thing about
    previewing a static site.
    """

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
    parser = argparse.ArgumentParser(description="Serve the sema demo locally.")
    parser.add_argument("-p", "--port", type=int, default=8080, help="first port to try (default 8080)")
    parser.add_argument("--no-open", action="store_true", help="don't open a browser")
    parser.add_argument("--host", default="127.0.0.1", help="interface to bind (default 127.0.0.1)")
    parser.add_argument("--ai", action="store_true", help="also start the optional local model")
    parser.add_argument("--ai-port", type=int, default=8081, help="local model port (default 8081)")
    args = parser.parse_args()
    if args.ai:
        start_ai(args.ai_port)

    port = args.port
    handler = functools.partial(Handler, directory=ROOT)
    try:
        server = http.server.ThreadingHTTPServer((args.host, port), handler)
    except OSError:
        port = free_port(args.port)
        server = http.server.ThreadingHTTPServer((args.host, port), handler)

    url = "http://localhost:%d/" % port
    print("", flush=True)
    print("  sema — meaning-first language learning")
    print("  serving %s" % ROOT, flush=True)
    print("")
    print("  →  %s" % url, flush=True)
    print("  →  %s#map  ·  %s#stats  ·  %s#practice" % (url, url, url))
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
