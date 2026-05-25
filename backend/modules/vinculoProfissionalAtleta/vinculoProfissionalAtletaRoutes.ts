import { Router } from "express"
import { vinculoProfissionalAtletaController } from "./vinculoProfissionalAtletaController"

const router = Router()

router.post("/", vinculoProfissionalAtletaController.create)
router.get("/nutricionista/:id_nutricionista", vinculoProfissionalAtletaController.getByNutricionista)
router.get("/atleta/:id_atleta", vinculoProfissionalAtletaController.getByAtleta)
router.get("/:id", vinculoProfissionalAtletaController.getById)
router.put("/:id", vinculoProfissionalAtletaController.update)
router.delete("/:id", vinculoProfissionalAtletaController.delete)

export default router
