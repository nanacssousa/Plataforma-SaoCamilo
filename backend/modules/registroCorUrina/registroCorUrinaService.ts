import { registroCorUrinaRepository } from "./registroCorUrinaRepository"
import { CreateRegistroCorUrinaDTO, RegistroCorUrina, UpdateRegistroCorUrinaDTO } from "./registroCorUrinaTypes"

export const registroCorUrinaService = {
  async create(data: CreateRegistroCorUrinaDTO): Promise<RegistroCorUrina> {
    if (!data.id_sessao || !data.momento || data.escala_cor === undefined) {
      throw new Error("id_sessao, momento e escala_cor são obrigatórios")
    }

    return registroCorUrinaRepository.create(data)
  },

  async getById(id: number): Promise<RegistroCorUrina> {
    const registro = await registroCorUrinaRepository.findById(id)

    if (!registro) {
      throw new Error("Registro de cor da urina não encontrado")
    }

    return registro
  },

  async getBySessao(id_sessao: number): Promise<RegistroCorUrina[]> {
    return registroCorUrinaRepository.findBySessao(id_sessao)
  },

  async getAll(): Promise<RegistroCorUrina[]> {
    return registroCorUrinaRepository.findAll()
  },

  async update(id: number, data: UpdateRegistroCorUrinaDTO): Promise<RegistroCorUrina> {
    await this.getById(id)
    return registroCorUrinaRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return registroCorUrinaRepository.delete(id)
  }
}
