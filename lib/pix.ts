const f = (id: string, v: string) => id + String(v.length).padStart(2, "0") + v;
function crc(s: string) { let c = 0xffff; for (let i = 0; i < s.length; i++) { c ^= s.charCodeAt(i) << 8; for (let j = 0; j < 8; j++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff; } return c.toString(16).toUpperCase().padStart(4, "0"); }
const clean = (s: string, n: number) => s.normalize("NFD").replace(/[^\x20-\x7e]/g, "").slice(0, n);
export function pixPayload(key: string, name: string, city: string, cents: number) {
  const p = f("00", "01") + f("26", f("00", "br.gov.bcb.pix") + f("01", key)) + f("52", "0000") + f("53", "986") + f("54", (cents / 100).toFixed(2)) + f("58", "BR") + f("59", clean(name, 25)) + f("60", clean(city, 15)) + f("62", f("05", "***")) + "6304";
  return p + crc(p);
}
