import { Request, Response } from "express"
import { equipeMembroService } from "./equipeMembroService"

export const equipeMembroController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const membro = await equipeMembroService.create(req.body)
      return res.status(201).json(membro)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getByEquipe(req: Request, res: Response): Promise<Response> {
    try {
      const id_equipe = Number(req.params.id_equipe)
      return res.json(await equipeMembroService.getByEquipe(id_equipe))
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async getByUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id_usuario = Number(req.params.id_usuario)
      return res.json(await equipeMembroService.getByUsuario(id_usuario))
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id_equipe = Number(req.params.id_equipe)
      const id_usuario = Number(req.params.id_usuario)
      return res.json(await equipeMembroService.update(id_equipe, id_usuario, req.body))
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id_equipe = Number(req.params.id_equipe)
      const id_usuario = Number(req.params.id_usuario)
      await equipeMembroService.delete(id_equipe, id_usuario)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}
