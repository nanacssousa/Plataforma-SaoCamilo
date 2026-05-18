import { Request, Response } from "express"
import { authService } from "./authService"

export const authController = {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const result = await authService.login(req.body)

      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      })
    }
  },

  async cadastrar(req: Request, res: Response): Promise<Response> {
    try {
      const result = await authService.cadastrar(req.body)

      return res.status(201).json(result)
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      })
    }
  }
}