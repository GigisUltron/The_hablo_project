# Convenience wrapper. Both targets use only tools you already have.
.PHONY: serve test check setup-ai ai server integration

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
	@for f in src/*.js tests/*.js; do node --check "$$f" || exit 1; done
	python3 -m py_compile serve.py server.py tools/install_ai.py
	@echo "syntax ok"
	@$(MAKE) test
