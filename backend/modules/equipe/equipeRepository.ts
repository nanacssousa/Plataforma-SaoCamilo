import { execute, runOne, runQuery } from "../../shared"
import { CreateEquipeDTO, Equipe, EquipeAtleta, UpdateEquipeDTO } from "./equipeTypes"

export const equipeRepository = {
  async create(data: CreateEquipeDTO): Promise<Equipe> {
    const result = await execute(
      "INSERT INTO equipes (nome, modalidade, descricao, ativo) VALUES (?, ?, ?, ?)",
      [data.nome, data.modalidade ?? null, data.descricao ?? null, data.ativo ?? 1]
    )

    const created = await runOne<Equipe>(
      "SELECT id_equipe, nome, modalidade, descricao, ativo, criado_em FROM equipes WHERE id_equipe = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar a equipe")
    }

    return created
  },

  async findById(id: number): Promise<Equipe | undefined> {
    return runOne<Equipe>(
      "SELECT id_equipe, nome, modalidade, descricao, ativo, criado_em FROM equipes WHERE id_equipe = ?",
      [id]
    )
  },

async findAtletasByEquipe(id_equipe: number): Promise<EquipeAtleta[]> {
    return runQuery<EquipeAtleta>(
      `SELECT
        u.id_usuario AS id,
        u.nome_completo AS nome,
        COALESCE(latest_usg.usg, 1.020) AS usg,
        COALESCE(pa.modalidade, em.cargo, 'Atleta') AS posicao,
        COALESCE(UPPER(pa.nivel), 'PRINCIPAL') AS categoria,
        COALESCE(ch.massa_pos_kg, pa.peso_habitual_kg, 0) AS massaAtual,
        COALESCE(
          CASE
            WHEN ch.massa_pre_kg > 0 THEN ROUND(((ch.massa_pos_kg - ch.massa_pre_kg) / ch.massa_pre_kg) * 100, 2)
            ELSE 0
          END, 0
        ) AS deltaMassa,
        CASE
          WHEN ch.nivel_desidratacao = 'HIDRATADO' THEN 'hidratado'
          WHEN ch.nivel_desidratacao = 'LEVE' THEN 'alerta_leve'
          WHEN ch.nivel_desidratacao IS NULL THEN 'hidratado'
          ELSE 'desidratado'
        END AS statusHidrico
      FROM equipe_membros em
      JOIN usuarios u ON u.id_usuario = em.id_usuario
      LEFT JOIN perfis_atleticos pa ON pa.id_usuario = u.id_usuario
      LEFT JOIN (
        SELECT st2.id_usuario, st2.id_sessao
        FROM sessoes_treino st2
        WHERE CONCAT(st2.data_treino, ' ', st2.hora_inicio) = (
          SELECT MAX(CONCAT(st3.data_treino, ' ', st3.hora_inicio))
          FROM sessoes_treino st3
          WHERE st3.id_usuario = st2.id_usuario
        )
      ) latest_sessao ON latest_sessao.id_usuario = u.id_usuario
      LEFT JOIN calculos_hidratacao ch ON ch.id_sessao = latest_sessao.id_sessao
      LEFT JOIN (
        SELECT bm.id_usuario, bm.valor AS usg
        FROM biomarcador_medicoes bm
        WHERE bm.id_biomarcador = (
          SELECT id_biomarcador FROM biomarcadores WHERE nome = 'Densidade Urinária (USG)'
        )
        AND bm.medido_em = (
          SELECT MAX(bm2.medido_em)
          FROM biomarcador_medicoes bm2
          WHERE bm2.id_usuario = bm.id_usuario
            AND bm2.id_biomarcador = bm.id_biomarcador
        )
      ) latest_usg ON latest_usg.id_usuario = u.id_usuario
      WHERE em.id_equipe = ?
        AND em.ativo = 1
        AND u.id_perfil = (SELECT id_perfil FROM perfis WHERE nome = 'ATLETA')
      ORDER BY u.nome_completo ASC`
      , [id_equipe]
    )
  },


  async findAll(): Promise<Equipe[]> {
    return runQuery<Equipe>(
      "SELECT id_equipe, nome, modalidade, descricao, ativo, criado_em FROM equipes ORDER BY criado_em DESC"
    )
  },

  // Histórico de cálculos de hidratação dos últimos N dias para todos os
  // atletas de uma equipe — usado para alimentar o gráfico semanal.
  async findHistoricoByEquipe(id_equipe: number, dias = 7): Promise<{
    data_treino: string
    perda_percentual_massa: number
    usg: number | null
  }[]> {
    return runQuery(
      `SELECT
        st.data_treino,
        ch.perda_percentual_massa,
        ru.escala_cor AS usg_escala
      FROM equipe_membros em
      JOIN sessoes_treino st ON st.id_usuario = em.id_usuario
      JOIN calculos_hidratacao ch ON ch.id_sessao = st.id_sessao
      LEFT JOIN registros_cor_urina ru
        ON ru.id_sessao = st.id_sessao AND ru.momento = 'POS'
      WHERE em.id_equipe = ?
        AND em.ativo = 1
        AND st.data_treino >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ORDER BY st.data_treino ASC`,
      [id_equipe, dias]
    )
  },

  async update(id: number, data: UpdateEquipeDTO): Promise<Equipe> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.nome !== undefined) {
      fields.push("nome = ?")
      values.push(data.nome)
    }

    if (data.modalidade !== undefined) {
      fields.push("modalidade = ?")
      values.push(data.modalidade)
    }

    if (data.descricao !== undefined) {
      fields.push("descricao = ?")
      values.push(data.descricao)
    }

    if (data.ativo !== undefined) {
      fields.push("ativo = ?")
      values.push(data.ativo)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)

    await execute(`UPDATE equipes SET ${fields.join(", ")} WHERE id_equipe = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Equipe não encontrada")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM equipes WHERE id_equipe = ?", [id])
  }
}
