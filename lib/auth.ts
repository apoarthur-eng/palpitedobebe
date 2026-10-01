import { SignJWT, jwtVerify } from "jose"; import { cookies } from "next/headers"; import { redirect } from "next/navigation";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET!);
export async function createSession(adminId: string) {
  const t = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setSubject(adminId).setExpirationTime("8h").sign(key());
  cookies().set("adm", t, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 28800 });
}
export async function requireAdmin(): Promise<string> {
  const t = cookies().get("adm")?.value; if (!t) redirect("/admin/login");
  try { return (await jwtVerify(t, key())).payload.sub as string; } catch { redirect("/admin/login"); }
}
