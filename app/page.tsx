import QRCode from "qrcode"; import Fluxo from "./Fluxo"; import { BET_CENTS, brl, pixInfo } from "@/lib/config"; import { pixPayload } from "@/lib/pix";
export const dynamic = "force-dynamic";
export default async function Home() {
  const pix = pixInfo();
  const qr = pix.key ? await QRCode.toDataURL(pixPayload(pix.key, pix.name, pix.city, BET_CENTS), { margin: 1, width: 360 }) : "";
  return <Fluxo pix={pix} valor={brl(BET_CENTS)} qr={qr} />;
}
