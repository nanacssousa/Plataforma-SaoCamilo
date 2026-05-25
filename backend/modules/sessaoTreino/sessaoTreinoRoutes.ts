import { Router } from "express"
import { sessaoTreinoController } from "./sessaoTreinoController"

const router = Router()

router.post("/", sessaoTreinoController.create)
router.get("/", sessaoTreinoController.getAll)
router.get("/usuario/:id_usuario", sessaoTreinoController.getByUsuario)
router.get("/:id", sessaoTreinoController.getById)
router.put("/:id", sessaoTreinoController.update)
router.delete("/:id", sessaoTreinoController.delete)

export default router
