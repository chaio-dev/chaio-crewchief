Write a single Python file defining a class `LRUTTLCache`.

Contract:
- `LRUTTLCache(capacity: int, ttl_seconds: float, clock=None)` — `clock` is an optional zero-arg callable returning the current time in seconds (like `time.monotonic`). When `clock` is None, use `time.monotonic`.
- `put(key, value)` — insert/update. Updating an existing key refreshes both its recency and its expiry. When inserting a NEW key into a full cache, evict the least-recently-used entry first (expired entries should be evicted preferentially over live ones).
- `get(key)` — return the value and refresh recency, or return `None` if the key is absent OR its entry is older than `ttl_seconds` (an expired entry must also be removed from the cache when discovered by `get`).
- `__len__` — number of live (non-expired) entries; must not count entries that have expired even if they haven't been removed yet.

Rules: standard library only. Output ONLY one ```python code block.
