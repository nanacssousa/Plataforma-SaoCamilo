import { Request, Response } from "express"
import { sessaoTreinoService } from "./sessaoTreinoService"

export const sessaoTreinoController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const sessao = await sessaoTreinoService.create(req.body)
      return res.status(201).json(sessao)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await sessaoTreinoService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getByUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id_usuario = Number(req.params.id_usuario)
      return res.json(await sessaoTreinoService.getByUsuario(id_usuario))
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const id_usuario = req.query.id_usuario ? Number(req.query.id_usuario) : undefined
      const limit = req.query.limit ? Number(req.query.limit) : undefined

      return res.json(await sessaoTreinoService.getAll({ id_usuario, limit }))
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await sessaoTreinoService.update(id, req.body))
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await sessaoTreinoService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}
