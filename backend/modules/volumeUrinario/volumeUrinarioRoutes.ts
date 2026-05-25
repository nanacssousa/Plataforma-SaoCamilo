import { Router } from "express"
import { volumeUrinarioController } from "./volumeUrinarioController"

const router = Router()

router.post("/", volumeUrinarioController.create)
router.get("/", volumeUrinarioController.getAll)
router.get("/sessao/:id_sessao", volumeUrinarioController.getBySessao)
router.get("/:id", volumeUrinarioController.getById)
router.put("/:id", volumeUrinarioController.update)
router.delete("/:id", volumeUrinarioController.delete)

export default router
