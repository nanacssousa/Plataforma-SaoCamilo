import { Request, Response } from "express"
import { perfilService } from "./perfilService"

export const perfilController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const perfil = await perfilService.create(req.body)
      return res.status(201).json(perfil)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      const perfil = await perfilService.getById(id)
      return res.json(perfil)
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const perfis = await perfilService.getAll()
      return res.json(perfis)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      const perfil = await perfilService.update(id, req.body)
      return res.json(perfil)
    } catch (error: any) {
      const status = error.message === "Perfil não encontrado" ? 404 : 400
      return res.status(status).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await perfilService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}
