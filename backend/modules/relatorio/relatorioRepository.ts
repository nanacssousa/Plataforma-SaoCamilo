import { execute, runOne, runQuery } from "../../shared";
import {
  CreateRelatorioDTO,
  Relatorio,
  UpdateRelatorioDTO,
} from "./relatorioTypes";

export const relatorioRepository = {
  async create(data: CreateRelatorioDTO): Promise<Relatorio> {
    const result = await execute(
      "INSERT INTO relatorios (id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.id_solicitante,
        data.id_atleta,
        data.tipo_relatorio,
        data.formato,
        data.periodo_inicio,
        data.periodo_fim,
        data.url_arquivo ?? null,
        data.status ?? "PENDENTE",
        data.erro_mensagem ?? null,
        data.gerado_em ?? null,
      ],
    );
    const created = await runOne<Relatorio>(
      "SELECT id_relatorio, id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em, criado_em FROM relatorios WHERE id_relatorio = ?",
      [result.insertId],
    );
    if (!created) {
      throw new Error("Não foi possível criar o relatório");
    }
    return created;
  },

  async findById(id: number): Promise<Relatorio | undefined> {
    return runOne<Relatorio>(
      "SELECT id_relatorio, id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em, criado_em FROM relatorios WHERE id_relatorio = ?",
      [id],
    );
  },

  async findByAtleta(id_atleta: number): Promise<Relatorio[]> {
    return runQuery<Relatorio>(
      "SELECT id_relatorio, id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em, criado_em FROM relatorios WHERE id_atleta = ? ORDER BY criado_em DESC",
      [id_atleta],
    );
  },

  async findBySolicitante(id_solicitante: number): Promise<Relatorio[]> {
    return runQuery<Relatorio>(
      "SELECT id_relatorio, id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em, criado_em FROM relatorios WHERE id_solicitante = ? ORDER BY criado_em DESC",
      [id_solicitante],
    );
  },

  async findByEquipe(id_equipe: number): Promise<Relatorio[]> {
    return runQuery<Relatorio>(
      `SELECT r.id_relatorio, r.id_solicitante, r.id_atleta, r.tipo_relatorio, r.formato,
              r.periodo_inicio, r.periodo_fim, r.url_arquivo, r.status, r.erro_mensagem,
              r.gerado_em, r.criado_em
       FROM relatorios r
       INNER JOIN equipe_membros em ON em.id_atleta = r.id_atleta
       WHERE em.id_equipe = ?
       ORDER BY r.criado_em DESC`,
      [id_equipe],
    );
  },

  async findAll(): Promise<Relatorio[]> {
    return runQuery<Relatorio>(
      "SELECT id_relatorio, id_solicitante, id_atleta, tipo_relatorio, formato, periodo_inicio, periodo_fim, url_arquivo, status, erro_mensagem, gerado_em, criado_em FROM relatorios ORDER BY criado_em DESC",
    );
  },

  async update(id: number, data: UpdateRelatorioDTO): Promise<Relatorio> {
    const fields: string[] = [];
    const values: unknown[] = [];
    if (data.tipo_relatorio !== undefined) {
      fields.push("tipo_relatorio = ?");
      values.push(data.tipo_relatorio);
    }
    if (data.formato !== undefined) {
      fields.push("formato = ?");
      values.push(data.formato);
    }
    if (data.periodo_inicio !== undefined) {
      fields.push("periodo_inicio = ?");
      values.push(data.periodo_inicio);
    }
    if (data.periodo_fim !== undefined) {
      fields.push("periodo_fim = ?");
      values.push(data.periodo_fim);
    }
    if (data.url_arquivo !== undefined) {
      fields.push("url_arquivo = ?");
      values.push(data.url_arquivo);
    }
    if (data.status !== undefined) {
      fields.push("status = ?");
      values.push(data.status);
    }
    if (data.erro_mensagem !== undefined) {
      fields.push("erro_mensagem = ?");
      values.push(data.erro_mensagem);
    }
    if (data.gerado_em !== undefined) {
      fields.push("gerado_em = ?");
      values.push(data.gerado_em);
    }
    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar");
    }
    values.push(id);
    await execute(
      "UPDATE relatorios SET " + fields.join(", ") + " WHERE id_relatorio = ?",
      values,
    );
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error("Relatório não encontrado");
    }
    return updated;
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM relatorios WHERE id_relatorio = ?", [id]);
  },

  async findAtletasPainelByEquipe(
      id_equipe: number,
      periodoInicio: string,
      periodoFim: string
    ): Promise<any[]> {
      return runQuery(
        `SELECT
          u.id_usuario                                          AS id,
          u.nome_completo                                       AS nome,
          COALESCE(pa.modalidade, em.cargo, 'Atleta')           AS posicao,
          COALESCE(UPPER(pa.nivel), 'PRINCIPAL')                AS categoria,
          COALESCE(ch.massa_pos_kg, pa.peso_habitual_kg, 0)     AS massaAtual,
          COALESCE(
            CASE
              WHEN ch.massa_pre_kg > 0
              THEN ROUND(((ch.massa_pos_kg - ch.massa_pre_kg) / ch.massa_pre_kg) * 100, 2)
              ELSE 0
            END, 0
          )                                                     AS deltaMassa,
          COALESCE(latest_usg.usg, 1.020)                       AS usg,
          CASE
            WHEN ch.nivel_desidratacao = 'HIDRATADO' THEN 'hidratado'
            WHEN ch.nivel_desidratacao = 'LEVE'      THEN 'alerta_leve'
            WHEN ch.nivel_desidratacao IS NULL        THEN 'hidratado'
            ELSE 'desidratado'
          END                                                   AS statusHidrico
        FROM equipe_membros em
        JOIN usuarios u
          ON u.id_usuario = em.id_usuario
        LEFT JOIN perfis_atleticos pa
          ON pa.id_usuario = u.id_usuario
        -- última sessão do atleta dentro do período informado
        LEFT JOIN (
          SELECT st2.id_usuario, st2.id_sessao
          FROM sessoes_treino st2
          WHERE st2.data_treino BETWEEN ? AND ?
            AND CONCAT(st2.data_treino, ' ', st2.hora_inicio) = (
              SELECT MAX(CONCAT(st3.data_treino, ' ', st3.hora_inicio))
              FROM sessoes_treino st3
              WHERE st3.id_usuario = st2.id_usuario
                AND st3.data_treino BETWEEN ? AND ?
            )
        ) latest_sessao
          ON latest_sessao.id_usuario = u.id_usuario
        LEFT JOIN calculos_hidratacao ch
          ON ch.id_sessao = latest_sessao.id_sessao
        -- última medição de USG do atleta dentro do período
        LEFT JOIN (
          SELECT bm.id_usuario, bm.valor AS usg
          FROM biomarcador_medicoes bm
          WHERE bm.id_biomarcador = (
            SELECT id_biomarcador FROM biomarcadores
            WHERE nome = 'Densidade Urinária (USG)'
          )
            AND DATE(bm.medido_em) BETWEEN ? AND ?
            AND bm.medido_em = (
              SELECT MAX(bm2.medido_em)
              FROM biomarcador_medicoes bm2
              WHERE bm2.id_usuario    = bm.id_usuario
                AND bm2.id_biomarcador = bm.id_biomarcador
                AND DATE(bm2.medido_em) BETWEEN ? AND ?
            )
        ) latest_usg
          ON latest_usg.id_usuario = u.id_usuario
        WHERE em.id_equipe = ?
          AND em.ativo     = 1
          AND u.id_perfil  = (SELECT id_perfil FROM perfis WHERE nome = 'ATLETA')
        ORDER BY u.nome_completo ASC`,
        // os ? na ordem em que aparecem na query
        [
          periodoInicio, periodoFim, // latest_sessao — WHERE data_treino BETWEEN
          periodoInicio, periodoFim, // latest_sessao — subquery MAX
          periodoInicio, periodoFim, // latest_usg — WHERE medido_em BETWEEN
          periodoInicio, periodoFim, // latest_usg — subquery MAX
          id_equipe,
        ]
      )
    },

    async findSugestoesByAtleta(id_atleta: number): Promise<any[]> {
      return runQuery(
        `SELECT
          eh.id_estrategia                                        AS id,
          CASE
            WHEN eh.valida_ate <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
            THEN 'emergencial'
            ELSE 'ajuste'
          END                                                     AS tipo,
          eh.titulo,
          eh.descricao
        FROM estrategias_hidratacao eh
        WHERE eh.id_atleta = ?
          AND eh.ativa     = 1
        ORDER BY eh.valida_ate ASC`,
        [id_atleta]
      )
    },
  };
