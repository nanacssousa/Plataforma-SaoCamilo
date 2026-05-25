import { Router } from "express"
import { biomarcadorController } from "./biomarcadorController"

const router = Router()

router.post("/", biomarcadorController.create)
router.get("/", biomarcadorController.getAll)
router.get("/:id", biomarcadorController.getById)
router.put("/:id", biomarcadorController.update)
router.delete("/:id", biomarcadorController.delete)

export default router