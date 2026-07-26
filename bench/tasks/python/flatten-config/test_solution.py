from solution import flatten_config

assert flatten_config({"a": {"b": 1, "c": {"d": "x"}}}) == {"a.b": 1, "a.c.d": "x"}
assert flatten_config({"a": [10, 20], "b": []}) == {"a.0": 10, "a.1": 20}
assert flatten_config({"a": [{"b": 1}, {"b": 2}]}) == {"a.0.b": 1, "a.1.b": 2}
assert flatten_config({"x": None, "y": True, 5: "five"}) == {"x": None, "y": True, "5": "five"}
assert flatten_config({}) == {}
assert flatten_config({"e": {}}) == {}

# shared sibling reference is OK
shared = {"v": 1}
assert flatten_config({"a": shared, "b": shared}) == {"a.v": 1, "b.v": 1}

# true cycle raises
c = {"a": 1}
c["self"] = c
try:
    flatten_config(c)
    assert False, "expected ValueError"
except ValueError:
    pass

lst = [1]
lst.append(lst)
try:
    flatten_config({"l": lst})
    assert False, "expected ValueError"
except ValueError:
    pass
print("ok")
