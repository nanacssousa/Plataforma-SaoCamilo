import { sessaoAutenticacaoRepository } from "./sessaoAutenticacaoRepository"
import { CreateSessaoAutenticacaoDTO, SessaoAutenticacao, UpdateSessaoAutenticacaoDTO } from "./sessaoAutenticacaoTypes"

export const sessaoAutenticacaoService = {
  async create(data: CreateSessaoAutenticacaoDTO): Promise<SessaoAutenticacao> {
    if (!data.id_usuario || !data.token_hash || !data.plataforma || !data.expira_em) {
      throw new Error("id_usuario, token_hash, plataforma e expira_em são obrigatórios")
    }
    return sessaoAutenticacaoRepository.create(data)
  },

  async getById(id: number): Promise<SessaoAutenticacao> {
    const sessao = await sessaoAutenticacaoRepository.findById(id)
    if (!sessao) { throw new Error("Sessão não encontrada") }
    return sessao
  },

  async getByUsuario(id_usuario: number): Promise<SessaoAutenticacao[]> {
    return sessaoAutenticacaoRepository.findByUsuario(id_usuario)
  },

  async getActiveByUsuario(id_usuario: number): Promise<SessaoAutenticacao[]> {
    return sessaoAutenticacaoRepository.findActiveByUsuario(id_usuario)
  },

  async getAll(): Promise<SessaoAutenticacao[]> {
    return sessaoAutenticacaoRepository.findAll()
  },

  async update(id: number, data: UpdateSessaoAutenticacaoDTO): Promise<SessaoAutenticacao> {
    await this.getById(id)
    return sessaoAutenticacaoRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return sessaoAutenticacaoRepository.delete(id)
  }
}