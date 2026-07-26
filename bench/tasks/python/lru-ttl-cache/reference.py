import time
from collections import OrderedDict

class LRUTTLCache:
    def __init__(self, capacity, ttl_seconds, clock=None):
        self.capacity = capacity
        self.ttl = ttl_seconds
        self.clock = clock or time.monotonic
        self._d = OrderedDict()  # key -> (value, inserted_at)

    def _expired(self, ts):
        return self.clock() - ts > self.ttl

    def _purge_expired(self):
        for k in [k for k, (_, ts) in self._d.items() if self._expired(ts)]:
            del self._d[k]

    def put(self, key, value):
        if key in self._d:
            del self._d[key]
        elif len(self._d) >= self.capacity:
            self._purge_expired()
            if len(self._d) >= self.capacity:
                self._d.popitem(last=False)
        self._d[key] = (value, self.clock())

    def get(self, key):
        if key not in self._d:
            return None
        value, ts = self._d[key]
        if self._expired(ts):
            del self._d[key]
            return None
        self._d.move_to_end(key)
        return value

    def __len__(self):
        return sum(1 for _, ts in self._d.values() if not self._expired(ts))
