Write a single TypeScript React file exporting a hook `useDebounce`.

Contract:
- `export function useDebounce<T>(value: T, delayMs: number): T`
- The hook returns a debounced copy of `value`.
- On the very first render it returns the initial `value` immediately (no delay).
- When `value` changes, the returned value must NOT update right away. It updates to the latest `value` only after `delayMs` milliseconds have elapsed with no further changes.
- If `value` changes again before `delayMs` elapses, the previously pending update is cancelled and the timer restarts from the new value (only the most recent value is ever committed).
- If `delayMs` changes, the pending timer restarts using the new delay.
- Must clean up any pending timer on unmount (no state updates after unmount).

Implementation notes: use React hooks only (`useState`, `useEffect`). Use `setTimeout`/`clearTimeout` (do not rely on any external library). Assume timers are controllable by fake timers in tests.

Output ONLY one ```tsx code block containing the complete file.
