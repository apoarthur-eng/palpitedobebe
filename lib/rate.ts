const h = new Map<string, { n: number; t: number }>();
export function limited(key: string, max: number, ms: number) {
  const now = Date.now(), e = h.get(key);
  if (!e || now - e.t > ms) { h.set(key, { n: 1, t: now }); return false; }
  return ++e.n > max;
}
export const ipOf = (h: Headers) => h.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
