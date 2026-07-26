#!/usr/bin/env python3
"""Aggregate results/results.jsonl into REPORT.md."""
import json, os
from collections import defaultdict

ROOT = os.path.dirname(os.path.abspath(__file__))
RESULTS = os.path.join(ROOT, "results", "results.jsonl")


def main():
    rows = [json.loads(l) for l in open(RESULTS) if l.strip()]
    # group attempts by (model, track, task, run)
    cells = defaultdict(list)
    for r in rows:
        cells[(r["model"], r["track"], r["task"], r["run"])].append(r)

    # per (model, track): outcomes + resources
    agg = defaultdict(lambda: {"n": 0, "p1": 0, "prep": 0, "wall": 0.0, "cost": 0.0, "out_tok": 0})
    for (model, track, task, run), attempts in cells.items():
        a = agg[(model, track)]
        a["n"] += 1
        initial = next((x for x in attempts if x["phase"] == "initial"), None)
        repair = next((x for x in attempts if x["phase"] == "repair"), None)
        if initial and initial["verdict"] == "pass":
            a["p1"] += 1
            a["prep"] += 1
        elif repair and repair["verdict"] == "pass":
            a["prep"] += 1
        for x in attempts:
            a["wall"] += x.get("wall_s", 0)
            a["cost"] += x.get("cost_usd", 0)
            a["out_tok"] += x.get("output_tokens", 0)

    models = sorted({m for m, _ in agg})
    tracks = sorted({t for _, t in agg})

    lines = ["# Hybrid Fleet Benchmark — Results", ""]
    for track in tracks:
        lines += [f"## {track}", "", "| model | pass@1 | pass w/ repair | total wall (s) | total cost | out tokens |", "|---|---|---|---|---|---|"]
        for m in models:
            a = agg.get((m, track))
            if not a:
                continue
            lines.append(f"| {m} | {a['p1']}/{a['n']} | {a['prep']}/{a['n']} | {a['wall']:.0f} | ${a['cost']:.4f} | {a['out_tok']} |")
        lines.append("")

    # overall
    total = defaultdict(lambda: {"n": 0, "p1": 0, "prep": 0, "wall": 0.0, "cost": 0.0})
    for (m, t), a in agg.items():
        o = total[m]
        for k in ("n", "p1", "prep"):
            o[k] += a[k]
        o["wall"] += a["wall"]
        o["cost"] += a["cost"]
    lines += ["## Overall", "", "| model | pass@1 | pass w/ repair | total wall (s) | total cost | cost per solved |", "|---|---|---|---|---|---|"]
    for m in models:
        o = total[m]
        cps = (o["cost"] / o["prep"]) if o["prep"] else float("nan")
        lines.append(f"| {m} | {o['p1']}/{o['n']} ({100*o['p1']/o['n']:.0f}%) | {o['prep']}/{o['n']} ({100*o['prep']/o['n']:.0f}%) | {o['wall']:.0f} | ${o['cost']:.4f} | ${cps:.5f} |")
    lines.append("")

    out = os.path.join(ROOT, "REPORT.md")
    open(out, "w").write("\n".join(lines))
    print(out)
    print("\n".join(lines))


if __name__ == "__main__":
    main()
