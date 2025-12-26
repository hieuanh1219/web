/* prisma/seed.js */
require("dotenv").config();

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function upsertRole(code, name) {
  return prisma.role.upsert({
    where: { code },
    update: { name },
    create: { code, name },
  });
}

async function ensureUser({ email, password, name, phone, roles = [] }) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, phone }, // không overwrite passwordHash để tránh đổi mật khẩu seed vô tình
    create: { email, passwordHash, name, phone },
  });

  for (const roleCode of roles) {
    const role = await prisma.role.findUnique({ where: { code: roleCode } });
    if (!role) throw new Error(`Role not found: ${roleCode}`);

    await prisma.userRole.upsert({
      where: {
        userId_roleId: { userId: user.id, roleId: role.id },
      },
      update: {},
      create: { userId: user.id, roleId: role.id },
    });
  }

  return user;
}

function slugify(str) {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function upsertSetting(key, value) {
  return prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

async function upsertTag(name) {
  const slug = slugify(name);
  return prisma.tag.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
}

async function upsertAmenity(name) {
  const slug = slugify(name);
  return prisma.amenity.upsert({
    where: { name },
    update: { slug },
    create: { name, slug },
  });
}

async function upsertPostCategory(name) {
  const slug = slugify(name);
  return prisma.postCategory.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
}

async function upsertPage({ title, slug, content, metaTitle, metaDescription }) {
  return prisma.page.upsert({
    where: { slug },
    update: { title, content, metaTitle, metaDescription, isPublished: true },
    create: { title, slug, content, metaTitle, metaDescription, isPublished: true },
  });
}

async function upsertPropertyType(name) {
  const slug = slugify(name);
  return prisma.propertyType.upsert({
    where: { name },
    update: { slug },
    create: { name, slug },
  });
}

/**
 * Location tree:
 * - Bình Định
 *   - Quy Nhơn
 *     - Hải Cảng, Ghềnh Ráng, Nhơn Bình, Trần Phú (ví dụ)
 */
async function upsertLocation({ name, slug, parentId = null }) {
  // Location.slug là unique (optional). Nếu slug null thì dùng name làm fallback query không an toàn.
  // Ở seed full, luôn set slug.
  return prisma.location.upsert({
    where: { slug },
    update: { name, parentId },
    create: { name, slug, parentId },
  });
}

async function main() {
  console.log("🌱 Seeding...");

  // 1) Roles
  await upsertRole("ADMIN", "Administrator");
  await upsertRole("EDITOR", "Editor");
  await upsertRole("MODERATOR", "Moderator");

  // 2) Users
  const admin = await ensureUser({
    email: "admin@local.dev",
    password: "Admin@123",
    name: "System Admin",
    phone: "0900000000",
    roles: ["ADMIN"],
  });

  const editor = await ensureUser({
    email: "editor@local.dev",
    password: "Editor@123",
    name: "Content Editor",
    phone: "0900000001",
    roles: ["EDITOR"],
  });

  const moderator = await ensureUser({
    email: "moderator@local.dev",
    password: "Moderator@123",
    name: "Listing Moderator",
    phone: "0900000002",
    roles: ["MODERATOR"],
  });

  // 3) Settings
  await upsertSetting("siteName", "Quy Nhon Homes (Demo)");
  await upsertSetting("hotline", "0900 000 000");
  await upsertSetting("zalo", "0900 000 000");
  await upsertSetting("facebook", "https://facebook.com/quynhonhomes");
  await upsertSetting("address", "Quy Nhơn, Bình Định");
  await upsertSetting("email", "contact@local.dev");

  // 4) Taxonomy: Property Types
  const typeCanHo = await upsertPropertyType("Căn hộ");
  const typeNhaPho = await upsertPropertyType("Nhà phố");
  const typeDatNen = await upsertPropertyType("Đất nền");
  const typeBietThu = await upsertPropertyType("Biệt thự");

  // 5) Locations
  const binhDinh = await upsertLocation({ name: "Bình Định", slug: "binh-dinh" });
  const quyNhon = await upsertLocation({ name: "Quy Nhơn", slug: "quy-nhon", parentId: binhDinh.id });

  const haiCang = await upsertLocation({ name: "Hải Cảng", slug: "hai-cang", parentId: quyNhon.id });
  const ghenhRang = await upsertLocation({ name: "Ghềnh Ráng", slug: "ghenh-rang", parentId: quyNhon.id });
  const nhonBinh = await upsertLocation({ name: "Nhơn Bình", slug: "nhon-binh", parentId: quyNhon.id });
  const tranPhu = await upsertLocation({ name: "Trần Phú", slug: "tran-phu", parentId: quyNhon.id });

  // 6) Amenities
  const amenities = await Promise.all([
    upsertAmenity("Gần biển"),
    upsertAmenity("Bãi đỗ xe"),
    upsertAmenity("Thang máy"),
    upsertAmenity("Nội thất cơ bản"),
    upsertAmenity("An ninh 24/7"),
    upsertAmenity("Gần trường học"),
    upsertAmenity("Gần chợ"),
  ]);
  const amenityMap = Object.fromEntries(amenities.map(a => [a.slug, a]));

  // 7) Tags
  const tags = await Promise.all([
    upsertTag("Hot"),
    upsertTag("Mới đăng"),
    upsertTag("Giá tốt"),
    upsertTag("Chính chủ"),
    upsertTag("Có sổ"),
  ]);
  const tagMap = Object.fromEntries(tags.map(t => [t.slug, t]));

  // 8) Posts / News
  const catMarket = await upsertPostCategory("Thị trường");
  const catGuide = await upsertPostCategory("Kinh nghiệm");
  const catProject = await upsertPostCategory("Dự án");

  const post1 = await prisma.post.upsert({
    where: { slug: "thi-truong-bds-quy-nhon-2025" },
    update: {
      title: "Thị trường BĐS Quy Nhơn 2025: Cơ hội & xu hướng",
      status: "PUBLISHED",
      publishedAt: new Date(),
      categoryId: catMarket.id,
      authorId: admin.id,
    },
    create: {
      title: "Thị trường BĐS Quy Nhơn 2025: Cơ hội & xu hướng",
      slug: "thi-truong-bds-quy-nhon-2025",
      excerpt: "Tổng quan xu hướng tăng trưởng, khu vực tiềm năng và lưu ý khi đầu tư.",
      content:
        "Bài viết demo. Nội dung có thể thay bằng CMS. Tập trung SEO, từ khóa khu vực và phân khúc.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      metaTitle: "Thị trường BĐS Quy Nhơn 2025",
      metaDescription: "Tổng quan xu hướng và cơ hội đầu tư BĐS Quy Nhơn 2025.",
      authorId: admin.id,
      categoryId: catMarket.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: "kinh-nghiem-mua-nha-quy-nhon" },
    update: { status: "PUBLISHED", publishedAt: new Date(), categoryId: catGuide.id, authorId: admin.id },
    create: {
      title: "Kinh nghiệm mua nhà Quy Nhơn: 7 bước kiểm tra pháp lý",
      slug: "kinh-nghiem-mua-nha-quy-nhon",
      excerpt: "Checklist pháp lý, quy hoạch, sổ đỏ, hợp đồng và lưu ý đặt cọc.",
      content: "Bài viết demo. Checklist pháp lý giúp chuyển đổi lead tốt.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      metaTitle: "Kinh nghiệm mua nhà Quy Nhơn",
      metaDescription: "7 bước kiểm tra pháp lý khi mua nhà tại Quy Nhơn.",
      authorId: admin.id,
      categoryId: catGuide.id,
    },
  });

  const post3 = await prisma.post.upsert({
    where: { slug: "tong-hop-du-an-noi-bat" },
    update: { status: "PUBLISHED", publishedAt: new Date(), categoryId: catProject.id, authorId: admin.id },
    create: {
      title: "Tổng hợp dự án nổi bật tại Quy Nhơn",
      slug: "tong-hop-du-an-noi-bat",
      excerpt: "Danh sách dự án nổi bật theo khu vực, tiện ích và mức giá tham khảo.",
      content: "Bài viết demo. Có thể mở rộng thành module dự án riêng sau.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      metaTitle: "Dự án nổi bật Quy Nhơn",
      metaDescription: "Danh sách dự án nổi bật tại Quy Nhơn theo khu vực.",
      authorId: admin.id,
      categoryId: catProject.id,
    },
  });

// fallback nếu vì lý do nào đó tags chưa có
const tagHot = tagMap["hot"] ?? await upsertTag("Hot");
const tagMoiDang = tagMap["moi-dang"] ?? await upsertTag("Mới đăng");

await prisma.postTag.upsert({
  where: { postId_tagId: { postId: post1.id, tagId: tagHot.id } },
  update: {},
  create: { postId: post1.id, tagId: tagHot.id },
});

await prisma.postTag.upsert({
  where: { postId_tagId: { postId: post2.id, tagId: tagMoiDang.id } },
  update: {},
  create: { postId: post2.id, tagId: tagMoiDang.id },
});



  // 9) Pages
  await upsertPage({
    title: "Giới thiệu",
    slug: "gioi-thieu",
    metaTitle: "Giới thiệu",
    metaDescription: "Giới thiệu website demo BĐS Quy Nhơn.",
    content: "Trang giới thiệu demo. Có thể chỉnh sửa trên CMS.",
  });

  await upsertPage({
    title: "Liên hệ",
    slug: "lien-he",
    metaTitle: "Liên hệ",
    metaDescription: "Thông tin liên hệ.",
    content: "Hotline: 0900 000 000\nEmail: contact@local.dev\nĐịa chỉ: Quy Nhơn, Bình Định",
  });

  await upsertPage({
    title: "Chính sách bảo mật",
    slug: "chinh-sach-bao-mat",
    metaTitle: "Chính sách bảo mật",
    metaDescription: "Chính sách bảo mật dữ liệu.",
    content: "Trang chính sách demo.",
  });

  // Helper: create property with relations
  async function createOrUpdateProperty({
    slug,
    data,
    images = [],
    media = [],
    features = [],
    amenitySlugs = [],
    tagSlugs = [],
    leadSamples = [],
  }) {
    const prop = await prisma.property.upsert({
      where: { slug },
      update: { ...data },
      create: { ...data, slug },
    });

    // images: replace strategy (dev only)
    await prisma.propertyImage.deleteMany({ where: { propertyId: prop.id } });
    for (const [idx, img] of images.entries()) {
      await prisma.propertyImage.create({
        data: {
          propertyId: prop.id,
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder ?? idx,
        },
      });
    }

    // media
    await prisma.propertyMedia.deleteMany({ where: { propertyId: prop.id } });
    for (const [idx, m] of media.entries()) {
      await prisma.propertyMedia.create({
        data: {
          propertyId: prop.id,
          type: m.type,
          url: m.url,
          title: m.title,
          sortOrder: m.sortOrder ?? idx,
        },
      });
    }

    // features
    await prisma.propertyFeature.deleteMany({ where: { propertyId: prop.id } });
    for (const f of features) {
      await prisma.propertyFeature.create({
        data: {
          propertyId: prop.id,
          key: f.key,
          value: String(f.value),
        },
      });
    }

    // amenities relation
    await prisma.propertyAmenity.deleteMany({ where: { propertyId: prop.id } });
    for (const s of amenitySlugs) {
      const a = amenities.find((x) => x.slug === s);
      if (!a) continue;
      await prisma.propertyAmenity.create({
        data: { propertyId: prop.id, amenityId: a.id },
      });
    }

    // tags relation
    await prisma.propertyTag.deleteMany({ where: { propertyId: prop.id } });
    for (const s of tagSlugs) {
      const t = tagMap[s];
      if (!t) continue;
      await prisma.propertyTag.create({
        data: { propertyId: prop.id, tagId: t.id },
      });
    }

    // leads samples
    await prisma.lead.deleteMany({ where: { propertyId: prop.id } });
    for (const ld of leadSamples) {
      await prisma.lead.create({
        data: {
          propertyId: prop.id,
          name: ld.name,
          phone: ld.phone,
          email: ld.email,
          message: ld.message,
          source: ld.source ?? "FORM",
          status: ld.status ?? "NEW",
          assignedToId: ld.assignedToId ?? null,
        },
      });
    }

    return prop;
  }

  // 10) Sample properties
  await createOrUpdateProperty({
    slug: "nha-pho-trung-tam-quy-nhon",
    data: {
      title: "Nhà phố trung tâm Quy Nhơn - gần biển",
      description: "Nhà mới xây, pháp lý rõ ràng, phù hợp gia đình/đầu tư cho thuê.",
      transactionType: "SALE",
      currency: "VND",
      price: 2500000000,
      priceUnit: "VND",
      isNegotiable: true,
      area: 80,
      bedrooms: 3,
      bathrooms: 2,
      floors: 2,
      address: "Phường Hải Cảng, TP Quy Nhơn, Bình Định",
      status: "PUBLISHED",
      publishedAt: new Date(),
      metaTitle: "Bán nhà phố trung tâm Quy Nhơn",
      metaDescription: "Nhà phố trung tâm Quy Nhơn, gần biển, giá tốt.",
      canonicalUrl: "https://example.com/nha-pho-trung-tam-quy-nhon",
      authorId: editor.id,
      locationId: haiCang.id,
      typeId: typeNhaPho.id,
    },
    images: [
      { url: "https://picsum.photos/seed/qnh-1/1200/800", alt: "Mặt tiền", sortOrder: 0 },
      { url: "https://picsum.photos/seed/qnh-2/1200/800", alt: "Phòng khách", sortOrder: 1 },
      { url: "https://picsum.photos/seed/qnh-3/1200/800", alt: "Phòng ngủ", sortOrder: 2 },
    ],
    media: [
      { type: "VIDEO", url: "https://example.com/video-demo.mp4", title: "Video tour", sortOrder: 0 },
    ],
    features: [
      { key: "legal", value: "Sổ hồng riêng" },
      { key: "direction", value: "Đông Nam" },
      { key: "furniture", value: "Nội thất cơ bản" },
    ],
    amenitySlugs: ["gan-bien", "an-ninh-24-7", "gan-cho"],
    tagSlugs: ["hot", "gia-tot", "co-so"],
    leadSamples: [
      {
        name: "Anh Minh",
        phone: "0912345678",
        email: "minh@example.com",
        message: "Mình muốn xem nhà cuối tuần này.",
        source: "FORM",
        status: "NEW",
        assignedToId: editor.id,
      },
    ],
  });

  await createOrUpdateProperty({
    slug: "can-ho-view-bien-ghenh-rang",
    data: {
      title: "Căn hộ view biển Ghềnh Ráng - đầy đủ tiện ích",
      description: "Căn hộ cho thuê dài hạn, view biển, nội thất đầy đủ.",
      transactionType: "RENT",
      currency: "VND",
      priceMin: 8000000,
      priceMax: 12000000,
      priceUnit: "/tháng",
      isNegotiable: false,
      area: 55,
      bedrooms: 2,
      bathrooms: 1,
      floors: 15,
      address: "Phường Ghềnh Ráng, TP Quy Nhơn, Bình Định",
      status: "PUBLISHED",
      publishedAt: new Date(),
      metaTitle: "Cho thuê căn hộ view biển Quy Nhơn",
      metaDescription: "Căn hộ view biển Ghềnh Ráng, cho thuê dài hạn.",
      authorId: editor.id,
      locationId: ghenhRang.id,
      typeId: typeCanHo.id,
    },
    images: [
      { url: "https://picsum.photos/seed/qnh-4/1200/800", alt: "View biển", sortOrder: 0 },
      { url: "https://picsum.photos/seed/qnh-5/1200/800", alt: "Bếp", sortOrder: 1 },
    ],
    features: [
      { key: "deposit", value: "2 tháng" },
      { key: "contract", value: "Tối thiểu 12 tháng" },
      { key: "furniture", value: "Full nội thất" },
    ],
    amenitySlugs: ["thang-may", "bai-do-xe", "an-ninh-24-7"],
    tagSlugs: ["moi-dang"],
    leadSamples: [
      {
        name: "Chị Lan",
        phone: "0987654321",
        message: "Cho mình xin thêm hình ảnh và vị trí cụ thể.",
        source: "ZALO",
        status: "CONTACTED",
        assignedToId: moderator.id,
      },
    ],
  });

  await createOrUpdateProperty({
    slug: "dat-nen-nhon-binh-gia-tot",
    data: {
      title: "Đất nền Nhơn Bình giá tốt - tiềm năng tăng trưởng",
      description: "Đất nền khu dân cư, đường rộng, phù hợp đầu tư.",
      transactionType: "SALE",
      currency: "VND",
      price: 1350000000,
      priceUnit: "VND",
      isNegotiable: true,
      landArea: 100,
      frontage: 5,
      roadWidth: 10,
      address: "Phường Nhơn Bình, TP Quy Nhơn, Bình Định",
      status: "PENDING", // ví dụ tin đang chờ duyệt
      authorId: editor.id,
      locationId: nhonBinh.id,
      typeId: typeDatNen.id,
    },
    images: [
      { url: "https://picsum.photos/seed/qnh-6/1200/800", alt: "Lô đất", sortOrder: 0 },
    ],
    features: [
      { key: "legal", value: "Sổ đỏ" },
      { key: "planning", value: "Khu dân cư hiện hữu" },
    ],
    amenitySlugs: ["gan-truong-hoc", "gan-cho"],
    tagSlugs: ["gia-tot", "chinh-chu"],
  });

  // 11) Moderation trail sample for pending property
  const pending = await prisma.property.findUnique({ where: { slug: "dat-nen-nhon-binh-gia-tot" } });
  if (pending) {
    // tạo 1 review note mẫu nếu chưa có
    const cnt = await prisma.propertyReview.count({ where: { propertyId: pending.id } });
    if (cnt === 0) {
      await prisma.propertyReview.create({
        data: {
          propertyId: pending.id,
          moderatorId: moderator.id,
          action: "REJECT",
          note: "Thiếu ảnh mặt tiền + thông tin quy hoạch. Vui lòng bổ sung.",
        },
      });
    }
  }

  // 12) Contact message sample
  await prisma.contactMessage.create({
    data: {
      name: "Khách demo",
      phone: "0909123456",
      email: "demo@guest.com",
      subject: "Tư vấn đầu tư",
      message: "Mình muốn được tư vấn khu vực tiềm năng ở Quy Nhơn.",
    },
  });

  console.log("✅ Seed done");
  console.log("Admin login: admin@local.dev / Admin@123");
  console.log("Editor login: editor@local.dev / Editor@123");
  console.log("Moderator login: moderator@local.dev / Moderator@123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
