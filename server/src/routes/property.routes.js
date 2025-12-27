// file chi dung de :
// GET /api/properties

// GET /api/properties/:slug

const router = require("express").Router();
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

module.exports = router;
