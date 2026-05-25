import { pesagemRepository } from "./pesagemRepository"
import { CreatePesagemDTO, Pesagem, UpdatePesagemDTO } from "./pesagemTypes"

export const pesagemService = {
  async create(data: CreatePesagemDTO): Promise<Pesagem> {
    if (!data.id_sessao || !data.momento || !data.massa_kg) {
      throw new Error("id_sessao, momento e massa_kg são obrigatórios")
    }

    return pesagemRepository.create(data)
  },

  async getById(id: number): Promise<Pesagem> {
    const pesagem = await pesagemRepository.findById(id)

    if (!pesagem) {
      throw new Error("Pesagem não encontrada")
    }

    return pesagem
  },

  async getBySessao(id_sessao: number): Promise<Pesagem[]> {
    return pesagemRepository.findBySessao(id_sessao)
  },

  async getAll(): Promise<Pesagem[]> {
    return pesagemRepository.findAll()
  },

  async update(id: number, data: UpdatePesagemDTO): Promise<Pesagem> {
    await this.getById(id)
    return pesagemRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return pesagemRepository.delete(id)
  }
}
