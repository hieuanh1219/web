const router = require("express").Router();
const { requireAuth } = require("../../middlewares/auth.middleware");
const { requireRoles } = require("../../middlewares/rbac.middleware");

router.get("/", requireAuth, requireRoles("MODERATOR"), (req, res) => {
  res.json({ ok: true, me: req.user });
});

module.exports = router;
