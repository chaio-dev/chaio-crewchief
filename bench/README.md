# Model bench

This is an **offline candidate-model grader**, decoupled from Crew Chief's live
delegation path. It does not run through `/delegate`, does not use
`retries`, and doesn't exercise anything in `internal/engine` — it drives
each model directly, grades the result with real tests (pytest/vitest), and
allows one repair attempt with the failure fed back.

That's intentional. Crew Chief itself never judges output (see the root
README) — the calling brain does, live, per request. This tool exists to
answer a different question, asked occasionally and offline: **"which model
should go in `routing.yaml` for a given language?"** Run it, read
`REPORT.md`, update the routing table by hand. Crew Chief just reads whatever
you put there.

## Usage

```bash
python3 runner.py --models cf-gpt-oss-120b,cf-glm-5.2 --runs 2
python3 runner.py --models <preset> --smoke   # 1 task/track, 1 run
python3 report.py                             # regenerate REPORT.md
```

Models are Crew Chief gateway presets (`GET /models` on the gateway, or check
`models.yaml`). Tasks live in `tasks/{python,react,angular}/`, each with a
`reference.*` solution proven to pass its own test before being trusted as
a grader.

## Reading results

Results accumulate in `results/results.jsonl`. Report.py aggregates pass@1
(first-try quality) and pass-with-repair (viability once you allow one
retry) per model per track, plus cost and wall time.

**Known limitation** (see 2026-07 findings): the current 12-task suite is
small enough that strong models cluster at 100% pass@1 — it discriminates
the floor (which cheap models are unreliable) better than the ceiling
(which cheap models rival frontier). Treat "ties Sonnet" claims from this
suite as "on this suite," not as a general result. A harder, larger suite
is the natural next step if finer discrimination is needed.
