Write a single TypeScript file exporting a function `pollWithBackoff` built on RxJS 7.

Contract:
- `export function pollWithBackoff<T>(fn: () => Observable<T>, maxRetries: number, baseDelayMs: number): Observable<T>`
- `fn` produces the source Observable for one attempt. It MUST be invoked fresh for the initial attempt and again for each retry (do not reuse a single subscription).
- Behavior:
  - Subscribe to `fn()`. If it emits/completes successfully, forward its values and complete.
  - If it errors, retry by calling `fn()` again after an exponential backoff delay. For the retry numbered `n` (1-based: the first retry is `n = 1`), wait `baseDelayMs * 2^(n - 1)` milliseconds before re-subscribing. So delays are `baseDelayMs, 2*baseDelayMs, 4*baseDelayMs, ...`.
  - Retry at most `maxRetries` times. After `maxRetries` failed retries (i.e. `1 + maxRetries` total attempts have all errored), propagate the last error to the subscriber.
- Delays MUST be produced with RxJS `timer(...)` (so tests can drive them with fake timers). Do not use bare `setTimeout`.

Import `Observable`, `timer`, and the `retry` operator from `rxjs`. Use `defer` (or equivalent) so each subscription re-invokes `fn`.

Output ONLY one ```ts code block containing the complete file.
