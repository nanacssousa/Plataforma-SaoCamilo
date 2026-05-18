// Controlador para sudorese - handlers HTTP
// Processa requisições relacionadas às análises de sudorese

import { Request, Response } from "express"
import { sudoreseService } from "./sudoreseService"

export const sudoreseController = {
  // Cria análise
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const sudorese = await sudoreseService.create(req.body)

      return res.status(201).json(sudorese)
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

      const sudorese = await sudoreseService.getById(id)

      return res.json(sudorese)
    } catch (err: any) {
      return res.status(404).json({
        error: err.message
      })
    }
  },

  // Busca análises por atleta
  async getByAtleta(req: Request, res: Response): Promise<Response> {
    try {
      const atletaId = Number(req.params.atletaId)

      const sudoreses = await sudoreseService.getByAtleta(atletaId)

      return res.json(sudoreses)
    } catch (err: any) {
      return res.status(500).json({
        error: err.message
      })
    }
  },

  // Retorna todas
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const sudoreses = await sudoreseService.getAll()

      return res.json(sudoreses)
    } catch (err: any) {
      return res.status(500).json({
        error: err.message
      })
    }
  }
}