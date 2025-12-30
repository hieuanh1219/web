// src/routes/property.public.routes.js
const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/property.public.controller");

// Public listing
router.get("/", ctrl.getProperties);
//router.get("/:slug", ctrl.getPropertyBySlug);


module.exports = router;