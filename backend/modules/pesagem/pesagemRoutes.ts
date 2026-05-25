import { Router } from "express"
import { pesagemController } from "./pesagemController"

const router = Router()

router.post("/", pesagemController.create)
router.get("/", pesagemController.getAll)
router.get("/sessao/:id_sessao", pesagemController.getBySessao)
router.get("/:id", pesagemController.getById)
router.put("/:id", pesagemController.update)
router.delete("/:id", pesagemController.delete)

export default router
