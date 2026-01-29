import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const memberHash = await bcrypt.hash("member123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "sarah.russell@lumenalta.com" },
    update: {},
    create: {
      email: "sarah.russell@lumenalta.com",
      name: "Sarah",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  const member = await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: {
      email: "member@example.com",
      name: "Sample Member",
      passwordHash: memberHash,
      role: "MEMBER",
      credits: 10,
    },
  });

  console.log("Seeded admin:", admin.email, "| member:", member.email);
  console.log("Admin password: admin123 | Member password: member123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
