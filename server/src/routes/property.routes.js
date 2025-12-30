const router = require("express").Router();
const { validateQuery } = require("../middlewares/validateQuery.middleware");
const { propertyListQuerySchema } = require("../validations/property.query");

const {
  getProperties,
  getPropertyBySlug,
} = require("../controllers/property.public.controller");

router.get("/__ping", (req, res) => {
  res.json({ ok: true, route: "properties" });
});

//public list with validated+normalized query
router.get("/", validateQuery(propertyListQuerySchema), getProperties);

//detail
router.get("/:slug", getPropertyBySlug);

module.exports = router;
