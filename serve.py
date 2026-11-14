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
import functools
import http.server
import os
import socket
import sys
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))


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
    args = parser.parse_args()

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
