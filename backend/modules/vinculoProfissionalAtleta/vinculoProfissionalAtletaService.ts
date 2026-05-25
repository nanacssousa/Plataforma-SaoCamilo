import { vinculoProfissionalAtletaRepository } from "./vinculoProfissionalAtletaRepository"
import { CreateVinculoProfissionalAtletaDTO, UpdateVinculoProfissionalAtletaDTO, VinculoProfissionalAtleta } from "./vinculoProfissionalAtletaTypes"

export const vinculoProfissionalAtletaService = {
  async create(data: CreateVinculoProfissionalAtletaDTO): Promise<VinculoProfissionalAtleta> {
    if (!data.id_nutricionista || !data.id_atleta) {
      throw new Error("id_nutricionista e id_atleta são obrigatórios")
    }

    return vinculoProfissionalAtletaRepository.create(data)
  },

  async getById(id: number): Promise<VinculoProfissionalAtleta> {
    const vinculo = await vinculoProfissionalAtletaRepository.findById(id)

    if (!vinculo) {
      throw new Error("Vínculo não encontrado")
    }

    return vinculo
  },

  async getByNutricionista(id_nutricionista: number): Promise<VinculoProfissionalAtleta[]> {
    return vinculoProfissionalAtletaRepository.findByNutricionista(id_nutricionista)
  },

  async getByAtleta(id_atleta: number): Promise<VinculoProfissionalAtleta[]> {
    return vinculoProfissionalAtletaRepository.findByAtleta(id_atleta)
  },

  async update(id: number, data: UpdateVinculoProfissionalAtletaDTO): Promise<VinculoProfissionalAtleta> {
    await this.getById(id)
    return vinculoProfissionalAtletaRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return vinculoProfissionalAtletaRepository.delete(id)
  }
}
