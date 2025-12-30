const router = require("express").Router();
const ctrl = require("../controllers/taxonomy.controller");

// Public taxonomy
router.get("/locations", ctrl.getLocations);
router.get("/property-types", ctrl.getPropertyTypes);
router.get("/tags", ctrl.getTags);
router.get("/amenities", ctrl.getAmenities);

module.exports = router;
