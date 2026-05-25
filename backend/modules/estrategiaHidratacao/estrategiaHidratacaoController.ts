import { Request, Response } from "express"
import { estrategiaHidratacaoService } from "./estrategiaHidratacaoService"

export const estrategiaHidratacaoController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const estrategia = await estrategiaHidratacaoService.create(req.body)
      return res.status(201).json(estrategia)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await estrategiaHidratacaoService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getByAtleta(req: Request, res: Response): Promise<Response> {
    try {
      const id_atleta = Number(req.params.id_atleta)
      return res.json(await estrategiaHidratacaoService.getByAtleta(id_atleta))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getByNutricionista(req: Request, res: Response): Promise<Response> {
    try {
      const id_nutricionista = Number(req.params.id_nutricionista)
      return res.json(await estrategiaHidratacaoService.getByNutricionista(id_nutricionista))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(await estrategiaHidratacaoService.getAll())
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await estrategiaHidratacaoService.update(id, req.body))
    } catch (error: any) {
      const status = error.message === "Estratégia não encontrada" ? 404 : 400
      return res.status(status).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await estrategiaHidratacaoService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}