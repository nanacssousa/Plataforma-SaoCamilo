import { Router } from "express"
import { triagemController } from "./triagemController"

const router = Router()

router.post("/", triagemController.create)
router.get("/", triagemController.getAll)
router.get("/sessao/:id_sessao", triagemController.getBySessao)
router.get("/:id", triagemController.getById)
router.put("/:id", triagemController.update)
router.delete("/:id", triagemController.delete)

export default router
