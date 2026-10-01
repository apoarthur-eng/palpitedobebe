export const BET_CENTS = Math.round(parseFloat(process.env.BET_AMOUNT ?? "2.00") * 100);
export const brl = (c: number) => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const pixInfo = () => ({ key: process.env.PIX_KEY ?? "", name: process.env.PIX_RECEIVER_NAME ?? "", city: process.env.PIX_RECEIVER_CITY ?? "" });
export const STATUS_LABEL = { PENDING_PAYMENT_CONFIRMATION: "aguardando confirmação", CONFIRMED: "participação confirmada", REJECTED: "pagamento não confirmado" } as const;
