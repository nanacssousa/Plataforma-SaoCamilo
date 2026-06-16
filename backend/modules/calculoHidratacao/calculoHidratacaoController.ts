import { Request, Response } from "express"
import { calculoHidratacaoService } from "./Calculohidratacaoservice"

export const calculoHidratacaoController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const calculo = await calculoHidratacaoService.create(req.body)
      return res.status(201).json(calculo)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await calculoHidratacaoService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getBySessao(req: Request, res: Response): Promise<Response> {
    try {
      const id_sessao = Number(req.params.id_sessao)
      return res.json(await calculoHidratacaoService.getBySessao(id_sessao))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async getByUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const id_usuario = Number(req.params.id_usuario)
      const limit = req.query.limit ? Number(req.query.limit) : undefined
      return res.json(await calculoHidratacaoService.getByUsuario(id_usuario, limit))
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async calcularPorSessao(req: Request, res: Response): Promise<Response> {
    try {
      const id_sessao = Number(req.params.id_sessao)
      if (isNaN(id_sessao)) return res.status(400).json({ error: "id_sessao inválido" })
      const calculo = await calculoHidratacaoService.calcularPorSessao(id_sessao)
      return res.status(201).json(calculo)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(await calculoHidratacaoService.getAll())
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await calculoHidratacaoService.update(id, req.body))
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await calculoHidratacaoService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}