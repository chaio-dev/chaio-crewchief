export function makeAuthGuard(session: { isLoggedIn(): boolean; roles(): string[] }) {
  return (requiredRoles: string[]): boolean | 'redirect:/login' => {
    if (!session.isLoggedIn()) return 'redirect:/login';
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const have = session.roles();
    return requiredRoles.some((r) => have.includes(r));
  };
}
