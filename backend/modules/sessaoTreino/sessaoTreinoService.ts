import { sessaoTreinoRepository } from "./sessaoTreinoRepository"
import { CreateSessaoTreinoDTO, SessaoTreino, UpdateSessaoTreinoDTO } from "./sessaoTreinoTypes"

export const sessaoTreinoService = {
  async create(data: CreateSessaoTreinoDTO): Promise<SessaoTreino> {
    if (!data.id_usuario || !data.id_tipo_exercicio || !data.data_treino || !data.hora_inicio) {
      throw new Error("id_usuario, id_tipo_exercicio, data_treino e hora_inicio são obrigatórios")
    }

    return sessaoTreinoRepository.create(data)
  },

  async getById(id: number): Promise<SessaoTreino> {
    const sessao = await sessaoTreinoRepository.findById(id)

    if (!sessao) {
      throw new Error("Sessão de treino não encontrada")
    }

    return sessao
  },

  async getByUsuario(id_usuario: number): Promise<SessaoTreino[]> {
    return sessaoTreinoRepository.findByUsuario(id_usuario)
  },

  async getAll(): Promise<SessaoTreino[]> {
    return sessaoTreinoRepository.findAll()
  },

  async update(id: number, data: UpdateSessaoTreinoDTO): Promise<SessaoTreino> {
    await this.getById(id)
    return sessaoTreinoRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return sessaoTreinoRepository.delete(id)
  }
}
