// Rotas para atletas - define os endpoints da API
// Mapeia URLs para os métodos do controlador

import { Router } from "express"
import { atletaController } from "./atletaController"

const router = Router()

// POST /atletas - cria um novo atleta
router.post("/", atletaController.create)

// GET /atletas/:id - busca atleta por ID
router.get("/:id", atletaController.getById)

// GET /atletas - retorna todos os atletas
router.get("/", atletaController.getAll)

export default router