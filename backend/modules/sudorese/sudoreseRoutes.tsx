// Rotas para sudorese - endpoints da API
// Define URLs para operações com análises de sudorese

import { Router } from "express"
import { sudoreseController } from "./sudoreseController"

const router = Router()

// POST /sudoreses - cria análise
router.post("/", sudoreseController.create)

// GET /sudoreses/:id - busca por ID
router.get("/:id", sudoreseController.getById)

// GET /sudoreses/atleta/:atletaId - busca por atleta
router.get("/atleta/:atletaId", sudoreseController.getByAtleta)

// GET /sudoreses - lista todas
router.get("/", sudoreseController.getAll)

export default router