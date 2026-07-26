import { describe, it, expect } from 'vitest';
import { TimeAgoPipe } from './solution';

const NOW = new Date('2026-07-07T12:00:00.000Z');
const ago = (seconds: number) => new Date(NOW.getTime() - seconds * 1000);

describe('TimeAgoPipe', () => {
  const pipe = new TimeAgoPipe();

  it('returns "just now" under a minute', () => {
    expect(pipe.transform(ago(0), NOW)).toBe('just now');
    expect(pipe.transform(ago(59), NOW)).toBe('just now');
  });

  it('handles future dates as "just now"', () => {
    expect(pipe.transform(new Date(NOW.getTime() + 5000), NOW)).toBe('just now');
  });

  it('formats minutes with singular/plural', () => {
    expect(pipe.transform(ago(60), NOW)).toBe('1 minute ago');
    expect(pipe.transform(ago(300), NOW)).toBe('5 minutes ago');
    expect(pipe.transform(ago(3599), NOW)).toBe('59 minutes ago');
  });

  it('formats hours with singular/plural', () => {
    expect(pipe.transform(ago(3600), NOW)).toBe('1 hour ago');
    expect(pipe.transform(ago(3 * 3600), NOW)).toBe('3 hours ago');
  });

  it('formats days with singular/plural', () => {
    expect(pipe.transform(ago(86400), NOW)).toBe('1 day ago');
    expect(pipe.transform(ago(2 * 86400), NOW)).toBe('2 days ago');
  });

  it('formats years with singular/plural', () => {
    expect(pipe.transform(ago(31536000), NOW)).toBe('1 year ago');
    expect(pipe.transform(ago(2 * 31536000), NOW)).toBe('2 years ago');
  });

  it('accepts ISO string input', () => {
    expect(pipe.transform(ago(120).toISOString(), NOW)).toBe('2 minutes ago');
  });
});
