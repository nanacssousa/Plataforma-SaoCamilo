import { Router } from "express"
import { sessaoAutenticacaoController } from "./sessaoAutenticacaoController"

const router = Router()

router.post("/", sessaoAutenticacaoController.create)
router.get("/", sessaoAutenticacaoController.getAll)
router.get("/usuario/:id_usuario", sessaoAutenticacaoController.getByUsuario)
router.get("/usuario/:id_usuario/ativas", sessaoAutenticacaoController.getActiveByUsuario)
router.get("/:id", sessaoAutenticacaoController.getById)
router.put("/:id", sessaoAutenticacaoController.update)
router.delete("/:id", sessaoAutenticacaoController.delete)

export default router