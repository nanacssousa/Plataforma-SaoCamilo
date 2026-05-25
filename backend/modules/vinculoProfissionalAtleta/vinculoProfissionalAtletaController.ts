import { Request, Response } from "express"
import { vinculoProfissionalAtletaService } from "./vinculoProfissionalAtletaService"

export const vinculoProfissionalAtletaController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const vinculo = await vinculoProfissionalAtletaService.create(req.body)
      return res.status(201).json(vinculo)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await vinculoProfissionalAtletaService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getByNutricionista(req: Request, res: Response): Promise<Response> {
    try {
      const id_nutricionista = Number(req.params.id_nutricionista)
      return res.json(await vinculoProfissionalAtletaService.getByNutricionista(id_nutricionista))
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async getByAtleta(req: Request, res: Response): Promise<Response> {
    try {
      const id_atleta = Number(req.params.id_atleta)
      return res.json(await vinculoProfissionalAtletaService.getByAtleta(id_atleta))
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await vinculoProfissionalAtletaService.update(id, req.body))
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await vinculoProfissionalAtletaService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}
