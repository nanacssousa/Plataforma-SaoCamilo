// Rotas para nutricionistas - endpoints da API
// Define as URLs para operações com nutricionistas

import { Router } from "express"
import { nutriController } from "./nutriController"

const router = Router()

// POST /nutricionistas - cria nutricionista
router.post("/", nutriController.create)

// GET /nutricionistas/:id - busca por ID
router.get("/:id", nutriController.getById)

// GET /nutricionistas - lista todos
router.get("/", nutriController.getAll)

export default router