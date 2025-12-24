const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const { requireRoles } = require("../middlewares/rbac.middleware");

// ✅ test ping
router.get("/__ping", (req, res) => res.json({ ok: true, where: "properties" }));

// ✅ tạm thời stub để khỏi 404 (chưa cần controller)
router.get("/", (req, res) => res.json({ ok: true, route: "public list" }));

router.post("/admin", requireAuth, requireRoles("ADMIN", "EDITOR"), (req, res) => {
  res.json({ ok: true, route: "create property", body: req.body, user: req.user });
});

router.post("/admin/:id/submit", requireAuth, requireRoles("ADMIN", "EDITOR"), (req, res) => {
  res.json({ ok: true, route: "submit", id: req.params.id });
});

router.post("/admin/:id/approve", requireAuth, requireRoles("ADMIN", "MODERATOR"), (req, res) => {
  res.json({ ok: true, route: "approve", id: req.params.id });
});

router.post("/admin/:id/reject", requireAuth, requireRoles("ADMIN", "MODERATOR"), (req, res) => {
  res.json({ ok: true, route: "reject", id: req.params.id, note: req.body?.note });
});

// slug đặt cuối
router.get("/:slug", (req, res) => res.json({ ok: true, slug: req.params.slug }));

module.exports = router;
