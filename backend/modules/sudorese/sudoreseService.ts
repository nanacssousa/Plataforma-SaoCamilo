// Serviço para sudorese - lógica de negócio
// Validações e processamento das análises de sudorese

import { sudoreseRepository } from "./sudoreseRepository"
import { CreateSudoreseDTO, Sudorese } from "./sudoreseTypes"

export const sudoreseService = {
  // Cria análise com validações
  async create(data: CreateSudoreseDTO): Promise<Sudorese> {
    // Validação de campos obrigatórios
    if (!data.atletaId || !data.data || data.taxaSudoracao == null || data.perdaPeso == null) {
      throw new Error("Dados obrigatórios não informados")
    }

    return sudoreseRepository.create(data)
  },

  // Busca por ID
  async getById(id: number): Promise<Sudorese> {
    const sudorese = await sudoreseRepository.findById(id)

    if (!sudorese) {
      throw new Error("Análise de sudorese não encontrada")
    }

    return sudorese
  },

  // Busca análises por atleta
  async getByAtleta(atletaId: number): Promise<Sudorese[]> {
    return sudoreseRepository.findByAtleta(atletaId)
  },

  // Retorna todas
  async getAll(): Promise<Sudorese[]> {
    return sudoreseRepository.findAll()
  }
}