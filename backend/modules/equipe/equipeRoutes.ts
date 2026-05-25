import { Router } from "express"
import { equipeController } from "./equipeController"

const router = Router()

router.post("/", equipeController.create)
router.get("/", equipeController.getAll)
router.get("/:id", equipeController.getById)
router.put("/:id", equipeController.update)
router.delete("/:id", equipeController.delete)

export default router
