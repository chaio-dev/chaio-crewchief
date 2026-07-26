from solution import SlidingWindowLimiter

rl = SlidingWindowLimiter(3, 10.0)
assert all(rl.allow("a", t) for t in (0.0, 1.0, 2.0))
assert rl.allow("a", 3.0) is False           # full window
assert rl.remaining("a", 3.0) == 0
assert rl.allow("b", 3.0) is True            # keys independent
assert rl.allow("a", 10.0) is True           # t=0.0 is exactly window_seconds old -> out of window
assert rl.allow("a", 10.5) is False          # 1.0, 2.0, 10.0 in window
assert rl.remaining("a", 11.5) == 1          # 1.0 fell out; remaining doesn't record
assert rl.remaining("a", 11.5) == 1
assert rl.allow("a", 11.5) is True
assert rl.allow("a", 11.5) is False

# denied calls never recorded: hammer while full, then window clears fully
rl2 = SlidingWindowLimiter(1, 5.0)
assert rl2.allow("k", 0.0) is True
for t in (1.0, 2.0, 3.0, 4.0):
    assert rl2.allow("k", t) is False
assert rl2.allow("k", 5.1) is True           # only the 0.0 call was ever recorded
print("ok")
