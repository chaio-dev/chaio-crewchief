---
name: bench
description: Run the offline model-grading benchmark — score any Crew Chief model preset against the verified Python/React/Angular task suite to decide what belongs in routing.yaml. Use when evaluating a new model/provider for fleet work or re-checking current fleet quality. This does NOT test the live gateway (Crew Chief never grades output at runtime); it's a separate, occasional exercise.
---

The benchmark harness lives at `bench/`. It is decoupled from the live
gateway on purpose — Crew Chief itself never runs tests or judges output; this
tool exists solely to help you decide what to put in `routing.yaml`.

## Running

- Score one model: `python3 runner.py --models <preset> --runs 2`
- Quick smoke (1 task/track, 1 run): `python3 runner.py --models <preset> --smoke`
- Subset of tracks: `--tracks python,react` (tracks: python, react, angular)
- Regenerate standings: `python3 report.py` → writes `REPORT.md`

Presets must exist in Crew Chief's `models.yaml` (check `GET /models` on the
gateway or `crewchief_models`). New cloud models need: preset block (base_url,
model_id, api_key_env, provider_class) + a `rates.yaml` entry so the ledger
prices them honestly.

## Reading results

- Results append to `results/results.jsonl` (one row per attempt: initial or
  repair phase, verdict, wall, tokens, cost). It's cumulative across runs —
  note the date when comparing.
- Key metrics: pass@1 (spec-following ability), pass-with-repair (viability
  with one retry), cost per solved task.
- Grading requires the tests to be trustworthy: any NEW task must ship a
  reference solution proven to pass its own tests before scoring models
  against it (see existing `tasks/*/*/reference.*`).
- Once you have a result you trust, update `gateway/routing.yaml` by hand —
  Crew Chief only reads that file, it never runs this benchmark itself.

Context: 2026-07 standings in `REPORT.md`. Known caveat: the current suite
ceilings at the top tier — it separates the floor, not gpt-oss vs Sonnet.
See `bench/README.md` for the full scope note.
