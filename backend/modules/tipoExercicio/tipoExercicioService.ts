import { tipoExercicioRepository } from "./tipoExercicioRepository"
import { CreateTipoExercicioDTO, TipoExercicio, UpdateTipoExercicioDTO } from "./tipoExercicioTypes"

export const tipoExercicioService = {
  async create(data: CreateTipoExercicioDTO): Promise<TipoExercicio> {
    if (!data.nome) {
      throw new Error("Nome é obrigatório")
    }

    return tipoExercicioRepository.create(data)
  },

  async getById(id: number): Promise<TipoExercicio> {
    const tipo = await tipoExercicioRepository.findById(id)

    if (!tipo) {
      throw new Error("Tipo de exercício não encontrado")
    }

    return tipo
  },

  async getAll(): Promise<TipoExercicio[]> {
    return tipoExercicioRepository.findAll()
  },

  async update(id: number, data: UpdateTipoExercicioDTO): Promise<TipoExercicio> {
    await this.getById(id)
    return tipoExercicioRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return tipoExercicioRepository.delete(id)
  }
}
