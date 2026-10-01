import { NextResponse } from "next/server"; import { db } from "@/lib/db"; import { BET_CENTS } from "@/lib/config";
const AL = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const gen = () => "PALP-" + Array.from({ length: 5 }, () => AL[Math.floor(Math.random() * AL.length)]).join("");
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name ?? "").trim().slice(0, 120), wpp = String(b.whatsapp ?? "").replace(/\D/g, "");
  if (!name || wpp.length < 10 || wpp.length > 13 || !["BOY", "GIRL"].includes(b.choice))
    return NextResponse.json({ error: "Preencha nome, WhatsApp e palpite." }, { status: 400 });
  for (let i = 0; i < 5; i++) {
    try {
      const p = await db.prediction.create({ data: { code: gen(), choice: b.choice, amount: BET_CENTS,
        participant: { create: { name, whatsapp: wpp } } } });
      return NextResponse.json({ code: p.code });
    } catch (e: any) { if (e.code !== "P2002") break; }
  }
  return NextResponse.json({ error: "Erro ao registrar. Tente de novo." }, { status: 500 });
}
