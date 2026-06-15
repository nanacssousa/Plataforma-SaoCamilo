import { Router } from "express"
import { perfilAtleticoController } from "./perfilAtleticoController"

const router = Router()

router.post("/", perfilAtleticoController.create)
router.get("/", perfilAtleticoController.getAll)
router.get("/consolidado", perfilAtleticoController.getAllComDados)
router.get("/usuario/:id_usuario", perfilAtleticoController.getByUsuario)
router.get("/:id", perfilAtleticoController.getById)
router.put("/:id", perfilAtleticoController.update)
router.delete("/:id", perfilAtleticoController.delete)

export default router
