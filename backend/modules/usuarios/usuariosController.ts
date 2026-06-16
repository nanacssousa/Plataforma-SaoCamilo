import { Request, Response } from "express";
import { usuariosService } from "./usuariosService";

export const usuariosController = {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      console.log("[REGISTER] body recebido:", JSON.stringify(req.body));
      const result = await usuariosService.register(req.body)
      return res.status(201).json(result)
    } catch (error: any) {
      console.error("[REGISTER] erro:", error?.message, error?.code, error?.sqlMessage ?? "");
      return res.status(400).json({ error: error?.message || error?.sqlMessage || String(error) || "Erro interno" })
    }
  },

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const result = await usuariosService.login(req.body)

      return res.json(result)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const idPerfilRaw = req.query.id_perfil as string | undefined
      const idPerfis = idPerfilRaw
        ? idPerfilRaw
            .split(",")
            .map((v) => Number(v.trim()))
            .filter((n) => !Number.isNaN(n))
        : undefined

      const usuarios = await usuariosService.getAll(idPerfis)

      return res.json(usuarios)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      const usuario = await usuariosService.getById(id)

      return res.json(usuario)
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      const usuario = await usuariosService.update(id, req.body)

      return res.json(usuario)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await usuariosService.delete(id)

      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  }
}