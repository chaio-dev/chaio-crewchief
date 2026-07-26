Write a single TypeScript file exporting an Angular pipe class `TimeAgoPipe`.

Contract:
- `export class TimeAgoPipe` with a method `transform(value: Date | string, now?: Date): string`.
- You MAY decorate it with `@Pipe({ name: 'timeAgo' })` imported from `@angular/core`, but the class MUST be constructible with `new TimeAgoPipe()` and testable by calling `transform` directly (no Angular runtime required).
- `value` may be a `Date` or an ISO date string; convert a string with `new Date(value)`.
- `now` defaults to `new Date()` when omitted. Compute elapsed time as `now - value` in seconds (floored to a whole number).

Output rules, evaluated in this order using the elapsed whole seconds `s`:
- `s < 60` → `"just now"` (this also covers the case where `value` is in the future, i.e. negative elapsed time → `"just now"`).
- `s < 3600` → minutes `m = Math.floor(s / 60)` → `"1 minute ago"` when `m === 1`, otherwise `"{m} minutes ago"`.
- `s < 86400` → hours `h = Math.floor(s / 3600)` → `"1 hour ago"` when `h === 1`, otherwise `"{h} hours ago"`.
- `s < 31536000` → days `d = Math.floor(s / 86400)` → `"1 day ago"` when `d === 1`, otherwise `"{d} days ago"`.
- otherwise → years `y = Math.floor(s / 31536000)` → `"1 year ago"` when `y === 1`, otherwise `"{y} years ago"`.

(Use 86400 seconds per day and 31536000 seconds per year — 365 days. No months.)

Output ONLY one ```ts code block containing the complete file.
