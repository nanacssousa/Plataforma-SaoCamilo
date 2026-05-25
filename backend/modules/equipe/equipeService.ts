import { equipeRepository } from "./equipeRepository"
import { CreateEquipeDTO, Equipe, UpdateEquipeDTO } from "./equipeTypes"

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
  }
}
