import { Observable, defer, timer, retry } from 'rxjs';

export function pollWithBackoff<T>(
  fn: () => Observable<T>,
  maxRetries: number,
  baseDelayMs: number,
): Observable<T> {
  return defer(fn).pipe(
    retry({
      count: maxRetries,
      delay: (_error, retryCount) => timer(baseDelayMs * Math.pow(2, retryCount - 1)),
    }),
  );
}
