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

  // Busca os cálculos de hidratação de um atleta específico, via join em sessoes_treino,
  // já trazendo a escala_cor (USG aproximado) da última pesagem PÓS da sessão.
  async findByUsuario(id_usuario: number, limit?: number): Promise<(CalculoHidratacao & { escala_cor: number | null })[]> {
    let sql = `
      SELECT
        c.id_calculo,
        c.id_sessao,
        c.massa_pre_kg,
        c.massa_pos_kg,
        c.total_ingestao_ml,
        c.total_urinario_ml,
        c.duracao_horas,
        c.variacao_massa_kg,
        c.perda_percentual_massa,
        c.taxa_sudorese_lh,
        c.balanco_hidrico_ml,
        c.nivel_desidratacao,
        c.risco_hiponatremia,
        c.recomendacao_reposicao_ml,
        c.calculado_em,
        c.versao_algoritmo,
        ru.escala_cor
      FROM calculos_hidratacao c
      INNER JOIN sessoes_treino s ON s.id_sessao = c.id_sessao
      LEFT JOIN registros_cor_urina ru
        ON ru.id_sessao = c.id_sessao AND ru.momento = 'POS'
      WHERE s.id_usuario = ?
      ORDER BY c.calculado_em DESC`
    const params: unknown[] = [id_usuario]

    if (limit !== undefined) {
      sql += " LIMIT ?"
      params.push(limit)
    }

    return runQuery(sql, params)
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
