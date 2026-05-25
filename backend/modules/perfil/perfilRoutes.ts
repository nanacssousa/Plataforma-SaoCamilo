import { Router } from "express"
import { perfilController } from "./perfilController"

const router = Router()

router.post("/", perfilController.create)
router.get("/", perfilController.getAll)
router.get("/:id", perfilController.getById)
router.put("/:id", perfilController.update)
router.delete("/:id", perfilController.delete)

export default router
