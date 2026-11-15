#!/usr/bin/env python3
"""hablo — one-command app + local AI.

    python3 server.py

First run creates an isolated Python environment, installs
llama-cpp-python[server], downloads the small GGUF model, then starts the app
and model together. Later runs only start the app and the existing model.

Useful escapes:
    python3 server.py --offline    # app only, no model/setup
    python3 server.py --no-open    # do not open a browser
    python3 server.py --port 9000  # pin the app port

Everything is optional for the app itself: if setup cannot finish, the app
still starts and conversation falls back to the authored/scripted practice.
"""
import argparse
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent
INSTALLER = ROOT / "tools" / "install_ai.py"
SERVER = ROOT / "serve.py"


def setup_ai():
    if not INSTALLER.is_file():
        print("  local AI: installer missing; starting without it")
        return False
    print("  local AI: checking Python environment and model (first run may install/download)")
    result = subprocess.call([sys.executable, str(INSTALLER)])
    if result != 0:
        print("  local AI: setup did not finish; starting the app without it")
        return False
    return True


def main():
    parser = argparse.ArgumentParser(description="Start hablo with automatic local AI setup.")
    parser.add_argument("--offline", action="store_true", help="skip local AI setup and start the app only")
    parser.add_argument("--port", type=int, help="app port")
    parser.add_argument("--host", help="app interface")
    parser.add_argument("--no-open", action="store_true", help="do not open a browser")
    parser.add_argument("--ai-port", type=int, default=8081, help="local model port (default 8081)")
    args = parser.parse_args()

    ai_ready = False
    if not args.offline:
        ai_ready = setup_ai()

    command = [sys.executable, str(SERVER)]
    if args.port:
        command += ["--port", str(args.port)]
    if args.host:
        command += ["--host", args.host]
    if args.no_open:
        command += ["--no-open"]
    if ai_ready:
        command += ["--ai", "--ai-port", str(args.ai_port)]
    return subprocess.call(command)


if __name__ == "__main__":
    raise SystemExit(main())
