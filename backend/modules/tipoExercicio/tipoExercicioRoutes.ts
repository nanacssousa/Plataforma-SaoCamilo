import { Router } from "express"
import { tipoExercicioController } from "./tipoExercicioController"

const router = Router()

router.post("/", tipoExercicioController.create)
router.get("/", tipoExercicioController.getAll)
router.get("/:id", tipoExercicioController.getById)
router.put("/:id", tipoExercicioController.update)
router.delete("/:id", tipoExercicioController.delete)

export default router
