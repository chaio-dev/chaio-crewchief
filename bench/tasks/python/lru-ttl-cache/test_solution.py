from solution import LRUTTLCache

t = [0.0]
clock = lambda: t[0]

c = LRUTTLCache(2, 10.0, clock)
c.put("a", 1); c.put("b", 2)
assert c.get("a") == 1
c.put("c", 3)  # evicts b (a was refreshed by get)
assert c.get("b") is None
assert c.get("a") == 1 and c.get("c") == 3

# TTL expiry
t[0] = 5.0; c.put("d", 4)   # a,c inserted at 0; d at 5; capacity 2 -> evict LRU (a)
t[0] = 10.5                  # c (age 10.5) expired; d (age 5.5) live
assert c.get("c") is None
assert c.get("d") == 4
assert len(c) == 1

# update refreshes expiry
c2 = LRUTTLCache(1, 10.0, clock)
t[0] = 0.0; c2.put("x", 1)
t[0] = 9.0; c2.put("x", 99)
t[0] = 15.0
assert c2.get("x") == 99

# default clock works
c3 = LRUTTLCache(1, 60.0)
c3.put("k", "v")
assert c3.get("k") == "v"
print("ok")
