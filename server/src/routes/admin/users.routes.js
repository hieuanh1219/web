const router = require("express").Router();
const { requireAuth } = require("../../middlewares/auth.middleware");
const { can } = require("../../middlewares/rbac.middleware");
const { RESOURCES, ACTIONS } = require("../../constants");

router.get(
  "/",
  requireAuth,
  can(RESOURCES.USER, ACTIONS.READ),
  (req, res) => {
    res.json({ ok: true, me: req.user });
  }
);

module.exports = router;
