import { revalidatePath } from "next/cache"; import { db } from "@/lib/db"; import { requireAdmin } from "@/lib/auth"; import { brl } from "@/lib/config";
export const dynamic = "force-dynamic";
const L: Record<string, string> = { PENDING_PAYMENT_CONFIRMATION: "PENDENTE", CONFIRMED: "CONFIRMADO", REJECTED: "RECUSADO" };
async function decide(fd: FormData) {
  "use server";
  const adminId = await requireAdmin(), id = String(fd.get("id")), ok = fd.get("op") === "confirm";
  const p = await db.prediction.findUnique({ where: { id } });
  if (!p || p.status !== "PENDING_PAYMENT_CONFIRMATION") return;
  const note = ok ? null : String(fd.get("note") || "outro").slice(0, 300), newStatus = ok ? "CONFIRMED" : "REJECTED";
  await db.$transaction([
    db.prediction.update({ where: { id }, data: { status: newStatus, reviewedById: adminId, adminNote: note, ...(ok ? { confirmedAt: new Date() } : { rejectedAt: new Date() }) } }),
    db.adminAuditLog.create({ data: { adminId, predictionId: id, action: ok ? "CONFIRM" : "REJECT", oldStatus: p.status, newStatus, note } })]);
  revalidatePath("/admin");
}
export default async function Admin({ searchParams }: { searchParams: { f?: string; q?: string } }) {
  await requireAdmin();
  const all = await db.prediction.findMany({ include: { participant: true }, orderBy: { createdAt: "desc" } });
  const conf = all.filter(p => p.status === "CONFIRMED"), pend = all.filter(p => p.status === "PENDING_PAYMENT_CONFIRMATION");
  const n = (a: typeof all, c: string) => a.filter(p => p.choice === c).length;
  const f = searchParams.f ?? "", q = (searchParams.q ?? "").toLowerCase();
  const rows = all.filter(p => (!f || p.status === f || p.choice === f) && (!q || [p.code, p.participant.name, p.participant.whatsapp].some(s => s.toLowerCase().includes(q))));
  const box = "rounded-2xl bg-white p-4 shadow";
  return <main className="mx-auto max-w-6xl space-y-6 p-5">
    <h1 className="text-3xl font-extrabold">painel do evento</h1>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className={box}>Total<b className="block text-3xl">{all.length}</b></div>
      <div className={box}>Pendentes<b className="block text-3xl">{pend.length}</b></div>
      <div className={box}>Confirmadas<b className="block text-3xl">{conf.length}</b></div>
      <div className={box}>Recusadas<b className="block text-3xl">{all.length - conf.length - pend.length}</b></div></div>
    <div className="grid gap-3 md:grid-cols-3">
      <div className="rounded-2xl bg-ink p-4 text-white">TOTAL CONFIRMADO<b className="block text-3xl">{brl(conf.reduce((s, p) => s + p.amount, 0))}</b>{conf.length} participações</div>
      <div className={box}><b className="text-boy">Menino</b> · total {n(all, "BOY")} · confirmados {n(conf, "BOY")} · pendentes {n(pend, "BOY")}</div>
      <div className={box}><b className="text-girl">Menina</b> · total {n(all, "GIRL")} · confirmados {n(conf, "GIRL")} · pendentes {n(pend, "GIRL")}</div></div>
    <form className="flex flex-wrap gap-2"><input name="q" defaultValue={q} placeholder="Buscar nome, WhatsApp ou código" className="rounded-xl border px-3 py-2" />
      <select name="f" defaultValue={f} className="rounded-xl border px-3 py-2"><option value="">Todos</option><option value="PENDING_PAYMENT_CONFIRMATION">Pendentes</option><option value="CONFIRMED">Confirmados</option><option value="REJECTED">Recusados</option><option value="BOY">Menino</option><option value="GIRL">Menina</option></select>
      <button className="rounded-xl bg-ink px-4 text-white">filtrar</button></form>
    <div className="overflow-x-auto rounded-2xl bg-white shadow"><table className="w-full text-left text-sm">
      <thead><tr className="border-b">{["Código", "Nome", "WhatsApp", "Palpite", "Valor", "Status", "Data", "Ações"].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
      <tbody>{rows.map(p => <tr key={p.id} className="border-b align-top">
        <td className="p-3 font-mono">{p.code}</td><td className="p-3">{p.participant.name}</td><td className="p-3">{p.participant.whatsapp}</td>
        <td className="p-3">{p.choice === "BOY" ? "MENINO" : "MENINA"}</td><td className="p-3">{brl(p.amount)}</td>
        <td className="p-3">{L[p.status]}{p.adminNote && <i className="block text-slate-500">{p.adminNote}</i>}</td>
        <td className="p-3">{p.createdAt.toLocaleString("pt-BR")}</td>
        <td className="space-y-2 p-3">{p.status === "PENDING_PAYMENT_CONFIRMATION" && <>
          <details><summary className="cursor-pointer font-bold text-green-700">Confirmar pagamento</summary>
            <form action={decide} className="mt-1 space-y-1"><input type="hidden" name="id" value={p.id} /><input type="hidden" name="op" value="confirm" />
              <p>Confirma que o Pix de {brl(p.amount)} de {p.participant.name} ({p.code}, {p.choice === "BOY" ? "menino" : "menina"}) foi recebido?</p>
              <button className="rounded-lg bg-green-700 px-3 py-1 text-white">Confirmar pagamento</button></form></details>
          <details><summary className="cursor-pointer font-bold text-red-700">Recusar</summary>
            <form action={decide} className="mt-1 space-y-1"><input type="hidden" name="id" value={p.id} /><input type="hidden" name="op" value="reject" />
              <select name="note" className="rounded border p-1"><option>pagamento não localizado</option><option>valor incorreto</option><option>Pix não identificado</option><option>outro</option></select>
              <button className="ml-1 rounded-lg bg-red-700 px-3 py-1 text-white">Recusar</button></form></details></>}</td></tr>)}</tbody></table></div>
  </main>;
}
