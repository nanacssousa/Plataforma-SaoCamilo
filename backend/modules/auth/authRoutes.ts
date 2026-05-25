import { Router } from "express"
import { authController } from "./authController"

const router = Router()

router.post("/login", authController.login)
router.post("/cadastrar", authController.cadastrar)

export default router