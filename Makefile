# Convenience wrapper. Targets use only tools you already have.
.PHONY: serve test check audio-check setup-ai ai server integration

# Every pack, in picker order. A bare make_audio.py --check covers Spanish only.
AUDIO_PACKS = es fr en it de nl pt ru tr ar hi ja zh

serve:
	python3 serve.py

server:
	python3 server.py

# Optional local AI: installs llama-cpp-python in an isolated venv and starts a
# small GGUF model on http://127.0.0.1:8080. Nothing here is needed for the app.
setup-ai:
	python3 tools/install_ai.py

ai:
	python3 server.py

integration:
	@if [ -x .tools/venv/bin/python ]; then \
		.tools/venv/bin/python tools/integration_check.py --model .tools/models/qwen2.5-1.5b-instruct-q4_k_m.gguf; \
	else \
		python3 tools/integration_check.py; \
	fi

test:
	node --test tests/*.test.js

# syntax gate for the two languages involved, plus the full suite
check:
	@for f in src/*.js tests/*.js sw.js; do node --check "$$f" || exit 1; done
	python3 -m py_compile serve.py server.py tools/install_ai.py
	@echo "syntax ok"
	@$(MAKE) test

# Manifest coverage and the WAV contract for every pack, not only Spanish.
audio-check:
	@status=0; \
	for code in $(AUDIO_PACKS); do \
		if out=$$(python3 tools/make_audio.py --lang "$$code" --check 2>&1); then \
			clips=$$(printf '%s\n' "$$out" | sed -n 's/^  clips: \([0-9][0-9]*\).*/\1/p'); \
			printf 'audio-check %s: ok (%s clips)\n' "$$code" "$${clips:-?}"; \
		else \
			printf 'audio-check %s: FAILED\n' "$$code"; \
			printf '%s\n' "$$out"; \
			status=1; \
		fi; \
	done; \
	if [ $$status -eq 0 ]; then \
		printf 'audio-check: all %s packs ok\n' "$(words $(AUDIO_PACKS))"; \
	else \
		printf 'audio-check: one or more packs failed\n'; \
	fi; \
	exit $$status
