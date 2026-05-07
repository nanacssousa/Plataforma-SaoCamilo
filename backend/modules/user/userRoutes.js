const express = require("express")
const { usuarioController } = require("./userController")

const router = express.Router()

router.post("/", usuarioController.create)
router.get("/:id", usuarioController.getById)

module.exports = router