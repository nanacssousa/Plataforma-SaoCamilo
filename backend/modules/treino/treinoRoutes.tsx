// Rotas para treinos - endpoints da API
// Define URLs para operações com sessões de treino

import { Router } from "express"
import { treinoController } from "./treinoController"

const router = Router()

// POST /treinos - cria treino
router.post("/", treinoController.create)

// GET /treinos/:id - busca por ID
router.get("/:id", treinoController.getById)

// GET /treinos/atleta/:atletaId - busca por atleta
router.get("/atleta/:atletaId", treinoController.getByAtleta)

// GET /treinos - lista todos
router.get("/", treinoController.getAll)

export default router