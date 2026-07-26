Write a single Python file defining a class `SlidingWindowLimiter`.

Contract:
- `SlidingWindowLimiter(max_calls: int, window_seconds: float)`
- `allow(key: str, now: float) -> bool` — returns True and records the call if `key` has had fewer than `max_calls` allowed calls in the half-open interval `(now - window_seconds, now]`; otherwise returns False and records nothing. Calls exactly `window_seconds` old fall OUT of the window.
- `remaining(key: str, now: float) -> int` — how many more calls `key` could make at time `now` without recording anything.
- Denied calls are never recorded. Different keys are fully independent. `now` values for a given key are non-decreasing across calls; internal storage for a key must not grow beyond what the window requires (drop timestamps older than the window on each `allow`).

Rules: standard library only. Output ONLY one ```python code block.
