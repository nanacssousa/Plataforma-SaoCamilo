// Serviço para nutricionistas - lógica de negócio
// Validações e regras específicas para nutricionistas

import { nutriRepository } from "./nutriRepository"
import { CreateNutricionistaDTO, Nutricionista } from "./nutriTypes"

export const nutriService = {
  // Cria nutricionista com validações
  async create(data: CreateNutricionistaDTO): Promise<Nutricionista> {
    // Validação de campos obrigatórios
    if (!data.nome || !data.email || !data.crn || !data.especialidade) {
      throw new Error("Dados obrigatórios não informados")
    }

    // Verifica duplicidade de email
    const existe = await nutriRepository.findByEmail(data.email)

    if (existe) {
      throw new Error("Email já cadastrado")
    }

    return nutriRepository.create(data)
  },

  // Busca por ID
  async getById(id: number): Promise<Nutricionista> {
    const nutricionista = await nutriRepository.findById(id)

    if (!nutricionista) {
      throw new Error("Nutricionista não encontrado")
    }

    return nutricionista
  },

  // Retorna todos
  async getAll(): Promise<Nutricionista[]> {
    return nutriRepository.findAll()
  }
}