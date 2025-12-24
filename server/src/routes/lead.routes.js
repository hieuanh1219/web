const router = require("express").Router();

router.post("/", (req, res) => res.json({ ok: true, route: "leads" }));

module.exports = router;
