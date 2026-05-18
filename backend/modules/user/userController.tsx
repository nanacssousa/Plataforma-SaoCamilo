import { Request, Response } from "express"
import { userService } from "./userService"

export const userController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const user = await userService.create(req.body)

      return res.status(201).json(user)
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)

      const user = await userService.getById(id)

      return res.json(user)
    } catch (err: any) {
      return res.status(404).json({
        error: err.message
      })
    }
  }
}