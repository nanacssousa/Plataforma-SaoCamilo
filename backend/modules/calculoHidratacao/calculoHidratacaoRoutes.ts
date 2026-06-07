import { Router } from "express"
import { authMiddleware } from "../../shared/middlewares/authMiddleware"
import { calculoHidratacaoController } from "./calculoHidratacaoController"

const router = Router()

router.post("/", authMiddleware, calculoHidratacaoController.create)
router.get("/", authMiddleware, calculoHidratacaoController.getAll)
// POST /calculos-hidratacao/sessao/:id_sessao — calcula automaticamente
router.post("/sessao/:id_sessao", authMiddleware, calculoHidratacaoController.calcularPorSessao)
router.get("/sessao/:id_sessao", authMiddleware, calculoHidratacaoController.getBySessao)
router.get("/:id", authMiddleware, calculoHidratacaoController.getById)
router.put("/:id", authMiddleware, calculoHidratacaoController.update)
router.delete("/:id", authMiddleware, calculoHidratacaoController.delete)

export default router