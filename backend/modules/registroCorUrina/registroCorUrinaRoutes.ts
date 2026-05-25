import { Router } from "express"
import { registroCorUrinaController } from "./registroCorUrinaController"

const router = Router()

router.post("/", registroCorUrinaController.create)
router.get("/", registroCorUrinaController.getAll)
router.get("/sessao/:id_sessao", registroCorUrinaController.getBySessao)
router.get("/:id", registroCorUrinaController.getById)
router.put("/:id", registroCorUrinaController.update)
router.delete("/:id", registroCorUrinaController.delete)

export default router
