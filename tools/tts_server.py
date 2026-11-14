#!/usr/bin/env python3
"""A tiny HTTP wrapper around llama-tts, because llama-tts is one-shot.

    python3 tools/tts_server.py --binary ./build/bin/llama-tts \
        --model kokoro-v1.0.fp16.gguf --voice ef_dora --port 8083

    curl -X POST localhost:8083/v1/audio/speech \
         -H 'Content-Type: application/json' \
         -d '{"input":"Hola, que tal?","voice":"ef_dora"}' -o out.wav

One request = one llama-tts run. That is slow (~1-3 s) but it never leaks memory
and it cannot get stuck holding a model.
"""
import argparse, json, os, subprocess, tempfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ARGS = None


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.rstrip("/") in ("/health", "/v1/models"):
            self._json(200, {"status": "ok", "model": os.path.basename(ARGS.model)})
        else:
            self._json(404, {"error": "not found"})

    def do_POST(self):
        if self.path.rstrip("/") != "/v1/audio/speech":
            return self._json(404, {"error": "not found"})
        n = int(self.headers.get("Content-Length") or 0)
        try:
            req = json.loads(self.rfile.read(n) or b"{}")
        except ValueError:
            return self._json(400, {"error": "bad json"})
        text = (req.get("input") or req.get("text") or "").strip()
        if not text:
            return self._json(400, {"error": "input is required"})
        voice = req.get("voice") or ARGS.voice

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            out = tmp.name
        cmd = [ARGS.binary, "-m", ARGS.model, "-p", text, "-o", out]
        if ARGS.vocoder:
            cmd += ["-mv", ARGS.vocoder]
        if voice:
            cmd += ["--voice", voice]
        try:
            run = subprocess.run(cmd, capture_output=True, timeout=120)
            if run.returncode != 0 or not os.path.getsize(out):
                err = (run.stderr or b"")[-300:].decode("utf-8", "replace")
                return self._json(500, {"error": "llama-tts failed", "detail": err})
            data = open(out, "rb").read()
        finally:
            try:
                os.unlink(out)
            except OSError:
                pass

        self.send_response(200)
        self.send_header("Content-Type", "audio/wav")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--binary", default="llama-tts")
    ap.add_argument("--model", required=True)
    ap.add_argument("--vocoder", default=None, help="OuteTTS needs one; Kokoro does not")
    ap.add_argument("--voice", default=None)
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8083)
    ARGS = ap.parse_args()
    print("llama-tts wrapper on http://%s:%d/v1/audio/speech" % (ARGS.host, ARGS.port))
    ThreadingHTTPServer((ARGS.host, ARGS.port), Handler).serve_forever()
