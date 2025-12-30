require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  /* =====================
     USERS
  ===================== */
  const superAdminPassword = await bcrypt.hash("SuperAdmin@123", 10);
  const adminPassword = await bcrypt.hash("Admin@123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@local.dev" },
    update: {},
    create: {
      email: "superadmin@local.dev",
      passwordHash: superAdminPassword,
      name: "Super Admin",
      role: "SUPER_ADMIN",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@local.dev" },
    update: {},
    create: {
      email: "admin@local.dev",
      passwordHash: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  /* =====================
     LOCATION
  ===================== */
  const binhDinh = await prisma.location.upsert({
    where: { slug: "binh-dinh" },
    update: {},
    create: {
      name: "Bình Định",
      slug: "binh-dinh",
    },
  });

  const quyNhon = await prisma.location.upsert({
    where: { slug: "quy-nhon" },
    update: {},
    create: {
      name: "Quy Nhơn",
      slug: "quy-nhon",
      parentId: binhDinh.id,
    },
  });

  /* =====================
     PROPERTY TYPE
  ===================== */
  const nhaPho = await prisma.propertyType.upsert({
    where: { name: "Nhà phố" },
    update: {},
    create: {
      name: "Nhà phố",
      slug: "nha-pho",
    },
  });

  /* =====================
     AMENITY
  ===================== */
  const ganBien = await prisma.amenity.upsert({
    where: { name: "Gần biển" },
    update: {},
    create: {
      name: "Gần biển",
      slug: "gan-bien",
    },
  });

  /* =====================
     TAG
  ===================== */
  const hotTag = await prisma.tag.upsert({
    where: { slug: "hot" },
    update: {},
    create: {
      name: "Hot",
      slug: "hot",
    },
  });

  /* =====================
     PROPERTY
  ===================== */
  const property = await prisma.property.upsert({
    where: { slug: "nha-pho-quy-nhon-demo" },
    update: {},
    create: {
      title: "Nhà phố Quy Nhơn (Demo)",
      slug: "nha-pho-quy-nhon-demo",
      description: "Nhà phố trung tâm Quy Nhơn, demo cho BE-1",
      transactionType: "SALE",
      price: 2500000000,
      currency: "VND",
      area: 80,
      bedrooms: 3,
      bathrooms: 2,
      address: "Quy Nhơn, Bình Định",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      locationId: quyNhon.id,
      typeId: nhaPho.id,
    },
  });

  await prisma.propertyAmenity.upsert({
    where: {
      propertyId_amenityId: {
        propertyId: property.id,
        amenityId: ganBien.id,
      },
    },
    update: {},
    create: {
      propertyId: property.id,
      amenityId: ganBien.id,
    },
  });

  await prisma.propertyTag.upsert({
    where: {
      propertyId_tagId: {
        propertyId: property.id,
        tagId: hotTag.id,
      },
    },
    update: {},
    create: {
      propertyId: property.id,
      tagId: hotTag.id,
    },
  });

  /* =====================
     POST + CATEGORY
  ===================== */
  const newsCategory = await prisma.postCategory.upsert({
    where: { slug: "tin-tuc" },
    update: {},
    create: {
      name: "Tin tức",
      slug: "tin-tuc",
    },
  });

  await prisma.post.upsert({
    where: { slug: "gioi-thieu-du-an-demo" },
    update: {},
    create: {
      title: "Giới thiệu dự án demo",
      slug: "gioi-thieu-du-an-demo",
      excerpt: "Bài viết demo cho hệ thống CMS",
      content: "Nội dung demo. Sau này sẽ thay bằng CMS thật.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: newsCategory.id,
    },
  });

  /* =====================
     SETTINGS
  ===================== */
  await prisma.setting.upsert({
    where: { key: "site_name" },
    update: {},
    create: {
      key: "site_name",
      value: "Web BĐS Demo",
    },
  });

  console.log("✅ Seed done");
  console.log("Super Admin: superadmin@local.dev / SuperAdmin@123");
  console.log("Admin: admin@local.dev / Admin@123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
