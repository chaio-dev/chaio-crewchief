Write a single TypeScript React file exporting a hook `useUndoRedo`.

Contract:
- `export function useUndoRedo<T>(initial: T): UndoRedoResult<T>`

The returned object must have exactly these members:
- `present: T` — the current value (starts as `initial`).
- `set(next: T): void` — commit a new value. This pushes the current `present` onto the undo history, makes `next` the new `present`, and CLEARS the redo history (any previously undone states can no longer be redone).
- `undo(): void` — if there is undo history, move the current `present` onto the redo history and restore the most recent past value as `present`. If there is no undo history, do nothing.
- `redo(): void` — if there is redo history, move the current `present` onto the undo history and restore the most recently undone value as `present`. If there is no redo history, do nothing.
- `canUndo: boolean` — `true` when there is at least one past value.
- `canRedo: boolean` — `true` when there is at least one redoable value.

Behavioral requirements:
- The undo history is capped at 50 entries. When a `set` would grow the past beyond 50 entries, the OLDEST past entry is dropped so the past never exceeds 50 entries.
- Calling `set` with the redo history non-empty must clear the redo history.
- All updates must be reflected after a re-render.

Implementation notes: model state as `{ past: T[]; present: T; future: T[] }` with `useReducer` or `useState`. No external libraries.

Output ONLY one ```tsx code block containing the complete file.
