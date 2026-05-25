import { Request, Response } from "express"
import { sessaoAutenticacaoService } from "./sessaoAutenticacaoService"

export const sessaoAutenticacaoController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const sessao = await sessaoAutenticacaoService.create(req.body)
      return res.status(201).json(sessao)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await sessaoAutenticacaoService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getByUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id_usuario = Number(req.params.id_usuario)
      return res.json(await sessaoAutenticacaoService.getByUsuario(id_usuario))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getActiveByUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id_usuario = Number(req.params.id_usuario)
      return res.json(await sessaoAutenticacaoService.getActiveByUsuario(id_usuario))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(await sessaoAutenticacaoService.getAll())
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await sessaoAutenticacaoService.update(id, req.body))
    } catch (error: any) {
      const status = error.message === "Sessão não encontrada" ? 404 : 400
      return res.status(status).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await sessaoAutenticacaoService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}