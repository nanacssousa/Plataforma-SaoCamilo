import { biomarcadorRepository } from "./biomarcadorRepository"
import { Biomarcador, CreateBiomarcadorDTO, UpdateBiomarcadorDTO } from "./biomarcadorTypes"

export const biomarcadorService = {
  async create(data: CreateBiomarcadorDTO): Promise<Biomarcador> {
    if (!data.nome || !data.unidade) {
      throw new Error("nome e unidade são obrigatórios")
    }

    return biomarcadorRepository.create(data)
  },

  async getById(id: number): Promise<Biomarcador> {
    const biomarcador = await biomarcadorRepository.findById(id)

    if (!biomarcador) {
      throw new Error("Biomarcador não encontrado")
    }

    return biomarcador
  },

  async getAll(): Promise<Biomarcador[]> {
    return biomarcadorRepository.findAll()
  },

  async update(id: number, data: UpdateBiomarcadorDTO): Promise<Biomarcador> {
    await this.getById(id)
    return biomarcadorRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return biomarcadorRepository.delete(id)
  }
}