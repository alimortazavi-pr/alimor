import "server-only";

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 4;
const hits = new Map<string, number[]>();

// One process serves the site, so an in-memory window is enough to stop a form flood
export function allow(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) hits.clear();
  return true;
}

// Arvan sends the visitor's address in ar-real-ip; without the CDN, Caddy appends it to X-Forwarded-For
export function clientKey(headers: Headers): string {
  const arvan = headers.get("ar-real-ip");
  if (arvan) return arvan;
  const chain =
    headers
      .get("x-forwarded-for")
      ?.split(",")
      .map((part) => part.trim()) ?? [];
  return chain.at(-1) ?? "unknown";
}
