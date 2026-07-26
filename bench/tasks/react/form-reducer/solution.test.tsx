import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useUndoRedo } from './solution';

describe('useUndoRedo', () => {
  it('starts with the initial present and no history', () => {
    const { result } = renderHook(() => useUndoRedo('a'));
    expect(result.current.present).toBe('a');
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('set updates present and enables undo', () => {
    const { result } = renderHook(() => useUndoRedo('a'));
    act(() => result.current.set('b'));
    expect(result.current.present).toBe('b');
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('undo and redo move between states', () => {
    const { result } = renderHook(() => useUndoRedo('a'));
    act(() => result.current.set('b'));
    act(() => result.current.set('c'));
    act(() => result.current.undo());
    expect(result.current.present).toBe('b');
    expect(result.current.canRedo).toBe(true);
    act(() => result.current.undo());
    expect(result.current.present).toBe('a');
    act(() => result.current.redo());
    expect(result.current.present).toBe('b');
    act(() => result.current.redo());
    expect(result.current.present).toBe('c');
    expect(result.current.canRedo).toBe(false);
  });

  it('undo/redo are no-ops at the boundaries', () => {
    const { result } = renderHook(() => useUndoRedo('a'));
    act(() => result.current.undo());
    expect(result.current.present).toBe('a');
    act(() => result.current.redo());
    expect(result.current.present).toBe('a');
  });

  it('set clears the redo history', () => {
    const { result } = renderHook(() => useUndoRedo('a'));
    act(() => result.current.set('b'));
    act(() => result.current.undo());
    expect(result.current.canRedo).toBe(true);
    act(() => result.current.set('c'));
    expect(result.current.canRedo).toBe(false);
    act(() => result.current.redo());
    expect(result.current.present).toBe('c');
  });

  it('caps undo history at 50 entries', () => {
    const { result } = renderHook(() => useUndoRedo(0));
    act(() => {
      for (let i = 1; i <= 60; i++) result.current.set(i);
    });
    expect(result.current.present).toBe(60);
    // Undo as far as possible; capped past means we cannot reach value 0..9
    act(() => {
      for (let i = 0; i < 60; i++) result.current.undo();
    });
    // 50 undo steps available -> from 60 back to 10
    expect(result.current.present).toBe(10);
    expect(result.current.canUndo).toBe(false);
  });
});
