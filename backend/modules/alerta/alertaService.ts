import { alertaRepository } from "./alertaRepository"
import { Alerta, CreateAlertaDTO, UpdateAlertaDTO } from "./alertaTypes"

export const alertaService = {
  async create(data: CreateAlertaDTO): Promise<Alerta> {
    if (!data.id_usuario || !data.tipo_alerta || !data.mensagem) {
      throw new Error("id_usuario, tipo_alerta e mensagem são obrigatórios")
    }

    return alertaRepository.create(data)
  },

  async getById(id: number): Promise<Alerta> {
    const alerta = await alertaRepository.findById(id)

    if (!alerta) {
      throw new Error("Alerta não encontrado")
    }

    return alerta
  },

  async getByUsuario(id_usuario: number): Promise<Alerta[]> {
    return alertaRepository.findByUsuario(id_usuario)
  },

  async getAll(): Promise<Alerta[]> {
    return alertaRepository.findAll()
  },

  async update(id: number, data: UpdateAlertaDTO): Promise<Alerta> {
    await this.getById(id)
    return alertaRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return alertaRepository.delete(id)
  }
}
