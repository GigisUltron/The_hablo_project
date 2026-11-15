# Convenience wrapper. Both targets use only tools you already have.
.PHONY: serve test check setup-ai ai

serve:
	python3 serve.py

# Optional local AI: installs llama-cpp-python in an isolated venv and starts a
# small GGUF model on http://127.0.0.1:8080. Nothing here is needed for the app.
setup-ai:
	python3 tools/install_ai.py

ai:
	python3 tools/install_ai.py
	python3 serve.py --ai

test:
	node --test tests/*.test.js

# syntax gate for the two languages involved, plus the full suite
check:
	@for f in src/*.js tests/*.js; do node --check "$$f" || exit 1; done
	python3 -m py_compile serve.py tools/install_ai.py
	@echo "syntax ok"
	@$(MAKE) test
