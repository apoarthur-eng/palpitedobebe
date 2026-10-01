import { limited } from "@/lib/ratelimit"; import { headers } from "next/headers"; import { limited, ipOf } from "@/lib/rate"; import { redirect } from "next/navigation"; import bcrypt from "bcryptjs"; import { db } from "@/lib/db"; import { createSession } from "@/lib/auth";
async function login(fd: FormData) {
  "use server";
  if (limited("login", 6, 300_000)) redirect("/admin/login?erro=1");
  if (limited("l" + ipOf(headers()), 8, 600000)) redirect("/admin/login?erro=1");
  const a = await db.admin.findUnique({ where: { email: String(fd.get("email")) } });
  if (!a || !(await bcrypt.compare(String(fd.get("password")), a.passwordHash))) redirect("/admin/login?erro=1");
  await createSession(a.id);
  await db.adminAuditLog.create({ data: { adminId: a.id, action: "LOGIN" } });
  redirect("/admin");
}
export default function Login({ searchParams }: { searchParams: { erro?: string } }) {
  return <form action={login} className="mx-auto mt-24 max-w-sm space-y-3 p-5">
    <h1 className="text-2xl font-extrabold">painel do evento</h1>
    <input name="email" type="email" placeholder="E-mail" required className="w-full rounded-xl border px-4 py-3" />
    <input name="password" type="password" placeholder="Senha" required className="w-full rounded-xl border px-4 py-3" />
    {searchParams.erro && <p className="text-red-600">E-mail ou senha incorretos.</p>}
    <button className="w-full rounded-xl bg-ink py-3 font-bold text-white">entrar</button></form>;
}
