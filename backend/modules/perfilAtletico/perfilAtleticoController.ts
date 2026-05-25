import { Request, Response } from "express"
import { perfilAtleticoService } from "./perfilAtleticoService"

export const perfilAtleticoController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const perfil = await perfilAtleticoService.create(req.body)
      return res.status(201).json(perfil)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await perfilAtleticoService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getByUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id_usuario = Number(req.params.id_usuario)
      return res.json(await perfilAtleticoService.getByUsuario(id_usuario))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(await perfilAtleticoService.getAll())
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await perfilAtleticoService.update(id, req.body))
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await perfilAtleticoService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}
