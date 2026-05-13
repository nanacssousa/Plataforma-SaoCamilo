// Serviço para treinos - lógica de negócio
// Validações e regras para sessões de treino

import { treinoRepository } from "./treinoRepository"
import { CreateTreinoDTO, Treino } from "./treinoTypes"

export const treinoService = {
  // Cria treino com validações
  async create(data: CreateTreinoDTO): Promise<Treino> {
    // Validação de campos obrigatórios
    if (!data.atletaId || !data.data || !data.tipo || !data.duracao || !data.intensidade) {
      throw new Error("Dados obrigatórios não informados")
    }

    return treinoRepository.create(data)
  },

  // Busca por ID
  async getById(id: number): Promise<Treino> {
    const treino = await treinoRepository.findById(id)

    if (!treino) {
      throw new Error("Treino não encontrado")
    }

    return treino
  },

  // Busca treinos por atleta
  async getByAtleta(atletaId: number): Promise<Treino[]> {
    return treinoRepository.findByAtleta(atletaId)
  },

  // Retorna todos
  async getAll(): Promise<Treino[]> {
    return treinoRepository.findAll()
  }
}