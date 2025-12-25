const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const { requireRoles } = require("../middlewares/rbac.middleware");

// test ping
router.get("/__ping", (req, res) => {
  res.json({ ok: true, route: "properties" });
});

// tạo BĐS (ADMIN / EDITOR)
router.post(
  "/admin",
  requireAuth,
  requireRoles("ADMIN", "EDITOR"),
  (req, res) => {
    res.json({
      ok: true,
      body: req.body,
      user: req.user,
    });
  }
);

module.exports = router;
