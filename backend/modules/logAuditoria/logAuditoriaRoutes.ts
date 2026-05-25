import { Router } from "express"
import { logAuditoriaController } from "./logAuditoriaController"

const router = Router()

router.post("/", logAuditoriaController.create)
router.get("/", logAuditoriaController.getAll)
router.get("/usuario/:id_usuario", logAuditoriaController.getByUsuario)
router.get("/:id", logAuditoriaController.getById)
router.put("/:id", logAuditoriaController.update)
router.delete("/:id", logAuditoriaController.delete)

export default router