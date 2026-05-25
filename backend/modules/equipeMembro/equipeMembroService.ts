import { equipeMembroRepository } from "./equipeMembroRepository"
import { CreateEquipeMembroDTO, EquipeMembro, UpdateEquipeMembroDTO } from "./equipeMembroTypes"

export const equipeMembroService = {
  async create(data: CreateEquipeMembroDTO): Promise<EquipeMembro> {
    if (!data.id_equipe || !data.id_usuario) {
      throw new Error("id_equipe e id_usuario são obrigatórios")
    }

    return equipeMembroRepository.create(data)
  },

  async getByEquipe(id_equipe: number): Promise<EquipeMembro[]> {
    return equipeMembroRepository.findByEquipe(id_equipe)
  },

  async getByUsuario(id_usuario: number): Promise<EquipeMembro[]> {
    return equipeMembroRepository.findByUsuario(id_usuario)
  },

  async update(id_equipe: number, id_usuario: number, data: UpdateEquipeMembroDTO): Promise<EquipeMembro> {
    return equipeMembroRepository.update(id_equipe, id_usuario, data)
  },

  async delete(id_equipe: number, id_usuario: number): Promise<void> {
    return equipeMembroRepository.delete(id_equipe, id_usuario)
  }
}
