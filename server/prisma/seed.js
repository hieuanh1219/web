/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function slugify(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function upsertUser({ email, password, role, name }) {
  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      role,
     
      passwordHash,
      status: "ACTIVE",
    },
    create: {
      email,
      passwordHash,
      name,
      role,
      status: "ACTIVE",
    },
  });
}

async function main() {
  console.log("🌱 Seeding...");

  // 1) USERS
  const superAdmin = await upsertUser({
    email: "superadmin@local.dev",
    password: "SuperAdmin@123",
    role: "SUPER_ADMIN",
    name: "Super Admin",
  });

  const admin = await upsertUser({
    email: "admin@local.dev",
    password: "Admin@123",
    role: "ADMIN",
    name: "Admin",
  });

  console.log("✅ Users:", { superAdmin: superAdmin.email, admin: admin.email });

  // 2) LOCATION (tree)
  const hn = await prisma.location.upsert({
    where: { slug: "ha-noi" },
    update: { name: "Hà Nội" },
    create: { name: "Hà Nội", slug: "ha-noi" },
  });

  const cauGiay = await prisma.location.upsert({
    where: { slug: "cau-giay" },
    update: { name: "Cầu Giấy", parentId: hn.id },
    create: { name: "Cầu Giấy", slug: "cau-giay", parentId: hn.id },
  });

  // 3) PROPERTY TYPE
  const apartment = await prisma.propertyType.upsert({
    where: { name: "Căn hộ" },
    update: { slug: "can-ho" },
    create: { name: "Căn hộ", slug: "can-ho" },
  });

  const house = await prisma.propertyType.upsert({
    where: { name: "Nhà phố" },
    update: { slug: "nha-pho" },
    create: { name: "Nhà phố", slug: "nha-pho" },
  });

  // 4) AMENITIES
  const amenityNames = ["Bãi đỗ xe", "Thang máy", "Bảo vệ 24/7", "Gần trường học"];
  const amenities = [];
  for (const n of amenityNames) {
    const a = await prisma.amenity.upsert({
      where: { name: n },
      update: { slug: slugify(n) },
      create: { name: n, slug: slugify(n) },
    });
    amenities.push(a);
  }

  // 5) TAGS
  const tagInputs = ["giá tốt", "trung tâm", "sổ đỏ", "full nội thất"];
  const tags = [];
  for (const t of tagInputs) {
    const tg = await prisma.tag.upsert({
      where: { slug: slugify(t) },
      update: { name: t },
      create: { name: t, slug: slugify(t) },
    });
    tags.push(tg);
  }

  // 6) POST CATEGORY + POST
  const cat = await prisma.postCategory.upsert({
    where: { slug: "kien-thuc-bds" },
    update: { name: "Kiến thức BĐS" },
    create: { name: "Kiến thức BĐS", slug: "kien-thuc-bds" },
  });

  const postSlug = "huong-dan-mua-nha-lan-dau";
  const post = await prisma.post.upsert({
    where: { slug: postSlug },
    update: {
      title: "Hướng dẫn mua nhà lần đầu (Demo)",
      content: "Nội dung demo để test CMS...",
      status: "PUBLISHED",
      authorId: admin.id,
      categoryId: cat.id,
      publishedAt: new Date(),
    },
    create: {
      title: "Hướng dẫn mua nhà lần đầu (Demo)",
      slug: postSlug,
      excerpt: "Bài viết demo cho hệ thống CMS.",
      content: "Nội dung demo để test CMS...",
      coverUrl: "https://picsum.photos/seed/post-cover/1200/630",
      status: "PUBLISHED",
      authorId: admin.id,
      categoryId: cat.id,
      publishedAt: new Date(),
    },
  });

  // gắn tag cho post (many-to-many qua PostTag)
  for (const tg of tags.slice(0, 2)) {
    await prisma.postTag.upsert({
      where: { postId_tagId: { postId: post.id, tagId: tg.id } },
      update: {},
      create: { postId: post.id, tagId: tg.id },
    });
  }

  // 7) PROPERTY + relations
  const propertySlug = "can-ho-cau-giay-2pn-demo";
  const property = await prisma.property.upsert({
    where: { slug: propertySlug },
    update: {
      title: "Căn hộ Cầu Giấy 2PN (Demo)",
      description: "Căn hộ demo để test listing.",
      transactionType: "SALE",
      currency: "VND",
      price: "3500000000", // Decimal: có thể truyền string
      area: "75.5",
      bedrooms: 2,
      bathrooms: 2,
      address: "Cầu Giấy, Hà Nội",
      status: "PUBLISHED",
      publishedAt: new Date(),
      locationId: cauGiay.id,
      typeId: apartment.id,
      authorId: admin.id,
    },
    create: {
      title: "Căn hộ Cầu Giấy 2PN (Demo)",
      slug: propertySlug,
      description: "Căn hộ demo để test listing.",
      transactionType: "SALE",
      currency: "VND",
      price: "3500000000",
      area: "75.5",
      bedrooms: 2,
      bathrooms: 2,
      address: "Cầu Giấy, Hà Nội",
      status: "PUBLISHED",
      publishedAt: new Date(),
      locationId: cauGiay.id,
      typeId: apartment.id,
      authorId: admin.id,
    },
  });

  // Images (xóa cũ rồi tạo lại cho gọn)
  await prisma.propertyImage.deleteMany({ where: { propertyId: property.id } });
  await prisma.propertyImage.createMany({
    data: [
      {
        propertyId: property.id,
        url: "https://picsum.photos/seed/p1/1200/800",
        alt: "Ảnh 1",
        sortOrder: 0,
      },
      {
        propertyId: property.id,
        url: "https://picsum.photos/seed/p2/1200/800",
        alt: "Ảnh 2",
        sortOrder: 1,
      },
    ],
  });

  // Features
  await prisma.propertyFeature.deleteMany({ where: { propertyId: property.id } });
  await prisma.propertyFeature.createMany({
    data: [
      { propertyId: property.id, key: "legal", value: "Sổ đỏ lâu dài" },
      { propertyId: property.id, key: "direction", value: "Đông Nam" },
      { propertyId: property.id, key: "furniture", value: "Full nội thất" },
    ],
  });

  // Amenities link
  await prisma.propertyAmenity.deleteMany({ where: { propertyId: property.id } });
  await prisma.propertyAmenity.createMany({
    data: amenities.slice(0, 3).map((a) => ({
      propertyId: property.id,
      amenityId: a.id,
    })),
  });

  // Tags link
  await prisma.propertyTag.deleteMany({ where: { propertyId: property.id } });
  await prisma.propertyTag.createMany({
    data: tags.slice(0, 3).map((t) => ({
      propertyId: property.id,
      tagId: t.id,
    })),
  });

  // 8) PAGE + SETTINGS
  await prisma.page.upsert({
    where: { slug: "about" },
    update: { title: "Về chúng tôi", content: "Nội dung demo trang About", isPublished: true },
    create: {
      title: "Về chúng tôi",
      slug: "about",
      content: "Nội dung demo trang About",
      isPublished: true,
    },
  });

  await prisma.setting.upsert({
    where: { key: "site_name" },
    update: { value: "WEB-BDS-01" },
    create: { key: "site_name", value: "WEB-BDS-01" },
  });

  console.log("✅ Seed done.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
