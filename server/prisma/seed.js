require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { code: "ADMIN", name: "Administrator" },
    { code: "EDITOR", name: "Editor" },
    { code: "MODERATOR", name: "Moderator" },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { code: r.code },
      update: {},
      create: r,
    });
  }

  const passwordHash = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@local.dev" },
    update: {},
    create: { email: "admin@local.dev", passwordHash, name: "System Admin" },
  });

  const adminRole = await prisma.role.findUnique({ where: { code: "ADMIN" } });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id },
  });
  // Seed property types
const types = ["Căn hộ", "Nhà phố", "Đất nền", "Biệt thự"];
for (const name of types) {
  await prisma.propertyType.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

// Seed locations (đơn giản)
const qn = await prisma.location.upsert({
  where: { id: "quy-nhon" },
  update: {},
  create: { id: "quy-nhon", name: "Quy Nhơn" },
});

await prisma.location.upsert({
  where: { id: "binh-dinh" },
  update: {},
  create: { id: "binh-dinh", name: "Bình Định" },
});


  console.log("✅ Seed done");
  console.log("Admin login: admin@local.dev / Admin@123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
