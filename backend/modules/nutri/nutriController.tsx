// Controlador para nutricionistas - handlers HTTP
// Processa requisições e chama serviços apropriados

import { Request, Response } from "express"
import { nutriService } from "./nutriService"

export const nutriController = {
  // Cria nutricionista
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const nutricionista = await nutriService.create(req.body)

      return res.status(201).json(nutricionista)
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

      const nutricionista = await nutriService.getById(id)

      return res.json(nutricionista)
    } catch (err: any) {
      return res.status(404).json({
        error: err.message
      })
    }
  },

  // Retorna todos
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const nutricionistas = await nutriService.getAll()

      return res.json(nutricionistas)
    } catch (err: any) {
      return res.status(500).json({
        error: err.message
      })
    }
  }
}