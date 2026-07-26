from collections import defaultdict, deque

class SlidingWindowLimiter:
    def __init__(self, max_calls, window_seconds):
        self.max_calls = max_calls
        self.window = window_seconds
        self._calls = defaultdict(deque)

    def _prune(self, key, now):
        q = self._calls[key]
        while q and q[0] <= now - self.window:
            q.popleft()
        return q

    def allow(self, key, now):
        q = self._prune(key, now)
        if len(q) >= self.max_calls:
            return False
        q.append(now)
        return True

    def remaining(self, key, now):
        q = self._calls[key]
        live = sum(1 for t in q if t > now - self.window)
        return max(0, self.max_calls - live)
