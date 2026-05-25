import { calculoHidratacaoRepository } from "./calculoHidratacaoRepository"
import { CalculoHidratacao, CreateCalculoHidratacaoDTO, UpdateCalculoHidratacaoDTO } from "./calculoHidratacaoTypes"

export const calculoHidratacaoService = {
  async create(data: CreateCalculoHidratacaoDTO): Promise<CalculoHidratacao> {
    if (!data.id_sessao || !data.nivel_desidratacao) {
      throw new Error("id_sessao e nivel_desidratacao são obrigatórios")
    }

    return calculoHidratacaoRepository.create(data)
  },

  async getById(id: number): Promise<CalculoHidratacao> {
    const calculo = await calculoHidratacaoRepository.findById(id)

    if (!calculo) {
      throw new Error("Cálculo de hidratação não encontrado")
    }

    return calculo
  },

  async getBySessao(id_sessao: number): Promise<CalculoHidratacao> {
    const calculo = await calculoHidratacaoRepository.findBySessao(id_sessao)

    if (!calculo) {
      throw new Error("Cálculo de hidratação não encontrado")
    }

    return calculo
  },

  async getAll(): Promise<CalculoHidratacao[]> {
    return calculoHidratacaoRepository.findAll()
  },

  async update(id: number, data: UpdateCalculoHidratacaoDTO): Promise<CalculoHidratacao> {
    await this.getById(id)
    return calculoHidratacaoRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return calculoHidratacaoRepository.delete(id)
  }
}
