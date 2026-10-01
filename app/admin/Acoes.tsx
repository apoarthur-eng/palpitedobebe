"use client";
import { useRef, useState } from "react";
type P = { id: string; code: string; name: string; valor: string; palpite: string };
export default function Acoes({ p, decide }: { p: P; decide: (fd: FormData) => Promise<void> }) {
  const ref = useRef<HTMLDialogElement>(null), [op, setOp] = useState<"confirm" | "reject">("confirm");
  const open = (o: "confirm" | "reject") => { setOp(o); ref.current?.showModal(); };
  return <>
    <button onClick={() => open("confirm")} className="mr-2 font-bold text-green-700">Confirmar pagamento</button>
    <button onClick={() => open("reject")} className="font-bold text-red-700">Recusar</button>
    <dialog ref={ref} className="w-[90vw] max-w-sm rounded-2xl p-5 backdrop:bg-black/40">
      <form action={async fd => { await decide(fd); ref.current?.close(); }} className="space-y-3">
        <input type="hidden" name="id" value={p.id} /><input type="hidden" name="op" value={op} />
        <h3 className="text-lg font-extrabold">{op === "confirm" ? "Confirma que o Pix desta participação foi recebido?" : "Recusar participação"}</h3>
        <p>Nome: <b>{p.name}</b><br />Valor: <b>{p.valor}</b><br />Palpite: <b>{p.palpite}</b><br />Código: <b>{p.code}</b></p>
        {op === "reject" && <><select name="note" className="w-full rounded border p-2"><option>pagamento não localizado</option><option>valor incorreto</option><option>Pix não identificado</option><option>outro</option></select></>}
        <div className="flex gap-2"><button type="button" onClick={() => ref.current?.close()} className="flex-1 rounded-xl border py-2">cancelar</button>
          <button className={`flex-1 rounded-xl py-2 font-bold text-white ${op === "confirm" ? "bg-green-700" : "bg-red-700"}`}>{op === "confirm" ? "Confirmar pagamento" : "Recusar"}</button></div>
      </form></dialog></>;
}
