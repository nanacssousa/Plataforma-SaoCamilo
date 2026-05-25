import { Router } from "express"
import { usuariosController } from "./usuariosController"

const router = Router()

router.post("/register", usuariosController.register)
router.post("/login", usuariosController.login)
router.get("/", usuariosController.getAll)
router.get("/:id", usuariosController.getById)
router.put("/:id", usuariosController.update)
router.delete("/:id", usuariosController.delete)

export default router
