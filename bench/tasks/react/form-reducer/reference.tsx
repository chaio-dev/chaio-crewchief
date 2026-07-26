import { useState, useCallback } from 'react';

const MAX_HISTORY = 50;

export function useUndoRedo<T>(initial: T) {
  const [state, setState] = useState<{ past: T[]; present: T; future: T[] }>({
    past: [],
    present: initial,
    future: [],
  });

  const set = useCallback((next: T) => {
    setState((s) => {
      const past = [...s.past, s.present];
      if (past.length > MAX_HISTORY) past.shift();
      return { past, present: next, future: [] };
    });
  }, []);

  const undo = useCallback(() => {
    setState((s) => {
      if (s.past.length === 0) return s;
      const past = s.past.slice(0, -1);
      const previous = s.past[s.past.length - 1];
      return { past, present: previous, future: [s.present, ...s.future] };
    });
  }, []);

  const redo = useCallback(() => {
    setState((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      const future = s.future.slice(1);
      return { past: [...s.past, s.present], present: next, future };
    });
  }, []);

  return {
    present: state.present,
    set,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
