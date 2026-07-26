def flatten_config(config):
    out = {}

    def walk(node, prefix, path_ids):
        if isinstance(node, dict):
            if id(node) in path_ids:
                raise ValueError("cycle detected")
            path_ids.add(id(node))
            for k, v in node.items():
                key = str(k) if prefix == "" else f"{prefix}.{k}"
                walk(v, key, path_ids)
            path_ids.discard(id(node))
        elif isinstance(node, (list, tuple)):
            if id(node) in path_ids:
                raise ValueError("cycle detected")
            path_ids.add(id(node))
            for i, v in enumerate(node):
                key = str(i) if prefix == "" else f"{prefix}.{i}"
                walk(v, key, path_ids)
            path_ids.discard(id(node))
        else:
            out[prefix] = node

    walk(config, "", set())
    return out
