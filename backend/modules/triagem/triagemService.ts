import { triagemRepository } from "./triagemRepository"
import { CreateTriagemDTO, Triagem, UpdateTriagemDTO } from "./triagemTypes"

export const triagemService = {
  async create(data: CreateTriagemDTO): Promise<Triagem> {
    if (!data.id_sessao) {
      throw new Error("id_sessao é obrigatório")
    }

    return triagemRepository.create(data)
  },

  async getById(id: number): Promise<Triagem> {
    const triagem = await triagemRepository.findById(id)

    if (!triagem) {
      throw new Error("Triagem não encontrada")
    }

    return triagem
  },

  async getBySessao(id_sessao: number): Promise<Triagem> {
    const triagem = await triagemRepository.findBySessao(id_sessao)

    if (!triagem) {
      throw new Error("Triagem não encontrada")
    }

    return triagem
  },

  async getAll(): Promise<Triagem[]> {
    return triagemRepository.findAll()
  },

  async update(id: number, data: UpdateTriagemDTO): Promise<Triagem> {
    await this.getById(id)
    return triagemRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return triagemRepository.delete(id)
  }
}
