// src/controllers/property.public.controller.js
const prisma = require("../db/prisma");
const { getCache, setCache } = require("../utils/cache");

// =========================
// helpers
// =========================
function buildOrderBy(sort) {
  switch (sort) {
    case "createdAt_asc":
      return [{ createdAt: "asc" }];
    case "price_asc":
      return [{ price: "asc" }, { createdAt: "desc" }];
    case "price_desc":
      return [{ price: "desc" }, { createdAt: "desc" }];
    case "area_asc":
      return [{ area: "asc" }, { createdAt: "desc" }];
    case "area_desc":
      return [{ area: "desc" }, { createdAt: "desc" }];
    case "createdAt_desc":
    default:
      return [{ createdAt: "desc" }];
  }
}

// normalize q cho tiếng Việt: lower, trim, collapse spaces, remove punctuation nhẹ
function normalizeQueryText(input) {
  if (!input) return "";
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[“”‘’"'`]/g, "")        // bỏ quote
    .replace(/[.,;:!?()[\]{}<>]/g, " ") // dấu câu -> space
    .replace(/\s+/g, " ")            // gộp spaces
    .trim();
}

// tách terms + lọc terms ngắn (1 ký tự) để giảm noise
function splitTerms(q) {
  const s = normalizeQueryText(q);
  if (!s) return [];
  return s
    .split(" ")
    .map((t) => t.trim())
    .filter((t) => t.length >= 2); // >=2 ký tự
}

async function getLocationIdBySlug(slug) {
  const loc = await prisma.location.findFirst({
    where: { slug },
    select: { id: true },
  });
  return loc ? loc.id : null;
}

async function getLocationTreeIds(rootId) {
  const ids = new Set([rootId]);
  let frontier = [rootId];

  while (frontier.length > 0) {
    const children = await prisma.location.findMany({
      where: { parentId: { in: frontier } },
      select: { id: true },
    });

    const next = [];
    for (const c of children) {
      if (!ids.has(c.id)) {
        ids.add(c.id);
        next.push(c.id);
      }
    }
    frontier = next;
  }

  return Array.from(ids);
}

async function getLocationTreeIdsCached(rootId) {
  const key = `locTree:${rootId}`;
  const hit = getCache(key);
  if (hit) return hit;

  const ids = await getLocationTreeIds(rootId);
  setCache(key, ids, 10 * 60 * 1000);
  return ids;
}

async function resolveTagIdsBySlugsCached(tagSlugs) {
  const key = `tagSlugs:${[...tagSlugs].sort().join(",")}`;
  const hit = getCache(key);
  if (hit) return hit;

  const tags = await prisma.tag.findMany({
    where: { slug: { in: tagSlugs } },
    select: { id: true },
  });

  const ids = tags.map((t) => t.id);
  setCache(key, ids, 10 * 60 * 1000);
  return ids;
}

// =========================
// GET /api/properties
// =========================
exports.getProperties = async (req, res, next) => {
  try {
    const qn = req.queryNormalized || {};

    const {
      page,
      limit,
      all,
      sort,
      match,

      q,
      typeId,
      transactionType,

      priceMin,
      priceMax,
      areaMin,
      areaMax,
      bedroomsMin,
      bathroomsMin,

      locationId,
      locationSlug,
      includeChildren,

      tagIds,
      tagSlugs,
      tagsMode,
    } = qn;

    const take = all ? 100000 : limit;
    const skip = all ? 0 : (page - 1) * limit;

    const where = { status: "PUBLISHED" };

    // 1) match conds (numeric/text filters)
    const filterConds = [];
    if (typeId) filterConds.push({ typeId });
    if (transactionType) filterConds.push({ transactionType });

    if (priceMin !== undefined || priceMax !== undefined) {
      const cond = {};
      if (priceMin !== undefined) cond.gte = priceMin;
      if (priceMax !== undefined) cond.lte = priceMax;
      filterConds.push({ price: cond });
    }

    if (areaMin !== undefined || areaMax !== undefined) {
      const cond = {};
      if (areaMin !== undefined) cond.gte = areaMin;
      if (areaMax !== undefined) cond.lte = areaMax;
      filterConds.push({ area: cond });
    }

    if (bedroomsMin !== undefined) filterConds.push({ bedrooms: { gte: bedroomsMin } });
    if (bathroomsMin !== undefined) filterConds.push({ bathrooms: { gte: bathroomsMin } });

    // ✅ NEW: normalize q -> terms -> AND từng term (chất lượng search tốt hơn)
    const terms = splitTerms(q);
    if (terms.length > 0) {
      // mỗi term phải match ít nhất 1 field (title/description/address)
      const termAnd = terms.map((t) => ({
        OR: [
          { title: { contains: t } },
          { description: { contains: t } },
          { address: { contains: t } },
        ],
      }));

      filterConds.push({ AND: termAnd });
    }

    // Apply match: any => OR, all => AND
    // Lưu ý: q đã được đưa vào filterConds theo dạng AND (chất lượng tốt hơn)
    if (filterConds.length > 0) {
      if (match === "any") {
        where.AND = [...(where.AND || []), { OR: filterConds }];
      } else {
        where.AND = [...(where.AND || []), ...filterConds];
      }
    }

    // 2) location (always AND)
    let effectiveLocationId = locationId;
    if (!effectiveLocationId && locationSlug) {
      effectiveLocationId = await getLocationIdBySlug(locationSlug);
      if (!effectiveLocationId) {
        return res.json({
          items: [],
          paging: all ? { all: true, total: 0 } : { page, limit, total: 0, totalPages: 0 },
          applied: { ...qn, qNormalized: normalizeQueryText(q), qTerms: terms },
        });
      }
    }

    if (effectiveLocationId) {
      if (includeChildren) {
        const ids = await getLocationTreeIdsCached(effectiveLocationId);
        where.locationId = { in: ids };
      } else {
        where.locationId = effectiveLocationId;
      }
    }

    // 3) tags (always AND)
    if ((tagIds?.length || 0) > 0 || (tagSlugs?.length || 0) > 0) {
      let resolvedTagIds = tagIds || [];

      if ((tagSlugs?.length || 0) > 0) {
        const idsFromSlugs = await resolveTagIdsBySlugsCached(tagSlugs);
        resolvedTagIds = Array.from(new Set([...resolvedTagIds, ...idsFromSlugs]));
      }

      if (resolvedTagIds.length > 0) {
        if (tagsMode === "all") {
          where.AND = [
            ...(where.AND || []),
            ...resolvedTagIds.map((id) => ({ tags: { some: { tagId: id } } })),
          ];
        } else {
          where.tags = { some: { tagId: { in: resolvedTagIds } } };
        }
      }
    }

    const orderBy = buildOrderBy(sort);

    const listSelect = {
      id: true,
      title: true,
      slug: true,
      transactionType: true,
      currency: true,
      price: true,
      area: true,
      bedrooms: true,
      bathrooms: true,
      address: true,
      createdAt: true,
      publishedAt: true,
      location: { select: { id: true, name: true, slug: true } },
      type: { select: { id: true, name: true, slug: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { id: true, url: true, alt: true },
      },
    };

    // ✅ all=true => bỏ count
    if (all) {
      const items = await prisma.property.findMany({
        where,
        orderBy,
        skip,
        take,
        select: listSelect,
      });

      return res.json({
        items,
        paging: { all: true, total: items.length },
        applied: { ...qn, qNormalized: normalizeQueryText(q), qTerms: terms },
      });
    }

    // ✅ paging thường => count
    const [items, total] = await prisma.$transaction([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take,
        select: listSelect,
      }),
      prisma.property.count({ where }),
    ]);

    return res.json({
      items,
      paging: { page, limit, total, totalPages: Math.ceil(total / limit) },
      applied: { ...qn, qNormalized: normalizeQueryText(q), qTerms: terms },
    });
  } catch (err) {
    return next(err);
  }
};

// =========================
// GET /api/properties/:slug
// =========================
exports.getPropertyBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const item = await prisma.property.findFirst({
      where: { slug, status: "PUBLISHED" },
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
    return next(err);
  }
};
