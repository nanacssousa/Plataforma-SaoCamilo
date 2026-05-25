import { Request, Response } from "express"
import { logAuditoriaService } from "./logAuditoriaService"

export const logAuditoriaController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const log = await logAuditoriaService.create(req.body)
      return res.status(201).json(log)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await logAuditoriaService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getByUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id_usuario = Number(req.params.id_usuario)
      return res.json(await logAuditoriaService.getByUsuario(id_usuario))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(await logAuditoriaService.getAll())
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await logAuditoriaService.update(id, req.body))
    } catch (error: any) {
      const status = error.message === "Log não encontrado" ? 404 : 400
      return res.status(status).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await logAuditoriaService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}