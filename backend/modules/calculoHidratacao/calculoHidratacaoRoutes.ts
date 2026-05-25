import { Router } from "express"
import { calculoHidratacaoController } from "./calculoHidratacaoController"

const router = Router()

router.post("/", calculoHidratacaoController.create)
router.get("/", calculoHidratacaoController.getAll)
router.get("/sessao/:id_sessao", calculoHidratacaoController.getBySessao)
router.get("/:id", calculoHidratacaoController.getById)
router.put("/:id", calculoHidratacaoController.update)
router.delete("/:id", calculoHidratacaoController.delete)

export default router
