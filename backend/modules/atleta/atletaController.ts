// Controlador para atletas - manipula requisições HTTP
// Recebe as requisições, chama o serviço apropriado e retorna respostas

import { Request, Response } from "express"
import { atletaService } from "./atletaService"

export const atletaController = {
  // Cria um novo atleta
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const atleta = await atletaService.create(req.body)

      return res.status(201).json(atleta)
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      })
    }
  },

  // Busca atleta por ID
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)

      const atleta = await atletaService.getById(id)

      return res.json(atleta)
    } catch (err: any) {
      return res.status(404).json({
        error: err.message
      })
    }
  },

  // Retorna todos os atletas
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const atletas = await atletaService.getAll()

      return res.json(atletas)
    } catch (err: any) {
      return res.status(500).json({
        error: err.message
      })
    }
  }
}