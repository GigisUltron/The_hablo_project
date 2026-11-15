#!/bin/sh
# Start the optional local conversation model.
#
# The model and the built llama.cpp server live under .tools/ (ignored by git).
# This script is a convenience, not a runtime dependency: if it is not running,
# the app keeps using Offline practice and every local-AI assist falls back to
# the authored pack.
set -e

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
BIN="$ROOT/.tools/llama.cpp/build/bin/llama-server"
MODEL=${1:-"$ROOT/.tools/models/qwen2.5-1.5b-instruct-q4_k_m.gguf"}
PORT=${PORT:-8080}

if [ ! -x "$BIN" ]; then
  echo "local model: missing $BIN" >&2
  echo "build llama.cpp first (see tools/README.md)" >&2
  exit 1
fi
if [ ! -f "$MODEL" ]; then
  echo "local model: missing $MODEL" >&2
  echo "download a small GGUF first (see tools/README.md)" >&2
  exit 1
fi

exec "$BIN" -m "$MODEL" --host 127.0.0.1 --port "$PORT" \
  -c 2048 -t 4 --alias qwen2.5-1.5b-instruct
