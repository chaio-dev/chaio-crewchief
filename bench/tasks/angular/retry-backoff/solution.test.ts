import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Observable } from 'rxjs';
import { pollWithBackoff } from './solution';

describe('pollWithBackoff', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function failingThenSucceed(failCount: number, value: string, calls: { n: number }) {
    return () =>
      new Observable<string>((sub) => {
        calls.n += 1;
        if (calls.n <= failCount) {
          sub.error(new Error('boom ' + calls.n));
        } else {
          sub.next(value);
          sub.complete();
        }
      });
  }

  it('succeeds on the first attempt without any delay', async () => {
    const calls = { n: 0 };
    const results: string[] = [];
    pollWithBackoff(failingThenSucceed(0, 'ok', calls), 3, 100).subscribe((v) => results.push(v));
    await vi.advanceTimersByTimeAsync(0);
    expect(calls.n).toBe(1);
    expect(results).toEqual(['ok']);
  });

  it('retries with exponential backoff then succeeds', async () => {
    const calls = { n: 0 };
    const results: string[] = [];
    let errored = false;
    pollWithBackoff(failingThenSucceed(2, 'done', calls), 5, 100).subscribe({
      next: (v) => results.push(v),
      error: () => (errored = true),
    });
    // attempt 1 (t=0) fails; retry 1 after 100ms; retry 2 after 200ms
    await vi.advanceTimersByTimeAsync(99);
    expect(calls.n).toBe(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(calls.n).toBe(2);
    await vi.advanceTimersByTimeAsync(199);
    expect(calls.n).toBe(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(calls.n).toBe(3);
    expect(results).toEqual(['done']);
    expect(errored).toBe(false);
  });

  it('propagates the error after exhausting maxRetries', async () => {
    const calls = { n: 0 };
    let errorMsg = '';
    pollWithBackoff(failingThenSucceed(99, 'never', calls), 2, 50).subscribe({
      next: () => {},
      error: (e) => (errorMsg = String(e.message)),
    });
    await vi.advanceTimersByTimeAsync(10_000);
    // 1 initial + 2 retries = 3 attempts, all fail
    expect(calls.n).toBe(3);
    expect(errorMsg).toBe('boom 3');
  });
});
