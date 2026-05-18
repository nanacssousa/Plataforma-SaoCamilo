// Repositório para nutricionistas - acesso aos dados
// Gerencia o armazenamento e recuperação de dados dos nutricionistas

import { Nutricionista, CreateNutricionistaDTO } from "./nutriTypes"

let nutricionistas: Nutricionista[] = []

export const nutriRepository = {
  // Cria um novo nutricionista
  async create(data: CreateNutricionistaDTO): Promise<Nutricionista> {
    const novoNutricionista: Nutricionista = {
      id: nutricionistas.length + 1,
      ...data
    }

    nutricionistas.push(novoNutricionista)

    return Promise.resolve(novoNutricionista)
  },

  // Busca por email
  async findByEmail(email: string): Promise<Nutricionista | undefined> {
    return Promise.resolve(nutricionistas.find((n) => n.email === email))
  },

  // Busca por ID
  async findById(id: number): Promise<Nutricionista | undefined> {
    return Promise.resolve(nutricionistas.find((n) => n.id === id))
  },

  // Retorna todos os nutricionistas
  async findAll(): Promise<Nutricionista[]> {
    return Promise.resolve(nutricionistas)
  }
}