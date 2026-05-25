import { Router } from "express"
import { alertaController } from "./alertaController"

const router = Router()

router.post("/", alertaController.create)
router.get("/", alertaController.getAll)
router.get("/usuario/:id_usuario", alertaController.getByUsuario)
router.get("/:id", alertaController.getById)
router.put("/:id", alertaController.update)
router.delete("/:id", alertaController.delete)

export default router
