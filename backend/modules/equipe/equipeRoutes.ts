import { Router } from "express"
import { equipeController } from "./equipeController"

const router = Router()

router.post("/", equipeController.create)
router.get("/", equipeController.getAll)
router.get("/:id/relatorio/pdf", equipeController.gerarPdf)
router.get("/:id/atletas", equipeController.getAtletasByEquipe)
router.get("/:id", equipeController.getById)
router.put("/:id", equipeController.update)
router.delete("/:id", equipeController.delete)

export default router
