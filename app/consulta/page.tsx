import { db } from "@/lib/db"; import { STATUS_LABEL } from "@/lib/config";
export const dynamic = "force-dynamic";
export default async function Consulta({ searchParams }: { searchParams: { codigo?: string } }) {
  const c = searchParams.codigo?.trim().toUpperCase();
  const p = c ? await db.prediction.findUnique({ where: { code: c }, include: { participant: true } }) : null;
  return <main className="mx-auto max-w-md space-y-4 p-5">
    <h1 className="mt-8 text-3xl font-extrabold">consultar participação</h1>
    <form className="flex gap-2"><input name="codigo" defaultValue={c} placeholder="Digite seu código de participação" className="flex-1 rounded-2xl border border-slate-300 px-4 py-3" />
      <button className="rounded-2xl bg-ink px-5 font-bold text-white">buscar</button></form>
    {c && !p && <p className="text-red-600">Código não encontrado.</p>}
    {p && <div className="rounded-2xl bg-white p-5 shadow"><p>Nome: <b>{p.participant.name}</b></p>
      <p>Palpite: <b>{p.choice === "BOY" ? "menino" : "menina"}</b></p><p>Status: <b>{STATUS_LABEL[p.status]}</b></p></div>}
  </main>;
}
