// src/controllers/admin/properties.controller.js
const prisma = require("../../db/prisma");

// ---------------- helpers ----------------
function clampInt(value, { min, max, fallback }) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function toNumber(v) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

// slugify đơn giản (đủ dùng dev)
function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 120);
}

async function makeUniqueSlug(baseSlug, excludeId) {
  let slug = baseSlug || "tin";
  let i = 0;

  while (true) {
    const candidate = i === 0 ? slug : `${slug}-${i}`;
    const exists = await prisma.property.findFirst({
      where: excludeId
        ? { slug: candidate, NOT: { id: excludeId } }
        : { slug: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
    i += 1;
    if (i > 2000) throw new Error("Cannot generate unique slug");
  }
}

// ---------------- controllers ----------------

/**
 * GET /api/admin/properties
 * Query: page, limit, status, q, authorId, typeId, locationId, sort
 */
exports.listAdminProperties = async (req, res) => {
  try {
    const page = clampInt(req.query.page, { min: 1, max: 1000000, fallback: 1 });
    const limit = clampInt(req.query.limit, { min: 1, max: 100, fallback: 20 });
    const skip = (page - 1) * limit;

    const status = (req.query.status || "").toString().trim() || undefined; // DRAFT|PUBLISHED|ARCHIVED...
    const q = (req.query.q || "").toString().trim();
    const authorId = (req.query.authorId || "").toString().trim() || undefined;
    const typeId = (req.query.typeId || "").toString().trim() || undefined;
    const locationId = (req.query.locationId || "").toString().trim() || undefined;

    const sort = (req.query.sort || "createdAt_desc").toString();
    const orderBy =
      sort === "createdAt_asc"
        ? [{ createdAt: "asc" }]
        : sort === "price_asc"
        ? [{ price: "asc" }, { createdAt: "desc" }]
        : sort === "price_desc"
        ? [{ price: "desc" }, { createdAt: "desc" }]
        : [{ createdAt: "desc" }];

    const where = {};
    if (status) where.status = status;
    if (authorId) where.authorId = authorId;
    if (typeId) where.typeId = typeId;
    if (locationId) where.locationId = locationId;

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { slug: { contains: q } },
        { description: { contains: q } },
        { address: { contains: q } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          location: true,
          type: true,
        },
      }),
      prisma.property.count({ where }),
    ]);

    return res.json({
      items,
      paging: { page, limit, total, totalPages: Math.ceil(total / limit) },
      applied: { page, limit, status, q, authorId, typeId, locationId, sort },
    });
  } catch (err) {
    console.error("[listAdminProperties]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/admin/properties/:id
 */
exports.getAdminPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        location: true,
        type: true,
        tags: { include: { tag: true } },
      },
    });

    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json(item);
  } catch (err) {
    console.error("[getAdminPropertyById]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/admin/properties
 * Body: title, description, transactionType, price, area, bedrooms, bathrooms, address, locationId, typeId, ... (optional)
 * Default: status=DRAFT
 */
exports.createAdminProperty = async (req, res) => {
  try {
    const authorId = req.user.id;

    const {
      title,
      slug,
      description,
      transactionType, // SALE|RENT
      currency,
      price,
      area,
      bedrooms,
      bathrooms,
      address,
      locationId,
      typeId,
    } = req.body || {};

    if (!title || !transactionType) {
      return res.status(400).json({ message: "title & transactionType are required" });
    }

    const baseSlug = slug ? slugify(slug) : slugify(title);
    const finalSlug = await makeUniqueSlug(baseSlug);

    const item = await prisma.property.create({
      data: {
        title,
        slug: finalSlug,
        description: description || null,
        transactionType,
        currency: currency || "VND",
        price: toNumber(price) ?? null,
        area: toNumber(area) ?? null,
        bedrooms: bedrooms ?? null,
        bathrooms: bathrooms ?? null,
        address: address || null,
        status: "DRAFT",
        authorId,
        locationId: locationId || null,
        typeId: typeId || null,
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        location: true,
        type: true,
      },
    });

    return res.status(201).json({ message: "Created", item });
  } catch (err) {
    console.error("[createAdminProperty]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateAdminProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const existed = await prisma.property.findUnique({ where: { id } });
    if (!existed) return res.status(404).json({ message: "Not found" });

    const body = req.body || {};
    const data = {};

    // fields cho phép update
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.transactionType !== undefined) data.transactionType = body.transactionType;
    if (body.currency !== undefined) data.currency = body.currency;
    if (body.price !== undefined) data.price = toNumber(body.price) ?? null;
    if (body.area !== undefined) data.area = toNumber(body.area) ?? null;
    if (body.bedrooms !== undefined) data.bedrooms = body.bedrooms ?? null;
    if (body.bathrooms !== undefined) data.bathrooms = body.bathrooms ?? null;
    if (body.address !== undefined) data.address = body.address ?? null;
    if (body.locationId !== undefined) data.locationId = body.locationId || null;
    if (body.typeId !== undefined) data.typeId = body.typeId || null;

    // đổi slug (optional)
    if (body.slug !== undefined) {
      const baseSlug = slugify(body.slug);
      data.slug = await makeUniqueSlug(baseSlug, id);
    } else if (body.title !== undefined && existed.slug === existed.title) {
      // không bắt buộc, tuỳ bạn muốn auto đổi slug theo title
    }

    const item = await prisma.property.update({
      where: { id },
      data,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        location: true,
        type: true,
      },
    });

    return res.json({ message: "Updated", item });
  } catch (err) {
    console.error("[updateAdminProperty]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE /api/admin/properties/:id
 * Xoá tin (cascade images theo schema)
 */
exports.deleteAdminProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const existed = await prisma.property.findUnique({ where: { id }, select: { id: true } });
    if (!existed) return res.status(404).json({ message: "Not found" });

    await prisma.property.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[deleteAdminProperty]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/admin/properties/:id/publish
 * Đăng bài: status=PUBLISHED + publishedAt=now
 */
exports.publishAdminProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const existed = await prisma.property.findUnique({ where: { id } });
    if (!existed) return res.status(404).json({ message: "Not found" });

    const item = await prisma.property.update({
      where: { id },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });

    return res.json({ message: "Published", item });
  } catch (err) {
    console.error("[publishAdminProperty]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/admin/properties/:id/unpublish
 * Gỡ bài: về DRAFT (hoặc ARCHIVED nếu bạn muốn)
 */
exports.unpublishAdminProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const existed = await prisma.property.findUnique({ where: { id } });
    if (!existed) return res.status(404).json({ message: "Not found" });

    const item = await prisma.property.update({
      where: { id },
      data: { status: "DRAFT" },
    });

    return res.json({ message: "Unpublished", item });
  } catch (err) {
    console.error("[unpublishAdminProperty]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/admin/properties/:id/archive
 * Lưu kho: status=ARCHIVED
 */
exports.archiveAdminProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const existed = await prisma.property.findUnique({ where: { id } });
    if (!existed) return res.status(404).json({ message: "Not found" });

    const item = await prisma.property.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return res.json({ message: "Archived", item });
  } catch (err) {
    console.error("[archiveAdminProperty]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};