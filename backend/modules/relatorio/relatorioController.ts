import { Request, Response } from "express";
import { gerarPdfPainel } from "./relatorioPdf";
import { relatorioService } from "./relatorioService";

export const relatorioController = {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const relatorio = await relatorioService.create(req.body);
      return res.status(201).json(relatorio);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      return res.json(await relatorioService.getById(id));
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  async getByAtleta(req: Request, res: Response): Promise<Response> {
    try {
      const id_atleta = Number(req.params.id_atleta);
      return res.json(await relatorioService.getByAtleta(id_atleta));
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  async getBySolicitante(req: Request, res: Response): Promise<Response> {
    try {
      const id_solicitante = Number(req.params.id_solicitante);
      return res.json(await relatorioService.getBySolicitante(id_solicitante));
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  async getByEquipe(req: Request, res: Response): Promise<Response> {
    try {
      const id_equipe = Number(req.params.id_equipe);
      return res.json(await relatorioService.getByEquipe(id_equipe));
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(await relatorioService.getAll());
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      return res.json(await relatorioService.update(id, req.body));
    } catch (error: any) {
      const status = error.message === "Relatório não encontrado" ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      await relatorioService.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

async gerarPdfPainel(req: Request, res: Response): Promise<Response> {
  try {
    const hoje = new Date()
    const seteDiasAtras = new Date(hoje)
    seteDiasAtras.setDate(hoje.getDate() - 7)

    const periodoInicio = (req.query.inicio as string) ?? seteDiasAtras.toISOString().split("T")[0]
    const periodoFim = (req.query.fim as string) ?? hoje.toISOString().split("T")[0]

    // -------------------------------------------------------
    // DADOS MOCKADOS — remover quando conectar ao banco
    // -------------------------------------------------------
    const atletas = [
      { id: "1", nome: "Gabriel Mendonça", posicao: "Volante", categoria: "Sub-20", massaAtual: 78.4, deltaMassa: -2.8, usg: 1.026, statusHidrico: "desidratado" as const },
      { id: "2", nome: "Julia Santos", posicao: "Ala", categoria: "Principal", massaAtual: 64.2, deltaMassa: 0.3, usg: 1.012, statusHidrico: "hidratado" as const },
      { id: "3", nome: "Ricardo Lima", posicao: "Lateral", categoria: "Sub-20", massaAtual: 82.1, deltaMassa: -1.1, usg: 1.021, statusHidrico: "alerta_leve" as const },
    ]

    const sugestoes = [
      { id: "1", tipo: "emergencial" as const, titulo: "Protocolo Emergencial: Gabriel M.", descricao: "Reposição de 1.200ml de solução isotônica (6% carb) em 90 min." },
      { id: "2", tipo: "ajuste" as const, titulo: "Ajuste de Sódio: Equipe A", descricao: "Aumentar oferta de eletrólitos pré-treino devido à alta umidade prevista." },
    ]
    // -------------------------------------------------------
    // SUBSTITUIR ACIMA POR ISTO quando conectar ao banco(de preferencia esse metodo em questao
    //  deve estar em relatorioService, e essa funcao aqui chama-lo, 
    // ver exemplo de da pasta backend -> modules -> equipe <-):
    //
    // const idEquipe = Number(req.query.equipe_id) // passar via query ?equipe_id=1
    //
    // const atletasRaw = await relatorioRepository.findAtletasPainelByEquipe(idEquipe, periodoInicio, periodoFim)
    // const atletas = atletasRaw.map((a) => ({
    //   id: String(a.id),
    //   nome: a.nome,
    //   posicao: a.posicao ?? "Atleta",
    //   categoria: a.categoria ?? "PRINCIPAL",
    //   massaAtual: Number(a.massaAtual ?? 0),
    //   deltaMassa: Number(a.deltaMassa ?? 0),
    //   usg: Number(a.usg ?? 1.020),
    //   statusHidrico: (a.statusHidrico ?? "hidratado") as "desidratado" | "hidratado" | "alerta_leve",
    // }))
    //
    // const sugestoes = await relatorioRepository.findSugestoesByEquipe(idEquipe)
    // -------------------------------------------------------

    const pdfBuffer = await gerarPdfPainel(periodoInicio, periodoFim, atletas, sugestoes)

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="painel_nutricional.pdf"`,
      "Content-Length": String(pdfBuffer.length),
    })
    return res.end(pdfBuffer)
  } catch (error: any) {
    console.error("[gerarPdfPainel] erro:", error)
    return res.status(500).json({ error: error.message })
  }
}
};


