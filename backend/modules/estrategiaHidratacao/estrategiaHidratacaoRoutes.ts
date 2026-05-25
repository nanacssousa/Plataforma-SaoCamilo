import { Router } from "express"
import { estrategiaHidratacaoController } from "./estrategiaHidratacaoController"

const router = Router()

router.post("/", estrategiaHidratacaoController.create)
router.get("/", estrategiaHidratacaoController.getAll)
router.get("/atleta/:id_atleta", estrategiaHidratacaoController.getByAtleta)
router.get("/nutricionista/:id_nutricionista", estrategiaHidratacaoController.getByNutricionista)
router.get("/:id", estrategiaHidratacaoController.getById)
router.put("/:id", estrategiaHidratacaoController.update)
router.delete("/:id", estrategiaHidratacaoController.delete)

export default router