import { Request, Response } from "express"
import { relatorioService } from "./relatorioService"

export const relatorioController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const relatorio = await relatorioService.create(req.body)
      return res.status(201).json(relatorio)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await relatorioService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getByAtleta(req: Request, res: Response): Promise<Response> {
    try {
      const id_atleta = Number(req.params.id_atleta)
      return res.json(await relatorioService.getByAtleta(id_atleta))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getBySolicitante(req: Request, res: Response): Promise<Response> {
    try {
      const id_solicitante = Number(req.params.id_solicitante)
      return res.json(await relatorioService.getBySolicitante(id_solicitante))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(await relatorioService.getAll())
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await relatorioService.update(id, req.body))
    } catch (error: any) {
      const status = error.message === "Relatório não encontrado" ? 404 : 400
      return res.status(status).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await relatorioService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}