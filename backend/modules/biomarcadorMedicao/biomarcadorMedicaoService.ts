import { biomarcadorMedicaoRepository } from "./biomarcadorMedicaoRepository"
import { BiomarcadorMedicao, CreateBiomarcadorMedicaoDTO, UpdateBiomarcadorMedicaoDTO } from "./biomarcadorMedicaoTypes"

export const biomarcadorMedicaoService = {
  async create(data: CreateBiomarcadorMedicaoDTO): Promise<BiomarcadorMedicao> {
    if (!data.id_usuario || !data.id_biomarcador || data.valor === undefined) {
      throw new Error("id_usuario, id_biomarcador e valor são obrigatórios")
    }

    return biomarcadorMedicaoRepository.create(data)
  },

  async getById(id: number): Promise<BiomarcadorMedicao> {
    const medicao = await biomarcadorMedicaoRepository.findById(id)
    if (!medicao) { throw new Error("Medição não encontrada") }
    return medicao
  },

  async getByUsuario(id_usuario: number): Promise<BiomarcadorMedicao[]> {
    return biomarcadorMedicaoRepository.findByUsuario(id_usuario)
  },

  async getAll(): Promise<BiomarcadorMedicao[]> {
    return biomarcadorMedicaoRepository.findAll()
  },

  async update(id: number, data: UpdateBiomarcadorMedicaoDTO): Promise<BiomarcadorMedicao> {
    await this.getById(id)
    return biomarcadorMedicaoRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return biomarcadorMedicaoRepository.delete(id)
  }
}