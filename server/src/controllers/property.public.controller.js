const { prisma } = require("../db/prisma");

// -------- helpers --------
function toNumber(v) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function toInt(v) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

function clampInt(value, { min, max, fallback }) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function parseCsv(v) {
  if (!v) return [];
  return String(v)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseBool(v, defaultValue = true) {
  if (v === undefined || v === null || v === "") return defaultValue;
  const s = String(v).toLowerCase().trim();
  return ["1", "true", "yes", "y", "on"].includes(s);
}

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

// -------- location helpers --------
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

// =========================
// GET /properties
// =========================
exports.getProperties = async (req, res) => {
  try {
    // ✅ paging
    const page = clampInt(req.query.page, { min: 1, max: 1000000, fallback: 1 });
    const limit = clampInt(req.query.limit, { min: 1, max: 50, fallback: 12 });
    const skip = (page - 1) * limit;

    const all = String(req.query.all || "").toLowerCase() === "true";
    const take = all ? 100000 : limit;
    const skip2 = all ? 0 : skip;

    // ✅ match mode
    const match = (req.query.match || "all").toString().toLowerCase(); // all|any

    // ✅ filters
    const q = (req.query.q || "").toString().trim();

    const typeId = req.query.typeId || undefined;
    const transactionType = req.query.transactionType || undefined;

    const priceMin = toNumber(req.query.priceMin);
    const priceMax = toNumber(req.query.priceMax);
    const areaMin = toNumber(req.query.areaMin);
    const areaMax = toNumber(req.query.areaMax);

    const bedroomsMin = toInt(req.query.bedroomsMin);
    const bathroomsMin = toInt(req.query.bathroomsMin);

    // ✅ location by id OR slug
    const locationId = req.query.locationId || undefined;
    const locationSlug = (req.query.locationSlug || "").toString().trim() || undefined;
    const includeChildren = parseBool(req.query.includeChildren, true);

    // ✅ tags
    const tagIds = parseCsv(req.query.tagIds);
    const tagSlugs = parseCsv(req.query.tagSlugs);
    const tagsMode = (req.query.tagsMode || "any").toString().toLowerCase(); // any|all

    // ✅ validate
    if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
      return res.status(400).json({ message: "priceMin must be <= priceMax" });
    }
    if (areaMin !== undefined && areaMax !== undefined && areaMin > areaMax) {
      return res.status(400).json({ message: "areaMin must be <= areaMax" });
    }

    // ✅ where base
    const where = { status: "PUBLISHED" };

    // =========================
    // 1) Build match conds (only for numeric/text filters)
    // =========================
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

    if (q) {
      filterConds.push({
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { address: { contains: q } },
        ],
      });
    }

    // ✅ Apply match: any = OR, all = AND
    if (filterConds.length > 0) {
      if (match === "any") {
        where.AND = [...(where.AND || []), { OR: filterConds }];
      } else {
        where.AND = [...(where.AND || []), ...filterConds];
      }
    }

    // =========================
    // 2) Location (always AND)
    // =========================
    let effectiveLocationId = locationId;
    if (!effectiveLocationId && locationSlug) {
      effectiveLocationId = await getLocationIdBySlug(locationSlug);
      if (!effectiveLocationId) {
        return res.json({
          items: [],
          paging: all ? { all: true, total: 0 } : { page, limit, total: 0, totalPages: 0 },
          applied: { all, match, locationSlug, includeChildren },
        });
      }
    }

    if (effectiveLocationId) {
      if (includeChildren) {
        const ids = await getLocationTreeIds(effectiveLocationId);
        where.locationId = { in: ids };
      } else {
        where.locationId = effectiveLocationId;
      }
    }

    // =========================
    // 3) Tags (always AND)
    // =========================
    if (tagIds.length > 0 || tagSlugs.length > 0) {
      let resolvedTagIds = tagIds;

      if (tagSlugs.length > 0) {
        const tags = await prisma.tag.findMany({
          where: { slug: { in: tagSlugs } },
          select: { id: true },
        });
        resolvedTagIds = Array.from(new Set([...resolvedTagIds, ...tags.map((t) => t.id)]));
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

    // ✅ sort
    const sort = req.query.sort || "createdAt_desc";
    const orderBy = buildOrderBy(sort);

    // ✅ query
    console.log("DEBUG all =", all, "take =", take, "skip2 =", skip2);
console.log("DEBUG where =", JSON.stringify(where, null, 2));
console.log("DEBUG orderBy =", JSON.stringify(orderBy, null, 2));

    const [items, total] = await prisma.$transaction([
      prisma.property.findMany({
        where,
        orderBy,
        skip: skip2,
        take,
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          location: true,
          type: true,
          tags: { include: { tag: true } },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return res.json({
      items,
      paging: all ? { all: true, total } : { page, limit, total, totalPages: Math.ceil(total / limit) },
      applied: {
        all,
        match,
        q,
        locationId,
        locationSlug,
        effectiveLocationId,
        includeChildren,
        typeId,
        transactionType,
        priceMin,
        priceMax,
        areaMin,
        areaMax,
        bedroomsMin,
        bathroomsMin,
        tagIds,
        tagSlugs,
        tagsMode,
        sort,
      },
    });
  } catch (err) {
    console.error("[getProperties]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /properties/:slug
exports.getPropertyBySlug = async (req, res) => {
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
    console.error("[getPropertyBySlug]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};