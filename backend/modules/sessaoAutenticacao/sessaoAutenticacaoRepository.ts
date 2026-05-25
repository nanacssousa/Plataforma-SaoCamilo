import { execute, runOne, runQuery } from "../../shared"
import { CreateSessaoAutenticacaoDTO, SessaoAutenticacao, UpdateSessaoAutenticacaoDTO } from "./sessaoAutenticacaoTypes"

export const sessaoAutenticacaoRepository = {
  async create(data: CreateSessaoAutenticacaoDTO): Promise<SessaoAutenticacao> {
    const result = await execute("INSERT INTO sessoes_autenticacao (id_usuario, token_hash, dispositivo, plataforma, ip_origem, criado_em, expira_em, revogado, revogado_em) VALUES (?, ?, ?, ?, ?, NOW(), ?, 0, NULL)", [data.id_usuario, data.token_hash, data.dispositivo ?? null, data.plataforma, data.ip_origem ?? null, data.expira_em])
    const created = await runOne<SessaoAutenticacao>("SELECT id_sessao_auth, id_usuario, token_hash, dispositivo, plataforma, ip_origem, criado_em, expira_em, revogado, revogado_em FROM sessoes_autenticacao WHERE id_sessao_auth = ?", [result.insertId])
    if (!created) { throw new Error("Não foi possível criar a sessão de autenticação") }
    return created
  },

  async findById(id: number): Promise<SessaoAutenticacao | undefined> {
    return runOne<SessaoAutenticacao>("SELECT id_sessao_auth, id_usuario, token_hash, dispositivo, plataforma, ip_origem, criado_em, expira_em, revogado, revogado_em FROM sessoes_autenticacao WHERE id_sessao_auth = ?", [id])
  },

  async findByUsuario(id_usuario: number): Promise<SessaoAutenticacao[]> {
    return runQuery<SessaoAutenticacao>("SELECT id_sessao_auth, id_usuario, token_hash, dispositivo, plataforma, ip_origem, criado_em, expira_em, revogado, revogado_em FROM sessoes_autenticacao WHERE id_usuario = ? ORDER BY criado_em DESC", [id_usuario])
  },

  async findActiveByUsuario(id_usuario: number): Promise<SessaoAutenticacao[]> {
    return runQuery<SessaoAutenticacao>("SELECT id_sessao_auth, id_usuario, token_hash, dispositivo, plataforma, ip_origem, criado_em, expira_em, revogado, revogado_em FROM sessoes_autenticacao WHERE id_usuario = ? AND revogado = 0 AND expira_em > NOW() ORDER BY criado_em DESC", [id_usuario])
  },

  async findAll(): Promise<SessaoAutenticacao[]> {
    return runQuery<SessaoAutenticacao>("SELECT id_sessao_auth, id_usuario, token_hash, dispositivo, plataforma, ip_origem, criado_em, expira_em, revogado, revogado_em FROM sessoes_autenticacao ORDER BY criado_em DESC")
  },

  async update(id: number, data: UpdateSessaoAutenticacaoDTO): Promise<SessaoAutenticacao> {
    const fields: string[] = []
    const values: unknown[] = []
    if (data.dispositivo !== undefined) { fields.push("dispositivo = ?"); values.push(data.dispositivo) }
    if (data.plataforma !== undefined) { fields.push("plataforma = ?"); values.push(data.plataforma) }
    if (data.ip_origem !== undefined) { fields.push("ip_origem = ?"); values.push(data.ip_origem) }
    if (data.expira_em !== undefined) { fields.push("expira_em = ?"); values.push(data.expira_em) }
    if (data.revogado !== undefined) { fields.push("revogado = ?"); values.push(data.revogado) }
    if (data.revogado_em !== undefined) { fields.push("revogado_em = ?"); values.push(data.revogado_em) }
    if (fields.length === 0) { throw new Error("Nenhum campo para atualizar") }
    values.push(id)
    await execute("UPDATE sessoes_autenticacao SET " + fields.join(", ") + " WHERE id_sessao_auth = ?", values)
    const updated = await this.findById(id)
    if (!updated) { throw new Error("Sessão não encontrada") }
    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM sessoes_autenticacao WHERE id_sessao_auth = ?", [id])
  }
}