import { volumeUrinarioRepository } from "./volumeUrinarioRepository"
import { CreateVolumeUrinarioDTO, UpdateVolumeUrinarioDTO, VolumeUrinario } from "./volumeUrinarioTypes"

export const volumeUrinarioService = {
  async create(data: CreateVolumeUrinarioDTO): Promise<VolumeUrinario> {
    if (!data.id_sessao || data.volume_ml === undefined) {
      throw new Error("id_sessao e volume_ml são obrigatórios")
    }

    return volumeUrinarioRepository.create(data)
  },

  async getById(id: number): Promise<VolumeUrinario> {
    const volume = await volumeUrinarioRepository.findById(id)

    if (!volume) {
      throw new Error("Volume urinário não encontrado")
    }

    return volume
  },

  async getBySessao(id_sessao: number): Promise<VolumeUrinario[]> {
    return volumeUrinarioRepository.findBySessao(id_sessao)
  },

  async getAll(): Promise<VolumeUrinario[]> {
    return volumeUrinarioRepository.findAll()
  },

  async update(id: number, data: UpdateVolumeUrinarioDTO): Promise<VolumeUrinario> {
    await this.getById(id)
    return volumeUrinarioRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return volumeUrinarioRepository.delete(id)
  }
}
