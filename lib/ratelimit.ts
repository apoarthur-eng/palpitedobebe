import { headers } from "next/headers";
const hits = new Map<string, number[]>();
// Limite em memória (suficiente para uma instância só). Retorna true se estourou.
export function limited(scope: string, max: number, windowMs = 60_000) {
  const ip = headers().get("x-forwarded-for")?.split(",")[0].trim() ?? "local", k = scope + ip, now = Date.now();
  const a = (hits.get(k) ?? []).filter(t => now - t < windowMs);
  a.push(now); hits.set(k, a);
  if (hits.size > 5000) hits.clear();
  return a.length > max;
}
