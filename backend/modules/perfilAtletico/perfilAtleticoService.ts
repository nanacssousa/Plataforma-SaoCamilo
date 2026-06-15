import { perfilAtleticoRepository } from "./perfilAtleticoRepository"
import { CreatePerfilAtleticoDTO, PerfilAtletico, UpdatePerfilAtleticoDTO } from "./perfilAtleticoTypes"

export const perfilAtleticoService = {
  async create(data: CreatePerfilAtleticoDTO): Promise<PerfilAtletico> {
    if (!data.id_usuario || !data.modalidade) {
      throw new Error("id_usuario e modalidade são obrigatórios")
    }

    return perfilAtleticoRepository.create(data)
  },

  async getById(id: number): Promise<PerfilAtletico> {
    const perfil = await perfilAtleticoRepository.findById(id)

    if (!perfil) {
      throw new Error("Perfil atlético não encontrado")
    }

    return perfil
  },

  async getByUsuario(id_usuario: number): Promise<PerfilAtletico> {
    const perfil = await perfilAtleticoRepository.findByUsuario(id_usuario)

    if (!perfil) {
      throw new Error("Perfil atlético não encontrado")
    }

    return perfil
  },

  async getAll(): Promise<PerfilAtletico[]> {
    return perfilAtleticoRepository.findAll()
  },

  async update(id: number, data: UpdatePerfilAtleticoDTO): Promise<PerfilAtletico> {
    await this.getById(id)
    return perfilAtleticoRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return perfilAtleticoRepository.delete(id)
  },

  async getAllComDados(): Promise<any[]> {
    return perfilAtleticoRepository.findAllComDados()
  }
}
