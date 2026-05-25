import { execute, runOne, runQuery } from "../../shared"
import { BiomarcadorMedicao, CreateBiomarcadorMedicaoDTO, UpdateBiomarcadorMedicaoDTO } from "./biomarcadorMedicaoTypes"

export const biomarcadorMedicaoRepository = {
  async create(data: CreateBiomarcadorMedicaoDTO): Promise<BiomarcadorMedicao> {
    const result = await execute("INSERT INTO biomarcador_medicoes (id_usuario, id_biomarcador, valor, leitura_texto, status, tendencia, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)", [data.id_usuario, data.id_biomarcador, data.valor, data.leitura_texto ?? null, data.status ?? "NORMAL", data.tendencia ?? "ESTAVEL", data.observacoes ?? null])
    const created = await runOne<BiomarcadorMedicao>("SELECT id_medicao, id_usuario, id_biomarcador, valor, leitura_texto, status, tendencia, medido_em, observacoes FROM biomarcador_medicoes WHERE id_medicao = ?", [result.insertId])

    if (!created) { throw new Error("Não foi possível criar a medição") }

    return created
  },

  async findById(id: number): Promise<BiomarcadorMedicao | undefined> {
    return runOne<BiomarcadorMedicao>("SELECT id_medicao, id_usuario, id_biomarcador, valor, leitura_texto, status, tendencia, medido_em, observacoes FROM biomarcador_medicoes WHERE id_medicao = ?", [id])
  },

  async findByUsuario(id_usuario: number): Promise<BiomarcadorMedicao[]> {
    return runQuery<BiomarcadorMedicao>("SELECT id_medicao, id_usuario, id_biomarcador, valor, leitura_texto, status, tendencia, medido_em, observacoes FROM biomarcador_medicoes WHERE id_usuario = ? ORDER BY medido_em DESC", [id_usuario])
  },

  async findAll(): Promise<BiomarcadorMedicao[]> {
    return runQuery<BiomarcadorMedicao>("SELECT id_medicao, id_usuario, id_biomarcador, valor, leitura_texto, status, tendencia, medido_em, observacoes FROM biomarcador_medicoes ORDER BY medido_em DESC")
  },

  async update(id: number, data: UpdateBiomarcadorMedicaoDTO): Promise<BiomarcadorMedicao> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.valor !== undefined) { fields.push("valor = ?"); values.push(data.valor) }
    if (data.leitura_texto !== undefined) { fields.push("leitura_texto = ?"); values.push(data.leitura_texto) }
    if (data.status !== undefined) { fields.push("status = ?"); values.push(data.status) }
    if (data.tendencia !== undefined) { fields.push("tendencia = ?"); values.push(data.tendencia) }
    if (data.observacoes !== undefined) { fields.push("observacoes = ?"); values.push(data.observacoes) }

    if (fields.length === 0) { throw new Error("Nenhum campo para atualizar") }

    values.push(id)
    await execute("UPDATE biomarcador_medicoes SET " + fields.join(", ") + " WHERE id_medicao = ?", values)

    const updated = await this.findById(id)

    if (!updated) { throw new Error("Medição não encontrada") }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM biomarcador_medicoes WHERE id_medicao = ?", [id])
  }
}