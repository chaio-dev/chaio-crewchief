Write a single TypeScript file exporting a factory `makeAuthGuard`.

Contract:
- `export function makeAuthGuard(session: { isLoggedIn(): boolean; roles(): string[] }): (requiredRoles: string[]) => boolean | 'redirect:/login'`
- `makeAuthGuard` takes a `session` object and returns a guard function.
- The returned guard takes `requiredRoles: string[]` and returns one of:
  - the exact string `'redirect:/login'` when `session.isLoggedIn()` is `false` (regardless of roles).
  - `true` when the user is logged in AND (`requiredRoles` is empty OR the user has AT LEAST ONE of the required roles).
  - `false` when the user is logged in but has NONE of the required roles (and `requiredRoles` is non-empty).
- Role matching is case-sensitive exact string comparison. `session.roles()` returns the user's roles.
- The guard must call `session.isLoggedIn()` and `session.roles()` each time it is invoked (so it reflects the current session state), not just once at factory-creation time.

Output ONLY one ```ts code block containing the complete file.
