import { Router } from "express"
import { biomarcadorMedicaoController } from "./biomarcadorMedicaoController"

const router = Router()

router.post("/", biomarcadorMedicaoController.create)
router.get("/", biomarcadorMedicaoController.getAll)
router.get("/usuario/:id_usuario", biomarcadorMedicaoController.getByUsuario)
router.get("/:id", biomarcadorMedicaoController.getById)
router.put("/:id", biomarcadorMedicaoController.update)
router.delete("/:id", biomarcadorMedicaoController.delete)

export default router