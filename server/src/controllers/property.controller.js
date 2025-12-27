const prisma = require("../db/prisma");
const { needReapprove } = require("../utils/property");
// helper check status
function ensureStatus(property, allowed) {
  if (!allowed.includes(property.status)) {
    throw new Error(`Invalid status: ${property.status}`);
  }
}
exports.submitProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Not found" });

    ensureStatus(property, ["DRAFT"]);

    const updated = await prisma.property.update({
      where: { id },
      data: { status: "PENDING" },
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.approveProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Not found" });

    ensureStatus(property, ["PENDING"]);

    const updated = await prisma.$transaction([
      prisma.property.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      }),
      prisma.propertyReview.create({
        data: {
          propertyId: id,
          moderatorId: userId,
          action: "APPROVE",
        },
      }),
    ]);

    res.json({ message: "Approved", property: updated[0] });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.rejectProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const userId = req.user.id;

    if (!note) {
      return res.status(400).json({ message: "Reject note is required" });
    }

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Not found" });

    ensureStatus(property, ["PENDING"]);

    const updated = await prisma.$transaction([
      prisma.property.update({
        where: { id },
        data: { status: "REJECTED" },
      }),
      prisma.propertyReview.create({
        data: {
          propertyId: id,
          moderatorId: userId,
          action: "REJECT",
          note,
        },
      }),
    ]);

    res.json({ message: "Rejected", property: updated[0] });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.archiveProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Not found" });

    ensureStatus(property, ["PUBLISHED"]);

    const updated = await prisma.property.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ message: "Not found" });
    }

    let data = { ...payload };

    // RULE QUAN TRỌNG
    if (
      property.status === "PUBLISHED" &&
      needReapprove(property, payload)
    ) {
      data.status = "PENDING";
    }

    const updated = await prisma.property.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};