import { Request, Response } from "express"
import { ingestaoFluidoService } from "./ingestaoFluidoService"

export const ingestaoFluidoController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const ingestao = await ingestaoFluidoService.create(req.body)
      return res.status(201).json(ingestao)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await ingestaoFluidoService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getBySessao(req: Request, res: Response): Promise<Response> {
    try {
      const id_sessao = Number(req.params.id_sessao)
      return res.json(await ingestaoFluidoService.getBySessao(id_sessao))
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(await ingestaoFluidoService.getAll())
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await ingestaoFluidoService.update(id, req.body))
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await ingestaoFluidoService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}
