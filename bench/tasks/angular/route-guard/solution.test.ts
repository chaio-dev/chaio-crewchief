import { describe, it, expect } from 'vitest';
import { makeAuthGuard } from './solution';

function session(loggedIn: boolean, roles: string[]) {
  return { isLoggedIn: () => loggedIn, roles: () => roles };
}

describe('makeAuthGuard', () => {
  it('redirects when not logged in, even with no required roles', () => {
    const guard = makeAuthGuard(session(false, []));
    expect(guard([])).toBe('redirect:/login');
    expect(guard(['admin'])).toBe('redirect:/login');
  });

  it('allows any logged-in user when no roles are required', () => {
    const guard = makeAuthGuard(session(true, []));
    expect(guard([])).toBe(true);
  });

  it('allows when the user has at least one required role', () => {
    const guard = makeAuthGuard(session(true, ['editor', 'viewer']));
    expect(guard(['admin', 'editor'])).toBe(true);
  });

  it('denies when the user has none of the required roles', () => {
    const guard = makeAuthGuard(session(true, ['viewer']));
    expect(guard(['admin', 'editor'])).toBe(false);
  });

  it('is case-sensitive for role matching', () => {
    const guard = makeAuthGuard(session(true, ['Admin']));
    expect(guard(['admin'])).toBe(false);
  });

  it('reflects live session state on each invocation', () => {
    let loggedIn = false;
    let roles: string[] = [];
    const guard = makeAuthGuard({ isLoggedIn: () => loggedIn, roles: () => roles });
    expect(guard(['admin'])).toBe('redirect:/login');
    loggedIn = true;
    expect(guard(['admin'])).toBe(false);
    roles = ['admin'];
    expect(guard(['admin'])).toBe(true);
  });
});
