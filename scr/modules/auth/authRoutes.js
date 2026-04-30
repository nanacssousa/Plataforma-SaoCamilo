const router = require("express").Router();
const authController = require("./authController");

router.post("/login", authController.login);
router.post("/cadastar", authController.cadastrar);

module.exports = router;