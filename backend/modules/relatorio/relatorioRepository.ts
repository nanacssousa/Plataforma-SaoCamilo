import { execute, runOne, runQuery } from "../../shared"
import { CreateRelatorioDTO, Relatorio, UpdateRelatorioDTO } from "./relatorioTypes"

export const relatorioRepository = {
  async create(data: CreateRelatorioDTO): Promise<Relatorio> {
    const result = await execute("INSERT INTO relatorios (id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [data.id_solicitante, data.id_atleta, data.tipo_relatorio, data.formato, data.periodo_inicio, data.periodo_fim, data.url_arquivo ?? null, data.status ?? "PENDENTE", data.erro_mensagem ?? null, data.gerado_em ?? null])
    const created = await runOne<Relatorio>("SELECT id_relatorio, id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em, criado_em FROM relatorios WHERE id_relatorio = ?", [result.insertId])
    if (!created) { throw new Error("Não foi possível criar o relatório") }
    return created
  },

  async findById(id: number): Promise<Relatorio | undefined> {
    return runOne<Relatorio>("SELECT id_relatorio, id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em, criado_em FROM relatorios WHERE id_relatorio = ?", [id])
  },

  async findByAtleta(id_atleta: number): Promise<Relatorio[]> {
    return runQuery<Relatorio>("SELECT id_relatorio, id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em, criado_em FROM relatorios WHERE id_atleta = ? ORDER BY criado_em DESC", [id_atleta])
  },

  async findBySolicitante(id_solicitante: number): Promise<Relatorio[]> {
    return runQuery<Relatorio>("SELECT id_relatorio, id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em, criado_em FROM relatorios WHERE id_solicitante = ? ORDER BY criado_em DESC", [id_solicitante])
  },

  async findAll(): Promise<Relatorio[]> {
    return runQuery<Relatorio>("SELECT id_relatorio, id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em, criado_em FROM relatorios ORDER BY criado_em DESC")
  },

  async update(id: number, data: UpdateRelatorioDTO): Promise<Relatorio> {
    const fields: string[] = []
    const values: unknown[] = []
    if (data.tipo_relatorio !== undefined) { fields.push("tipo_relatorio = ?"); values.push(data.tipo_relatorio) }
    if (data.formato !== undefined) { fields.push("formato = ?"); values.push(data.formato) }
    if (data.periodo_inicio !== undefined) { fields.push("periodo_inicio = ?"); values.push(data.periodo_inicio) }
    if (data.periodo_fim !== undefined) { fields.push("periodo_fim = ?"); values.push(data.periodo_fim) }
    if (data.url_arquivo !== undefined) { fields.push("url_arquivo = ?"); values.push(data.url_arquivo) }
    if (data.status !== undefined) { fields.push("status = ?"); values.push(data.status) }
    if (data.erro_mensagem !== undefined) { fields.push("erro_mensagem = ?"); values.push(data.erro_mensagem) }
    if (data.gerado_em !== undefined) { fields.push("gerado_em = ?"); values.push(data.gerado_em) }
    if (fields.length === 0) { throw new Error("Nenhum campo para atualizar") }
    values.push(id)
    await execute("UPDATE relatorios SET " + fields.join(", ") + " WHERE id_relatorio = ?", values)
    const updated = await this.findById(id)
    if (!updated) { throw new Error("Relatório não encontrado") }
    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM relatorios WHERE id_relatorio = ?", [id])
  }
}