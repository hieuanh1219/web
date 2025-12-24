const router = require("express").Router();

router.get("/locations", (req, res) => res.json({ ok: true, route: "taxonomy/locations" }));
router.get("/types", (req, res) => res.json({ ok: true, route: "taxonomy/types" }));

module.exports = router;
