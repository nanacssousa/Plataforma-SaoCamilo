import { execute, runOne, runQuery } from "../../shared"
import { CreateTriagemDTO, Triagem, UpdateTriagemDTO } from "./triagemTypes"

export const triagemRepository = {
  async create(data: CreateTriagemDTO): Promise<Triagem> {
    const result = await execute(
      "INSERT INTO triagens (id_sessao, marca_branca_roupa, irritacao_ocular, gosto_salgado_labios, sensacao_sede, dor_cabeca, cansaco_excessivo, tontura, caibras, nausea, escala_borg, observacoes_livres) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [data.id_sessao, data.marca_branca_roupa ?? 0, data.irritacao_ocular ?? 0, data.gosto_salgado_labios ?? 0, data.sensacao_sede ?? 0, data.dor_cabeca ?? 0, data.cansaco_excessivo ?? 0, data.tontura ?? 0, data.caibras ?? 0, data.nausea ?? 0, data.escala_borg ?? null, data.observacoes_livres ?? null]
    )

    const created = await runOne<Triagem>(
      "SELECT id_triagem, id_sessao, marca_branca_roupa, irritacao_ocular, gosto_salgado_labios, sensacao_sede, dor_cabeca, cansaco_excessivo, tontura, caibras, nausea, escala_borg, observacoes_livres, criado_em FROM triagens WHERE id_triagem = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar a triagem")
    }

    return created
  },

  async findById(id: number): Promise<Triagem | undefined> {
    return runOne<Triagem>(
      "SELECT id_triagem, id_sessao, marca_branca_roupa, irritacao_ocular, gosto_salgado_labios, sensacao_sede, dor_cabeca, cansaco_excessivo, tontura, caibras, nausea, escala_borg, observacoes_livres, criado_em FROM triagens WHERE id_triagem = ?",
      [id]
    )
  },

  async findBySessao(id_sessao: number): Promise<Triagem | undefined> {
    return runOne<Triagem>(
      "SELECT id_triagem, id_sessao, marca_branca_roupa, irritacao_ocular, gosto_salgado_labios, sensacao_sede, dor_cabeca, cansaco_excessivo, tontura, caibras, nausea, escala_borg, observacoes_livres, criado_em FROM triagens WHERE id_sessao = ?",
      [id_sessao]
    )
  },

  async findAll(): Promise<Triagem[]> {
    return runQuery<Triagem>(
      "SELECT id_triagem, id_sessao, marca_branca_roupa, irritacao_ocular, gosto_salgado_labios, sensacao_sede, dor_cabeca, cansaco_excessivo, tontura, caibras, nausea, escala_borg, observacoes_livres, criado_em FROM triagens ORDER BY criado_em DESC"
    )
  },

  async update(id: number, data: UpdateTriagemDTO): Promise<Triagem> {
    const fields: string[] = []
    const values: unknown[] = []

    const keys: (keyof UpdateTriagemDTO)[] = [
      "marca_branca_roupa",
      "irritacao_ocular",
      "gosto_salgado_labios",
      "sensacao_sede",
      "dor_cabeca",
      "cansaco_excessivo",
      "tontura",
      "caibras",
      "nausea",
      "escala_borg",
      "observacoes_livres"
    ]

    for (const key of keys) {
      if (data[key] !== undefined) {
        fields.push(`${String(key)} = ?`)
        values.push(data[key])
      }
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)
    await execute(`UPDATE triagens SET ${fields.join(", ")} WHERE id_triagem = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Triagem não encontrada")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM triagens WHERE id_triagem = ?", [id])
  }
}
