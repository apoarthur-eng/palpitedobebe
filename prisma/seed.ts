import { PrismaClient } from "@prisma/client"; import bcrypt from "bcryptjs";
const db = new PrismaClient();
(async () => { const email = process.env.ADMIN_EMAIL!, pw = process.env.ADMIN_PASSWORD!;
  if (!email || !pw) throw new Error("Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env");
  await db.admin.upsert({ where: { email }, update: { passwordHash: await bcrypt.hash(pw, 12) }, create: { email, passwordHash: await bcrypt.hash(pw, 12) } });
  console.log("Admin pronto:", email); })();
