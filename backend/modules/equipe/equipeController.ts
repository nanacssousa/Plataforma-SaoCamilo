import { Request, Response } from "express"
import { equipeService } from "./equipeService"

export const equipeController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const equipe = await equipeService.create(req.body)
      return res.status(201).json(equipe)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await equipeService.getById(id))
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },


  async getAtletasByEquipe(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await equipeService.getAtletasByEquipe(id))
    } catch (error: any) {
      const status = error.message === "Equipe não encontrada" ? 404 : 500
      return res.status(status).json({ error: error.message })
    }
  },


  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(await equipeService.getAll())
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      return res.json(await equipeService.update(id, req.body))
    } catch (error: any) {
      const status = error.message === "Equipe não encontrada" ? 404 : 400
      return res.status(status).json({ error: error.message })
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id)
      await equipeService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ error: error.message })
    }
  },

  async gerarPdf(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id)
    console.log(`[equipeController] gerarPdf request id=${id}`, { query: req.query })

    try {
      const hoje = new Date()
      const seteDiasAtras = new Date(hoje)
      seteDiasAtras.setDate(hoje.getDate() - 7)

      const periodoInicio = (req.query.inicio as string) ?? seteDiasAtras.toISOString().split("T")[0]
      const periodoFim = (req.query.fim as string) ?? hoje.toISOString().split("T")[0]

      const pdfBuffer = await equipeService.gerarPdf(id, periodoInicio, periodoFim)

      console.log(
        `[equipeController] gerarPdf sucesso id=${id} tamanho=${pdfBuffer.length}`,
      )

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="relatorio_equipe_${id}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      })
      res.end(pdfBuffer)
      return res
    } catch (error: any) {
      console.error(`[equipeController] gerarPdf erro id=${id}`, error)
      return res.status(500).json({
        error: error.message ?? "Erro interno ao gerar PDF",
      })
    }
  }
}
