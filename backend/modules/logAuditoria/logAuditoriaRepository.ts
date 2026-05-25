import { execute, runOne, runQuery } from "../../shared"
import { CreateLogAuditoriaDTO, LogAuditoria, UpdateLogAuditoriaDTO } from "./logAuditoriaTypes"

export const logAuditoriaRepository = {
  async create(data: CreateLogAuditoriaDTO): Promise<LogAuditoria> {
    const result = await execute("INSERT INTO logs_auditoria (id_usuario, acao, tabela_afetada, id_registro, dados_anteriores, dados_novos, ip_origem, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [data.id_usuario ?? null, data.acao, data.tabela_afetada ?? null, data.id_registro ?? null, data.dados_anteriores ?? null, data.dados_novos ?? null, data.ip_origem ?? null, data.user_agent ?? null])
    const created = await runOne<LogAuditoria>("SELECT id_log, id_usuario, acao, tabela_afetada, id_registro, dados_anteriores, dados_novos, ip_origem, user_agent, criado_em FROM logs_auditoria WHERE id_log = ?", [result.insertId])
    if (!created) { throw new Error("Não foi possível criar o log de auditoria") }
    return created
  },

  async findById(id: number): Promise<LogAuditoria | undefined> {
    return runOne<LogAuditoria>("SELECT id_log, id_usuario, acao, tabela_afetada, id_registro, dados_anteriores, dados_novos, ip_origem, user_agent, criado_em FROM logs_auditoria WHERE id_log = ?", [id])
  },

  async findByUsuario(id_usuario: number): Promise<LogAuditoria[]> {
    return runQuery<LogAuditoria>("SELECT id_log, id_usuario, acao, tabela_afetada, id_registro, dados_anteriores, dados_novos, ip_origem, user_agent, criado_em FROM logs_auditoria WHERE id_usuario = ? ORDER BY criado_em DESC", [id_usuario])
  },

  async findAll(): Promise<LogAuditoria[]> {
    return runQuery<LogAuditoria>("SELECT id_log, id_usuario, acao, tabela_afetada, id_registro, dados_anteriores, dados_novos, ip_origem, user_agent, criado_em FROM logs_auditoria ORDER BY criado_em DESC")
  },

  async update(id: number, data: UpdateLogAuditoriaDTO): Promise<LogAuditoria> {
    const fields: string[] = []
    const values: unknown[] = []
    if (data.id_usuario !== undefined) { fields.push("id_usuario = ?"); values.push(data.id_usuario) }
    if (data.acao !== undefined) { fields.push("acao = ?"); values.push(data.acao) }
    if (data.tabela_afetada !== undefined) { fields.push("tabela_afetada = ?"); values.push(data.tabela_afetada) }
    if (data.id_registro !== undefined) { fields.push("id_registro = ?"); values.push(data.id_registro) }
    if (data.dados_anteriores !== undefined) { fields.push("dados_anteriores = ?"); values.push(data.dados_anteriores) }
    if (data.dados_novos !== undefined) { fields.push("dados_novos = ?"); values.push(data.dados_novos) }
    if (data.ip_origem !== undefined) { fields.push("ip_origem = ?"); values.push(data.ip_origem) }
    if (data.user_agent !== undefined) { fields.push("user_agent = ?"); values.push(data.user_agent) }
    if (fields.length === 0) { throw new Error("Nenhum campo para atualizar") }
    values.push(id)
    await execute("UPDATE logs_auditoria SET " + fields.join(", ") + " WHERE id_log = ?", values)
    const updated = await this.findById(id)
    if (!updated) { throw new Error("Log não encontrado") }
    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM logs_auditoria WHERE id_log = ?", [id])
  }
}