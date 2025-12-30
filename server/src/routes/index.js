const router = require("express").Router();

router.use("/health", require("./health.routes"));

router.use("/auth", require("./auth.routes"));
router.use("/properties", require("./property.routes"));
router.use("/taxonomy", require("./taxonomy.routes"));
router.use("/leads", require("./lead.routes"));
router.use("/admin/users", require("./admin/users.routes"));
router.use("/admin/properties", require("./admin/properties.routes"));

module.exports = router;
