import { describe, it, expect } from 'vitest';
import { passwordStrength, matchFields } from './solution';

describe('passwordStrength', () => {
  it('returns null for a strong password', () => {
    expect(passwordStrength({ value: 'Abcdef1!ghij' })).toBeNull();
  });

  it('flags every failing rule for a weak password', () => {
    expect(passwordStrength({ value: 'abc' })).toEqual({
      minLength: true,
      uppercase: true,
      digit: true,
      symbol: true,
    });
  });

  it('flags only the missing symbol', () => {
    expect(passwordStrength({ value: 'Abcdefghij1' })).toEqual({ symbol: true });
  });

  it('flags only length when everything else is present but too short', () => {
    expect(passwordStrength({ value: 'Ab1!' })).toEqual({ minLength: true });
  });

  it('treats null/undefined value as empty string', () => {
    expect(passwordStrength({ value: null })).toEqual({
      minLength: true,
      uppercase: true,
      lowercase: true,
      digit: true,
      symbol: true,
    });
  });
});

describe('matchFields', () => {
  it('returns null when the two fields are equal', () => {
    const v = matchFields('password', 'confirm');
    expect(v({ value: { password: 'x', confirm: 'x' } })).toBeNull();
  });

  it('returns { mismatch: true } when they differ', () => {
    const v = matchFields('password', 'confirm');
    expect(v({ value: { password: 'x', confirm: 'y' } })).toEqual({ mismatch: true });
  });

  it('treats a null value object as matching (both undefined)', () => {
    const v = matchFields('a', 'b');
    expect(v({ value: null })).toBeNull();
  });
});
