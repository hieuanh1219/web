const router = require("express").Router();

const { requireAuth } = require("../middlewares/auth.middleware");
const { can } = require("../middlewares/rbac.middleware");
const { RESOURCES, ACTIONS } = require("../constants");
const {
  getProperties,
  getPropertyBySlug,
} = require("../controllers/property.public.controller");

// test ping
router.get("/__ping", (req, res) => {
  res.json({ ok: true, route: "properties" });
});

// public
router.get("/", getProperties);
router.get("/:slug", getPropertyBySlug);

// t §­o BŽ?S (ADMIN / SUPER_ADMIN)
router.post(
  "/admin",
  requireAuth,
  can(RESOURCES.PROPERTY, ACTIONS.CREATE),
  (req, res) => {
    res.json({
      ok: true,
      body: req.body,
      user: req.user,
    });
  }
);

module.exports = router;
