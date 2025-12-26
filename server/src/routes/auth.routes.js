const router = require("express").Router();
const { validate } = require("../middlewares/validate.middleware");
const { loginSchema, refreshSchema } = require("../validations/auth.schema");
const controller = require("../controllers/auth.controller");

console.log("loginSchema OK?", !!loginSchema, "keys:", loginSchema && Object.keys(loginSchema));

router.post("/login", validate(loginSchema), controller.login);
router.post("/refresh", validate(refreshSchema), controller.refresh);

module.exports = router;
