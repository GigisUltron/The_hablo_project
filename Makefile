# Convenience wrapper. Both targets use only tools you already have.
.PHONY: serve test check

serve:
	python3 serve.py

test:
	node --test tests/*.test.js

# syntax gate for the two languages involved, plus the full suite
check:
	@for f in src/*.js tests/*.js; do node --check "$$f" || exit 1; done
	python3 -m py_compile serve.py
	@echo "syntax ok"
	@$(MAKE) test
