"""Choose the best local conversation model that the machine can actually run.

The numbers include rough runtime headroom, not only the GGUF file size. The
same policy is used by the installer (what to download) and by serve.py (what
to launch), so a machine never downloads a tier it cannot run.
"""
MODELS = (
    {
        "id": "qwen3-4b",
        "file": "Qwen3-4B-Q4_K_M.gguf",
        "alias": "qwen3-4b-instruct",
        "min_free_mb": 7000,
        "ctx": 2048,
        "url": "https://huggingface.co/Qwen/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf",
    },
    {
        "id": "qwen2.5-3b",
        "file": "qwen2.5-3b-instruct-q4_k_m.gguf",
        "alias": "qwen2.5-3b-instruct",
        "min_free_mb": 5200,
        "ctx": 2048,
        "url": "https://huggingface.co/Qwen/Qwen2.5-3B-Instruct-GGUF/resolve/main/qwen2.5-3b-instruct-q4_k_m.gguf",
    },
    {
        "id": "qwen2.5-1.5b",
        "file": "qwen2.5-1.5b-instruct-q4_k_m.gguf",
        "alias": "qwen2.5-1.5b-instruct",
        "min_free_mb": 2800,
        "ctx": 2048,
        "url": "https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf",
    },
    {
        "id": "qwen2.5-0.5b",
        "file": "qwen2.5-0.5b-instruct-q4_k_m.gguf",
        "alias": "qwen2.5-0.5b-instruct",
        "min_free_mb": 1200,
        "ctx": 1024,
        "url": "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf",
    },
)


def by_id(model_id):
    for model in MODELS:
        if model["id"] == model_id:
            return model
    return None


def download_spec(free_mb):
    """The largest tier whose runtime guard fits in free RAM."""
    for model in MODELS:
        if free_mb is not None and free_mb >= model["min_free_mb"]:
            return model
    return MODELS[-1]


def choose(free_mb, model_dir, preferred=None):
    """Return (spec, path) for the best already-downloaded runnable model."""
    if preferred:
        import pathlib
        path = pathlib.Path(preferred)
        if path.is_file():
            for model in MODELS:
                if path.name == model["file"]:
                    return model, path
            return {
                "id": "custom", "file": path.name, "alias": path.stem,
                "min_free_mb": 0, "ctx": 2048, "url": "",
            }, path
    if free_mb is None:
        small = next((m for m in MODELS if m["id"] == "qwen2.5-0.5b"), None)
        if small and (model_dir / small["file"]).is_file():
            return small, model_dir / small["file"]
        free_mb = 0
    for model in MODELS:
        path = model_dir / model["file"]
        if path.is_file() and free_mb >= model["min_free_mb"]:
            return model, path
    # Last chance: a smaller file may still be the only runnable one.
    for model in reversed(MODELS):
        path = model_dir / model["file"]
        if path.is_file() and free_mb >= 1200:
            return model, path
    return None, None
