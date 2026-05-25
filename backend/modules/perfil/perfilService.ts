import { perfilRepository } from "./perfilRepository"
import { CreatePerfilDTO, Perfil, UpdatePerfilDTO } from "./perfilTypes"

export const perfilService = {
  async create(data: CreatePerfilDTO): Promise<Perfil> {
    if (!data.nome || !data.descricao) {
      throw new Error("Nome e descrição são obrigatórios")
    }

    return perfilRepository.create(data)
  },

  async getById(id: number): Promise<Perfil> {
    const perfil = await perfilRepository.findById(id)

    if (!perfil) {
      throw new Error("Perfil não encontrado")
    }

    return perfil
  },

  async getAll(): Promise<Perfil[]> {
    return perfilRepository.findAll()
  },

  async update(id: number, data: UpdatePerfilDTO): Promise<Perfil> {
    await this.getById(id)
    return perfilRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return perfilRepository.delete(id)
  }
}
