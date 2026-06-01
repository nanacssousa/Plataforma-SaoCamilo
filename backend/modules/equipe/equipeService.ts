import { gerarPdfEquipe } from "./equipePDF"
import { equipeRepository } from "./equipeRepository"
import { CreateEquipeDTO, Equipe, EquipeAtleta, UpdateEquipeDTO } from "./equipeTypes"

export const equipeService = {
  async create(data: CreateEquipeDTO): Promise<Equipe> {
    if (!data.nome) {
      throw new Error("Nome é obrigatório")
    }

    return equipeRepository.create(data)
  },

  async getById(id: number): Promise<Equipe> {
    const equipe = await equipeRepository.findById(id)

    if (!equipe) {
      throw new Error("Equipe não encontrada")
    }

    return equipe
  },

  async getAtletasByEquipe(id: number): Promise<EquipeAtleta[]> {
    await this.getById(id)
    return equipeRepository.findAtletasByEquipe(id)
  },

  async getAll(): Promise<Equipe[]> {
    return equipeRepository.findAll()
  },

  async update(id: number, data: UpdateEquipeDTO): Promise<Equipe> {
    await this.getById(id)
    return equipeRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return equipeRepository.delete(id)
  },

 async gerarPdf(id: number, periodoInicio: string, periodoFim: string): Promise<Buffer> {
  const equipe = await this.getById(id)
  const atletasRaw = await equipeRepository.findAtletasByEquipe(id)

  const atletas: EquipeAtleta[] = atletasRaw.map((a: any) => ({
    id: Number(a.id),
    nome: a.nome,
    posicao: a.posicao ?? "Atleta",
    categoria: a.categoria ?? "PRINCIPAL",
    massaAtual: Number(a.massaAtual ?? a.massa_atual ?? 0),
    deltaMassa: Number(a.deltaMassa ?? a.delta_massa ?? 0),
    usg: a.usg !== undefined && a.usg !== null ? Number(a.usg) : NaN,
    statusHidrico: (a.statusHidrico as any) ?? "hidratado",
  }))

  return gerarPdfEquipe(equipe, atletas, periodoInicio, periodoFim)
},


}
