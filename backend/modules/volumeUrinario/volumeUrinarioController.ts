import { Request, Response } from "express"
import { volumeUrinarioService } from "./volumeUrinarioService"

export const volumeUrinarioController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const volume = await volumeUrinarioService.create(req.body)
      return res.status(201).json(volume)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await volumeUrinarioService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getBySessao(req: Request, res: Response): Promise<Response> {
    try {
      const id_sessao = Number(req.params.id_sessao)
      return res.json(await volumeUrinarioService.getBySessao(id_sessao))
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(await volumeUrinarioService.getAll())
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await volumeUrinarioService.update(id, req.body))
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await volumeUrinarioService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}
