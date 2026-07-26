#!/usr/bin/env python3
"""Hybrid benchmark runner: drives a model×task matrix through the Dispatch
gateway, grades artifacts locally (python: subprocess asserts; react/angular:
vitest in ./web), allows one repair attempt with error feedback, and appends
one JSONL row per attempt to results/results.jsonl.

Usage: runner.py [--models a,b,c] [--runs 2] [--tracks python,react,angular] [--smoke]
"""
import argparse, json, os, re, shutil, subprocess, sys, tempfile, threading, time, urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
DISPATCH = os.environ.get("DISPATCH_URL", "${DISPATCH_URL:-http://localhost:8181}")
DEFAULT_MODELS = ["cf-gpt-oss-120b", "cf-glm-5.2", "cf-kimi-k2.7-code", "cf-qwen2.5-coder-32b"]
RESULTS = os.path.join(ROOT, "results", "results.jsonl")
WEB = os.path.join(ROOT, "web")
LOCK = threading.Lock()

TRACK_EXT = {"python": "py", "react": "tsx", "angular": "ts"}
TRACK_FENCE = {"python": "python", "react": "tsx", "angular": "ts"}


def log(msg):
    with LOCK:
        print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def record(row):
    with LOCK:
        with open(RESULTS, "a") as f:
            f.write(json.dumps(row) + "\n")


def delegate(model, task_text, timeout=360):
    body = json.dumps({"task": task_text, "model": model, "mode": "fast"}).encode()
    req = urllib.request.Request(DISPATCH + "/delegate", data=body,
                                 headers={"Content-Type": "application/json"})
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read())
    wall = time.time() - t0
    a = data.get("attempts") or [{}]
    last = a[-1]
    return {
        "artifact": data.get("artifact") or "",
        "request_id": data.get("request_id", ""),
        "status": data.get("status", ""),
        "wall_s": round(wall, 2),
        "prompt_tokens": sum(x.get("prompt_tokens", 0) for x in a),
        "output_tokens": sum(x.get("output_tokens", 0) for x in a),
        "cost_usd": sum(x.get("cost_usd", 0.0) for x in a),
    }


def strip_fence(text, track):
    """Dispatch usually extracts the code block already; tolerate leftovers."""
    m = re.findall(r"```[a-zA-Z]*\s*\n(.*?)```", text, re.S)
    if m:
        return max(m, key=len).strip() + "\n"
    return text.strip() + "\n"


def grade_python(task_dir, code):
    d = tempfile.mkdtemp(prefix="hb-py-")
    try:
        open(os.path.join(d, "solution.py"), "w").write(code)
        shutil.copy(os.path.join(task_dir, "test_solution.py"), d)
        r = subprocess.run([sys.executable, "test_solution.py"], cwd=d,
                           capture_output=True, text=True, timeout=30)
        return r.returncode == 0, (r.stdout + r.stderr)[-2000:]
    except subprocess.TimeoutExpired:
        return False, "TIMEOUT after 30s"
    finally:
        shutil.rmtree(d, ignore_errors=True)


def grade_web(task_dir, code, track, model, task_name):
    ext = TRACK_EXT[track]
    test_src = next(f for f in os.listdir(task_dir) if ".test." in f)
    slug = re.sub(r"[^a-z0-9-]", "-", model.lower())
    rel = os.path.join("src", "bench", slug, f"{track}-{task_name}")
    d = os.path.join(WEB, rel)
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, f"solution.{ext}"), "w").write(code)
    shutil.copy(os.path.join(task_dir, test_src), d)
    try:
        r = subprocess.run(["npx", "vitest", "run", rel, "--reporter=dot"],
                           cwd=WEB, capture_output=True, text=True, timeout=180)
        return r.returncode == 0, (r.stdout + r.stderr)[-2000:]
    except subprocess.TimeoutExpired:
        return False, "TIMEOUT after 180s"


def grade(track, task_dir, code, model, task_name):
    if track == "python":
        return grade_python(task_dir, code)
    return grade_web(task_dir, code, track, model, task_name)


def run_task(model, track, task_name, task_dir, run_idx):
    prompt = open(os.path.join(task_dir, "prompt.md")).read()
    base = {"model": model, "track": track, "task": task_name, "run": run_idx}

    # phase 1: initial
    try:
        res = delegate(model, prompt)
    except Exception as e:
        record({**base, "phase": "initial", "verdict": "delegate_error", "error": str(e)[:300]})
        return "delegate_error"
    code = strip_fence(res["artifact"], track)
    ok, out = (False, "empty artifact") if not code.strip() else grade(track, task_dir, code, model, task_name)
    record({**base, "phase": "initial", "verdict": "pass" if ok else "fail",
            **{k: res[k] for k in ("request_id", "wall_s", "prompt_tokens", "output_tokens", "cost_usd")},
            **({} if ok else {"error": out[-600:]})})
    if ok:
        return "pass@1"

    # phase 2: one repair with error feedback
    fence = TRACK_FENCE[track]
    repair = (prompt + f"\n\nYour previous attempt:\n```{fence}\n{code}\n```\n\n"
              f"It failed with:\n{out[-1500:]}\n\nOutput the complete fixed file. "
              f"Output ONLY one ```{fence} code block.")
    try:
        res = delegate(model, repair)
    except Exception as e:
        record({**base, "phase": "repair", "verdict": "delegate_error", "error": str(e)[:300]})
        return "fail"
    code2 = strip_fence(res["artifact"], track)
    ok2, out2 = (False, "empty artifact") if not code2.strip() else grade(track, task_dir, code2, model, task_name)
    record({**base, "phase": "repair", "verdict": "pass" if ok2 else "fail",
            **{k: res[k] for k in ("request_id", "wall_s", "prompt_tokens", "output_tokens", "cost_usd")},
            **({} if ok2 else {"error": out2[-600:]})})
    return "pass@repair" if ok2 else "fail"


def run_model(model, tasks, runs):
    for track, task_name, task_dir in tasks:
        for run_idx in range(1, runs + 1):
            outcome = run_task(model, track, task_name, task_dir, run_idx)
            log(f"{model:24s} {track}/{task_name} run{run_idx}: {outcome}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", default=",".join(DEFAULT_MODELS))
    ap.add_argument("--runs", type=int, default=2)
    ap.add_argument("--tracks", default="python,react,angular")
    ap.add_argument("--smoke", action="store_true", help="first task of each track, 1 run")
    args = ap.parse_args()

    models = [m for m in args.models.split(",") if m]
    tracks = args.tracks.split(",")
    tasks = []
    for track in tracks:
        tdir = os.path.join(ROOT, "tasks", track)
        names = sorted(d for d in os.listdir(tdir) if os.path.isdir(os.path.join(tdir, d)))
        if args.smoke:
            names = names[:1]
        tasks.extend((track, n, os.path.join(tdir, n)) for n in names)
    runs = 1 if args.smoke else args.runs

    os.makedirs(os.path.dirname(RESULTS), exist_ok=True)
    log(f"matrix: {len(models)} models x {len(tasks)} tasks x {runs} runs")
    threads = [threading.Thread(target=run_model, args=(m, tasks, runs)) for m in models]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    log("DONE")


if __name__ == "__main__":
    main()
