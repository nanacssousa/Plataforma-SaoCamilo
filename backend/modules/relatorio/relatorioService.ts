import { relatorioRepository } from "./relatorioRepository"
import { CreateRelatorioDTO, Relatorio, UpdateRelatorioDTO } from "./relatorioTypes"

export const relatorioService = {
  async create(data: CreateRelatorioDTO): Promise<Relatorio> {
    if (!data.id_solicitante || !data.id_atleta || !data.tipo_relatorio || !data.formato || !data.periodo_inicio || !data.periodo_fim) {
      throw new Error("id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio e periodo_fim são obrigatórios")
    }
    return relatorioRepository.create(data)
  },

  async getById(id: number): Promise<Relatorio> {
    const relatorio = await relatorioRepository.findById(id)
    if (!relatorio) { throw new Error("Relatório não encontrado") }
    return relatorio
  },

  async getByAtleta(id_atleta: number): Promise<Relatorio[]> {
    return relatorioRepository.findByAtleta(id_atleta)
  },

  async getBySolicitante(id_solicitante: number): Promise<Relatorio[]> {
    return relatorioRepository.findBySolicitante(id_solicitante)
  },

  async getAll(): Promise<Relatorio[]> {
    return relatorioRepository.findAll()
  },

  async update(id: number, data: UpdateRelatorioDTO): Promise<Relatorio> {
    await this.getById(id)
    return relatorioRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return relatorioRepository.delete(id)
  }
}