const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/property.workflow.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

// tất cả đều phải đăng nhập admin
router.use(requireAuth);

// submit duyệt
router.post("/:id/submit", ctrl.submitProperty);

// approve
router.post("/:id/approve", ctrl.approveProperty);

// reject
router.post("/:id/reject", ctrl.rejectProperty);

// archive
router.post("/:id/archive", ctrl.archiveProperty);
router.get("/", (req, res) => res.json({ ok: true, route: "admin/properties" }));

module.exports = router;
