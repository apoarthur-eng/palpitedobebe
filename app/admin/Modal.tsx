"use client";
import { useRef } from "react";
export default function Modal({ label, tone, children }: { label: string; tone: "ok" | "no"; children: React.ReactNode }) {
  const r = useRef<HTMLDialogElement>(null);
  return <>
    <button type="button" onClick={() => r.current?.showModal()} className={`font-bold ${tone === "ok" ? "text-green-700" : "text-red-700"}`}>{label}</button>
    <dialog ref={r} className="w-[90vw] max-w-sm rounded-2xl p-5 backdrop:bg-black/50">
      {children}
      <button type="button" onClick={() => r.current?.close()} className="mt-3 w-full text-slate-500">cancelar</button></dialog></>;
}
