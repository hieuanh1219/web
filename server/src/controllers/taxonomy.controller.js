const prisma = require("../db/prisma");

// build tree from flat list
function buildTree(items) {
  const map = new Map();
  const roots = [];

  for (const it of items) {
    map.set(it.id, { ...it, children: [] });
  }

  for (const it of items) {
    const node = map.get(it.id);
    if (it.parentId && map.has(it.parentId)) {
      map.get(it.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

exports.getLocations = async (req, res, next) => {
  try {
    const tree = String(req.query.tree || "true").toLowerCase() !== "false";
    const q = (req.query.q || "").toString().trim();

    const where = {};
    if (q) where.name = { contains: q };

    const items = await prisma.location.findMany({
      where,
      select: { id: true, name: true, slug: true, parentId: true },
      orderBy: [{ name: "asc" }],
    });

    return res.json({ items: tree ? buildTree(items) : items });
  } catch (err) {
    return next(err);
  }
};

exports.getPropertyTypes = async (req, res, next) => {
  try {
    const items = await prisma.propertyType.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: [{ name: "asc" }],
    });
    return res.json({ items });
  } catch (err) {
    return next(err);
  }
};

exports.getTags = async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);

    const items = await prisma.tag.findMany({
      where: q ? { OR: [{ name: { contains: q } }, { slug: { contains: q } }] } : {},
      select: { id: true, name: true, slug: true },
      take: limit,
      orderBy: [{ name: "asc" }],
    });

    return res.json({ items });
  } catch (err) {
    return next(err);
  }
};

exports.getAmenities = async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);

    const items = await prisma.amenity.findMany({
      where: q ? { OR: [{ name: { contains: q } }, { slug: { contains: q } }] } : {},
      select: { id: true, name: true, slug: true },
      take: limit,
      orderBy: [{ name: "asc" }],
    });

    return res.json({ items });
  } catch (err) {
    return next(err);
  }
};
