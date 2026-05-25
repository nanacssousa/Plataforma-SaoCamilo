import { ingestaoFluidoRepository } from "./ingestaoFluidoRepository"
import { CreateIngestaoFluidoDTO, IngestaoFluido, UpdateIngestaoFluidoDTO } from "./ingestaoFluidoTypes"

export const ingestaoFluidoService = {
  async create(data: CreateIngestaoFluidoDTO): Promise<IngestaoFluido> {
    if (!data.id_sessao || !data.momento || data.volume_ml === undefined) {
      throw new Error("id_sessao, momento e volume_ml são obrigatórios")
    }

    return ingestaoFluidoRepository.create(data)
  },

  async getById(id: number): Promise<IngestaoFluido> {
    const ingestao = await ingestaoFluidoRepository.findById(id)

    if (!ingestao) {
      throw new Error("Ingestão de fluido não encontrada")
    }

    return ingestao
  },

  async getBySessao(id_sessao: number): Promise<IngestaoFluido[]> {
    return ingestaoFluidoRepository.findBySessao(id_sessao)
  },

  async getAll(): Promise<IngestaoFluido[]> {
    return ingestaoFluidoRepository.findAll()
  },

  async update(id: number, data: UpdateIngestaoFluidoDTO): Promise<IngestaoFluido> {
    await this.getById(id)
    return ingestaoFluidoRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return ingestaoFluidoRepository.delete(id)
  }
}
