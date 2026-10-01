import "./globals.css";
export const metadata = { title: "Palpite do Bebê", description: "Menino ou menina? Dê seu palpite." };
export default function L({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body className="min-h-screen">{children}</body></html>;
}
