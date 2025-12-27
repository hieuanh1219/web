const router = require("express").Router();
const { requireAuth } = require("../../middlewares/auth.middleware");
const { can } = require("../../middlewares/rbac.middleware");
const { RESOURCES, ACTIONS } = require("../../constants");

// controllers (chỉnh đúng path/controller của bạn)
const {
  listAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../../controllers/admin/users.controller");

// ✅ mọi route trong file này đều cần đăng nhập
router.use(requireAuth);

// GET /api/admin/users/me (test nhanh)
router.get("/me", can(RESOURCES.USER, ACTIONS.READ), (req, res) => {
  res.json({ ok: true, me: req.user });
});

// ===============================
// SUPER_ADMIN quản lý ADMIN users
// ===============================

// LIST ADMINS
// GET /api/admin/users
router.get("/", can(RESOURCES.USER, ACTIONS.READ), listAdmins);

// CREATE ADMIN
// POST /api/admin/users
router.post("/", can(RESOURCES.USER, ACTIONS.CREATE), createAdmin);

// UPDATE ADMIN
// PUT /api/admin/users/:id
router.put("/:id", can(RESOURCES.USER, ACTIONS.UPDATE), updateAdmin);

// DELETE ADMIN (yêu cầu: chỉ SUPER_ADMIN)
// DELETE /api/admin/users/:id
router.delete("/:id", can(RESOURCES.USER, ACTIONS.DELETE), deleteAdmin);

module.exports = router;
