import { estrategiaHidratacaoRepository } from "./estrategiaHidratacaoRepository"
import { CreateEstrategiaHidratacaoDTO, EstrategiaHidratacao, UpdateEstrategiaHidratacaoDTO } from "./estrategiaHidratacaoTypes"

export const estrategiaHidratacaoService = {
  async create(data: CreateEstrategiaHidratacaoDTO): Promise<EstrategiaHidratacao> {
    if (!data.id_nutricionista || !data.id_atleta || !data.titulo || !data.descricao) {
      throw new Error("id_nutricionista, id_atleta, titulo e descricao são obrigatórios")
    }
    return estrategiaHidratacaoRepository.create(data)
  },

  async getById(id: number): Promise<EstrategiaHidratacao> {
    const estrategia = await estrategiaHidratacaoRepository.findById(id)
    if (!estrategia) { throw new Error("Estratégia não encontrada") }
    return estrategia
  },

  async getByAtleta(id_atleta: number): Promise<EstrategiaHidratacao[]> {
    return estrategiaHidratacaoRepository.findByAtleta(id_atleta)
  },

  async getByNutricionista(id_nutricionista: number): Promise<EstrategiaHidratacao[]> {
    return estrategiaHidratacaoRepository.findByNutricionista(id_nutricionista)
  },

  async getAll(): Promise<EstrategiaHidratacao[]> {
    return estrategiaHidratacaoRepository.findAll()
  },

  async update(id: number, data: UpdateEstrategiaHidratacaoDTO): Promise<EstrategiaHidratacao> {
    await this.getById(id)
    return estrategiaHidratacaoRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return estrategiaHidratacaoRepository.delete(id)
  }
}