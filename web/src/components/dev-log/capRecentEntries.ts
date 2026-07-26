const NAV_CAP = 5;

// D3 (dev-log-topics): a plain slice of entries already sorted by
// publishedAtUtc — no new sorting logic. Dev Log is an unbounded, growing
// stream rather than a fixed page set, so DrawerNav's submenu caps here
// instead of listing every entry. Array.slice never errors past the end of
// an array, so this returns every entry unchanged when fewer than `cap`
// exist — the same code path handles both cases.
export function capRecentEntries<T>(sortedEntries: T[], cap: number = NAV_CAP): T[] {
  return sortedEntries.slice(0, cap);
}
