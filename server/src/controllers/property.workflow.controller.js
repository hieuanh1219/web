const prisma = require("../db/prisma");

function ensureStatus(property, allowed) {
  if (!allowed.includes(property.status)) {
    const allowedStr = allowed.join(", ");
    throw new Error(`Invalid status: ${property.status}. Allowed: ${allowedStr}`);
  }
}

// POST /admin/properties/:id/submit
exports.submitProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Property not found" });

    ensureStatus(property, ["DRAFT"]);

    const updated = await prisma.property.update({
      where: { id },
      data: { status: "PENDING" },
    });

    return res.json({ message: "Submitted", property: updated });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// POST /admin/properties/:id/approve
exports.approveProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const moderatorId = req.user?.id;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Property not found" });

    ensureStatus(property, ["PENDING"]);

    const [updated] = await prisma.$transaction([
      prisma.property.update({
        where: { id },
        data: { status: "PUBLISHED", publishedAt: new Date() },
      }),
      prisma.propertyReview.create({
        data: { propertyId: id, moderatorId, action: "APPROVE" },
      }),
    ]);

    return res.json({ message: "Approved", property: updated });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// POST /admin/properties/:id/reject
exports.rejectProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body || {};
    const moderatorId = req.user?.id;

    if (!note) return res.status(400).json({ message: "Reject note is required" });

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Property not found" });

    ensureStatus(property, ["PENDING"]);

    const [updated] = await prisma.$transaction([
      prisma.property.update({
        where: { id },
        data: { status: "REJECTED" },
      }),
      prisma.propertyReview.create({
        data: { propertyId: id, moderatorId, action: "REJECT", note },
      }),
    ]);

    return res.json({ message: "Rejected", property: updated });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// POST /admin/properties/:id/archive
exports.archiveProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Property not found" });

    ensureStatus(property, ["PUBLISHED"]);

    const updated = await prisma.property.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return res.json({ message: "Archived", property: updated });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};