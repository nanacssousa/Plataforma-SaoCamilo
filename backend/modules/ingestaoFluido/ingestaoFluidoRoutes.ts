import { Router } from "express"
import { ingestaoFluidoController } from "./ingestaoFluidoController"

const router = Router()

router.post("/", ingestaoFluidoController.create)
router.get("/", ingestaoFluidoController.getAll)
router.get("/sessao/:id_sessao", ingestaoFluidoController.getBySessao)
router.get("/:id", ingestaoFluidoController.getById)
router.put("/:id", ingestaoFluidoController.update)
router.delete("/:id", ingestaoFluidoController.delete)

export default router
