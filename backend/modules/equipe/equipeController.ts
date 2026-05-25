import { Request, Response } from "express"
import { equipeService } from "./equipeService"

export const equipeController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const equipe = await equipeService.create(req.body)
      return res.status(201).json(equipe)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await equipeService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(await equipeService.getAll())
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await equipeService.update(id, req.body))
    } catch (error: any) {
      const status = error.message === "Equipe não encontrada" ? 404 : 400
      return res.status(status).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await equipeService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}
