import { Pipe } from '@angular/core';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe {
  transform(value: Date | string, now?: Date): string {
    const then = value instanceof Date ? value : new Date(value);
    const reference = now ?? new Date();
    const s = Math.floor((reference.getTime() - then.getTime()) / 1000);

    if (s < 60) return 'just now';
    if (s < 3600) {
      const m = Math.floor(s / 60);
      return m === 1 ? '1 minute ago' : `${m} minutes ago`;
    }
    if (s < 86400) {
      const h = Math.floor(s / 3600);
      return h === 1 ? '1 hour ago' : `${h} hours ago`;
    }
    if (s < 31536000) {
      const d = Math.floor(s / 86400);
      return d === 1 ? '1 day ago' : `${d} days ago`;
    }
    const y = Math.floor(s / 31536000);
    return y === 1 ? '1 year ago' : `${y} years ago`;
  }
}
