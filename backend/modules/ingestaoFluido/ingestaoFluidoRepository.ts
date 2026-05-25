import { execute, runOne, runQuery } from "../../shared"
import { CreateIngestaoFluidoDTO, IngestaoFluido, UpdateIngestaoFluidoDTO } from "./ingestaoFluidoTypes"

export const ingestaoFluidoRepository = {
  async create(data: CreateIngestaoFluidoDTO): Promise<IngestaoFluido> {
    const result = await execute(
      "INSERT INTO ingestao_fluidos (id_sessao, momento, tipo_fluido, descricao_fluido, volume_ml) VALUES (?, ?, ?, ?, ?)",
      [data.id_sessao, data.momento, data.tipo_fluido ?? "AGUA", data.descricao_fluido ?? null, data.volume_ml]
    )

    const created = await runOne<IngestaoFluido>(
      "SELECT id_ingestao, id_sessao, momento, tipo_fluido, descricao_fluido, volume_ml, horario_ingestao FROM ingestao_fluidos WHERE id_ingestao = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar a ingestão de fluido")
    }

    return created
  },

  async findById(id: number): Promise<IngestaoFluido | undefined> {
    return runOne<IngestaoFluido>(
      "SELECT id_ingestao, id_sessao, momento, tipo_fluido, descricao_fluido, volume_ml, horario_ingestao FROM ingestao_fluidos WHERE id_ingestao = ?",
      [id]
    )
  },

  async findBySessao(id_sessao: number): Promise<IngestaoFluido[]> {
    return runQuery<IngestaoFluido>(
      "SELECT id_ingestao, id_sessao, momento, tipo_fluido, descricao_fluido, volume_ml, horario_ingestao FROM ingestao_fluidos WHERE id_sessao = ? ORDER BY horario_ingestao DESC",
      [id_sessao]
    )
  },

  async findAll(): Promise<IngestaoFluido[]> {
    return runQuery<IngestaoFluido>(
      "SELECT id_ingestao, id_sessao, momento, tipo_fluido, descricao_fluido, volume_ml, horario_ingestao FROM ingestao_fluidos ORDER BY horario_ingestao DESC"
    )
  },

  async update(id: number, data: UpdateIngestaoFluidoDTO): Promise<IngestaoFluido> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.momento !== undefined) {
      fields.push("momento = ?")
      values.push(data.momento)
    }

    if (data.tipo_fluido !== undefined) {
      fields.push("tipo_fluido = ?")
      values.push(data.tipo_fluido)
    }

    if (data.descricao_fluido !== undefined) {
      fields.push("descricao_fluido = ?")
      values.push(data.descricao_fluido)
    }

    if (data.volume_ml !== undefined) {
      fields.push("volume_ml = ?")
      values.push(data.volume_ml)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)
    await execute(`UPDATE ingestao_fluidos SET ${fields.join(", ")} WHERE id_ingestao = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Ingestão de fluido não encontrada")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM ingestao_fluidos WHERE id_ingestao = ?", [id])
  }
}
