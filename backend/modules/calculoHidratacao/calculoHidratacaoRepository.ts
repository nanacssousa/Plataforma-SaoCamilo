import { execute, runOne, runQuery } from "../../shared"
import { CalculoHidratacao, CreateCalculoHidratacaoDTO, UpdateCalculoHidratacaoDTO } from "./calculoHidratacaoTypes"

export const calculoHidratacaoRepository = {
  async create(data: CreateCalculoHidratacaoDTO): Promise<CalculoHidratacao> {
    const result = await execute(
      "INSERT INTO calculos_hidratacao (id_sessao, massa_pre_kg, massa_pos_kg, total_ingestao_ml, total_urinario_ml, duracao_horas, variacao_massa_kg, perda_percentual_massa, taxa_sudorese_lh, balanco_hidrico_ml, nivel_desidratacao, risco_hiponatremia, recomendacao_reposicao_ml, versao_algoritmo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [data.id_sessao, data.massa_pre_kg, data.massa_pos_kg, data.total_ingestao_ml, data.total_urinario_ml ?? 0, data.duracao_horas, data.variacao_massa_kg, data.perda_percentual_massa, data.taxa_sudorese_lh, data.balanco_hidrico_ml, data.nivel_desidratacao, data.risco_hiponatremia ?? 0, data.recomendacao_reposicao_ml ?? null, data.versao_algoritmo ?? "1.0"]
    )

    const created = await runOne<CalculoHidratacao>(
      "SELECT id_calculo, id_sessao, massa_pre_kg, massa_pos_kg, total_ingestao_ml, total_urinario_ml, duracao_horas, variacao_massa_kg, perda_percentual_massa, taxa_sudorese_lh, balanco_hidrico_ml, nivel_desidratacao, risco_hiponatremia, recomendacao_reposicao_ml, calculado_em, versao_algoritmo FROM calculos_hidratacao WHERE id_calculo = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar o cálculo de hidratação")
    }

    return created
  },

  async findById(id: number): Promise<CalculoHidratacao | undefined> {
    return runOne<CalculoHidratacao>(
      "SELECT id_calculo, id_sessao, massa_pre_kg, massa_pos_kg, total_ingestao_ml, total_urinario_ml, duracao_horas, variacao_massa_kg, perda_percentual_massa, taxa_sudorese_lh, balanco_hidrico_ml, nivel_desidratacao, risco_hiponatremia, recomendacao_reposicao_ml, calculado_em, versao_algoritmo FROM calculos_hidratacao WHERE id_calculo = ?",
      [id]
    )
  },

  async findBySessao(id_sessao: number): Promise<CalculoHidratacao | undefined> {
    return runOne<CalculoHidratacao>(
      "SELECT id_calculo, id_sessao, massa_pre_kg, massa_pos_kg, total_ingestao_ml, total_urinario_ml, duracao_horas, variacao_massa_kg, perda_percentual_massa, taxa_sudorese_lh, balanco_hidrico_ml, nivel_desidratacao, risco_hiponatremia, recomendacao_reposicao_ml, calculado_em, versao_algoritmo FROM calculos_hidratacao WHERE id_sessao = ?",
      [id_sessao]
    )
  },

  async findAll(): Promise<CalculoHidratacao[]> {
    return runQuery<CalculoHidratacao>(
      "SELECT id_calculo, id_sessao, massa_pre_kg, massa_pos_kg, total_ingestao_ml, total_urinario_ml, duracao_horas, variacao_massa_kg, perda_percentual_massa, taxa_sudorese_lh, balanco_hidrico_ml, nivel_desidratacao, risco_hiponatremia, recomendacao_reposicao_ml, calculado_em, versao_algoritmo FROM calculos_hidratacao ORDER BY calculado_em DESC"
    )
  },

  async update(id: number, data: UpdateCalculoHidratacaoDTO): Promise<CalculoHidratacao> {
    const fields: string[] = []
    const values: unknown[] = []

    const keys: (keyof UpdateCalculoHidratacaoDTO)[] = [
      "massa_pre_kg",
      "massa_pos_kg",
      "total_ingestao_ml",
      "total_urinario_ml",
      "duracao_horas",
      "variacao_massa_kg",
      "perda_percentual_massa",
      "taxa_sudorese_lh",
      "balanco_hidrico_ml",
      "nivel_desidratacao",
      "risco_hiponatremia",
      "recomendacao_reposicao_ml",
      "versao_algoritmo"
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
    await execute(`UPDATE calculos_hidratacao SET ${fields.join(", ")} WHERE id_calculo = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Cálculo de hidratação não encontrado")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM calculos_hidratacao WHERE id_calculo = ?", [id])
  }
}
