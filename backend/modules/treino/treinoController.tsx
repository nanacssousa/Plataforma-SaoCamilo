// Controlador para treinos - handlers HTTP
// Processa requisições relacionadas aos treinos

import { Request, Response } from "express"
import { treinoService } from "./treinoService"

export const treinoController = {
  // Cria treino
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const treino = await treinoService.create(req.body)

      return res.status(201).json(treino)
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      })
    }
  },

  // Busca por ID
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)

      const treino = await treinoService.getById(id)

      return res.json(treino)
    } catch (err: any) {
      return res.status(404).json({
        error: err.message
      })
    }
  },

  // Busca treinos por atleta
  async getByAtleta(req: Request, res: Response): Promise<Response> {
    try {
      const atletaId = Number(req.params.atletaId)

      const treinos = await treinoService.getByAtleta(atletaId)

      return res.json(treinos)
    } catch (err: any) {
      return res.status(500).json({
        error: err.message
      })
    }
  },

  // Retorna todos
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const treinos = await treinoService.getAll()

      return res.json(treinos)
    } catch (err: any) {
      return res.status(500).json({
        error: err.message
      })
    }
  }
}