// Repositório para análises de sudorese
// Gerencia dados das medições de suor

import { Sudorese, CreateSudoreseDTO } from "./sudoreseTypes"

let sudoreses: Sudorese[] = []

export const sudoreseRepository = {
  // Cria nova análise
  async create(data: CreateSudoreseDTO): Promise<Sudorese> {
    const novaSudorese: Sudorese = {
      id: sudoreses.length + 1,
      ...data
    }

    sudoreses.push(novaSudorese)

    return Promise.resolve(novaSudorese)
  },

  // Busca por ID
  async findById(id: number): Promise<Sudorese | undefined> {
    return Promise.resolve(sudoreses.find((s) => s.id === id))
  },

  // Busca todas as análises de um atleta
  async findByAtleta(atletaId: number): Promise<Sudorese[]> {
    return Promise.resolve(sudoreses.filter((s) => s.atletaId === atletaId))
  },

  // Retorna todas as análises
  async findAll(): Promise<Sudorese[]> {
    return Promise.resolve(sudoreses)
  }
}