import { Router } from "express"
import { equipeMembroController } from "./equipeMembroController"

const router = Router()

router.post("/", equipeMembroController.create)
router.get("/equipe/:id_equipe", equipeMembroController.getByEquipe)
router.get("/usuario/:id_usuario", equipeMembroController.getByUsuario)
router.put("/:id_equipe/:id_usuario", equipeMembroController.update)
router.delete("/:id_equipe/:id_usuario", equipeMembroController.delete)

export default router
