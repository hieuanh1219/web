// Admin endpoints sẽ là:

// POST /api/admin/properties
// PUT /api/admin/properties/:id
// DELETE /api/admin/properties/:id
// POST /api/admin/properties/:id/publish

const router = require("express").Router();
const { requireAuth } = require("../../middlewares/auth.middleware");
const { can } = require("../../middlewares/rbac.middleware");
const { RESOURCES, ACTIONS } = require("../../constants");

const ctrl = require("../../controllers/admin/properties.controller");

router.use(requireAuth);

// list + detail
router.get("/", can(RESOURCES.PROPERTY, ACTIONS.READ), ctrl.listAdminProperties);
router.get("/:id", can(RESOURCES.PROPERTY, ACTIONS.READ), ctrl.getAdminPropertyById);

// CRUD
router.post("/", can(RESOURCES.PROPERTY, ACTIONS.CREATE), ctrl.createAdminProperty);
router.put("/:id", can(RESOURCES.PROPERTY, ACTIONS.UPDATE), ctrl.updateAdminProperty);
router.delete("/:id", can(RESOURCES.PROPERTY, ACTIONS.DELETE), ctrl.deleteAdminProperty);

// publish/archive
router.post("/:id/publish", can(RESOURCES.PROPERTY, ACTIONS.PUBLISH), ctrl.publishAdminProperty);
router.post("/:id/unpublish", can(RESOURCES.PROPERTY, ACTIONS.PUBLISH), ctrl.unpublishAdminProperty);
router.post("/:id/archive", can(RESOURCES.PROPERTY, ACTIONS.ARCHIVE), ctrl.archiveAdminProperty);

module.exports = router;
