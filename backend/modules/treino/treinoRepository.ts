// Repositório para treinos - acesso aos dados
// Gerencia registros de sessões de treino

import { Treino, CreateTreinoDTO } from "./treinoTypes"

let treinos: Treino[] = []

export const treinoRepository = {
  // Cria novo treino
  async create(data: CreateTreinoDTO): Promise<Treino> {
    const novoTreino: Treino = {
      id: treinos.length + 1,
      ...data
    }

    treinos.push(novoTreino)

    return Promise.resolve(novoTreino)
  },

  // Busca por ID
  async findById(id: number): Promise<Treino | undefined> {
    return Promise.resolve(treinos.find((t) => t.id === id))
  },

  // Busca treinos por atleta
  async findByAtleta(atletaId: number): Promise<Treino[]> {
    return Promise.resolve(treinos.filter((t) => t.atletaId === atletaId))
  },

  // Retorna todos os treinos
  async findAll(): Promise<Treino[]> {
    return Promise.resolve(treinos)
  }
}