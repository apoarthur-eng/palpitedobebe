"use client";
import { useState } from "react";
type Props = { pix: { key: string; name: string; city: string }; valor: string; qr: string };
export default function Fluxo({ pix, valor, qr }: Props) {
  const [step, setStep] = useState(0), [choice, setChoice] = useState<"BOY" | "GIRL" | "">(""),
    [name, setName] = useState(""), [wpp, setWpp] = useState(""), [copied, setCopied] = useState(false),
    [code, setCode] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const card = (c: "BOY" | "GIRL") => (
    <button type="button" onClick={() => { setChoice(c); setStep(1); }}
      className={`h-44 rounded-3xl text-3xl font-extrabold text-white shadow-lg active:scale-95 transition ${c === "BOY" ? "bg-boy" : "bg-girl"}`}>
      {c === "BOY" ? "menino" : "menina"}</button>);
  async function enviar() {
    setBusy(true); setErr("");
    const r = await fetch("/api/participar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, whatsapp: wpp, choice }) });
    const d = await r.json(); setBusy(false);
    if (!r.ok) return setErr(d.error); setCode(d.code); setStep(3);
  }
  const inp = "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg";
  return (
    <main className="mx-auto max-w-md p-5">
      {step === 0 && <>
        <h1 className="mt-8 text-5xl font-extrabold leading-tight">qual é o teu palpite?</h1>
        <p className="mt-2 text-2xl text-slate-600">menino ou menina?</p>
        <p className="mt-4 text-slate-600">Escolhe teu palpite, faça o Pix de {valor} e aguarde a confirmação da participação.</p>
        <div className="mt-8 grid grid-cols-2 gap-4">{card("BOY")}{card("GIRL")}</div>
        <a href="/consulta" className="mt-8 block text-center text-slate-500 underline">já dei meu palpite</a></>}
      {step === 1 && <form className="mt-8 space-y-4" onSubmit={e => { e.preventDefault(); if (name.trim() && wpp.replace(/\D/g, "").length >= 10) setStep(2); else setErr("Informe nome e WhatsApp com DDD."); }}>
        <h2 className="text-3xl font-extrabold">dar meu palpite</h2>
        <input className={inp} placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} required />
        <input className={inp} placeholder="WhatsApp com DDD" inputMode="tel" value={wpp} onChange={e => setWpp(e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">{(["BOY", "GIRL"] as const).map(c =>
          <label key={c} className={`cursor-pointer rounded-2xl border-2 p-4 text-center text-xl font-bold ${choice === c ? (c === "BOY" ? "border-boy bg-blue-50" : "border-girl bg-pink-50") : "border-slate-200 bg-white"}`}>
            <input type="radio" className="sr-only" checked={choice === c} onChange={() => setChoice(c)} />{c === "BOY" ? "menino" : "menina"}</label>)}</div>
        <p className="text-lg">Valor: <b>{valor}</b></p>
        {err && <p className="text-red-600">{err}</p>}
        <button disabled={!choice} className="w-full rounded-2xl bg-ink py-4 text-xl font-bold text-white disabled:opacity-40">continuar</button></form>}
      {step === 2 && <div className="mt-8 space-y-4">
        <h2 className="text-3xl font-extrabold">agora é só fazer o Pix</h2>
        <p className="text-4xl font-extrabold">{valor}</p>
        <div className="rounded-2xl bg-white p-4 shadow"><p className="text-sm text-slate-500">chave Pix</p>
          <p className="break-all text-lg font-bold">{pix.key}</p>
          <button onClick={() => { navigator.clipboard.writeText(pix.key); setCopied(true); }} className="mt-3 w-full rounded-xl bg-boy py-3 font-bold text-white">
            {copied ? "chave Pix copiada!" : "copiar chave Pix"}</button>
          <p className="mt-3 text-sm text-slate-600">Recebedor: {pix.name} · {pix.city} · {valor}</p></div>
        {qr && <div className="text-center"><p className="text-slate-600">ou escaneie o QR Code</p><img src={qr} alt="QR Code Pix" className="mx-auto mt-2 w-52 rounded-xl bg-white p-2" /></div>}
        <p className="text-slate-600">Depois de realizar o Pix, volte aqui e confirme.</p>
        {err && <p className="text-red-600">{err}</p>}
        <button onClick={enviar} disabled={busy} className="w-full rounded-2xl bg-ink py-4 text-xl font-bold text-white disabled:opacity-50">{busy ? "enviando…" : "já fiz o Pix"}</button></div>}
      {step === 3 && <div className="mt-8 space-y-4 text-lg">
        <h2 className="text-3xl font-extrabold">Recebemos sua solicitação.</h2>
        <p>Seu pagamento será conferido manualmente.</p>
        <p>Você receberá a confirmação da participação após a conferência.</p>
        <div className="rounded-2xl bg-white p-5 text-center shadow"><p className="text-sm text-slate-500">Guarde seu código de participação.</p>
          <p className="text-4xl font-extrabold tracking-wide">{code}</p></div>
        <a className="block text-center underline" href={`/consulta?codigo=${code}`}>acompanhar minha participação</a></div>}
    </main>);
}
