Write a single Python file defining a function `flatten_config(config: dict) -> dict`.

Behavior:
- Nested dicts flatten with dot-joined keys: `{"a": {"b": 1}}` -> `{"a.b": 1}`.
- Lists/tuples flatten with numeric indices as key segments: `{"a": [10, 20]}` -> `{"a.0": 10, "a.1": 20}`; nesting composes: `{"a": [{"b": 1}]}` -> `{"a.0.b": 1}`.
- Scalars (str/int/float/bool/None) are leaf values kept as-is.
- Empty dicts and empty lists produce NO keys.
- All keys in the result are strings; non-string dict keys are converted with `str()`.
- Cycle detection: if the SAME dict or list object appears again anywhere on the path from the root to itself (i.e., a true reference cycle), raise `ValueError`. The same object appearing in two sibling positions is NOT a cycle and must be allowed.

Rules: standard library only. Output ONLY one ```python code block.
