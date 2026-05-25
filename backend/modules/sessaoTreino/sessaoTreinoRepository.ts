import { execute, runOne, runQuery } from "../../shared"
import { CreateSessaoTreinoDTO, SessaoTreino, UpdateSessaoTreinoDTO } from "./sessaoTreinoTypes"

export const sessaoTreinoRepository = {
  async create(data: CreateSessaoTreinoDTO): Promise<SessaoTreino> {
    const result = await execute(
      "INSERT INTO sessoes_treino (id_usuario, id_tipo_exercicio, data_treino, hora_inicio, hora_fim, duracao_minutos, intensidade, local_treino, observacoes, validado_nutricionista, id_nutricionista_validador) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [data.id_usuario, data.id_tipo_exercicio, data.data_treino, data.hora_inicio, data.hora_fim ?? null, data.duracao_minutos ?? null, data.intensidade ?? "MODERADA", data.local_treino ?? null, data.observacoes ?? null, data.validado_nutricionista ?? 0, data.id_nutricionista_validador ?? null]
    )

    const created = await runOne<SessaoTreino>(
      "SELECT id_sessao, id_usuario, id_tipo_exercicio, data_treino, hora_inicio, hora_fim, duracao_minutos, intensidade, local_treino, observacoes, validado_nutricionista, id_nutricionista_validador, criado_em FROM sessoes_treino WHERE id_sessao = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar a sessão de treino")
    }

    return created
  },

  async findById(id: number): Promise<SessaoTreino | undefined> {
    return runOne<SessaoTreino>(
      "SELECT id_sessao, id_usuario, id_tipo_exercicio, data_treino, hora_inicio, hora_fim, duracao_minutos, intensidade, local_treino, observacoes, validado_nutricionista, id_nutricionista_validador, criado_em FROM sessoes_treino WHERE id_sessao = ?",
      [id]
    )
  },

  async findByUsuario(id_usuario: number): Promise<SessaoTreino[]> {
    return runQuery<SessaoTreino>(
      "SELECT id_sessao, id_usuario, id_tipo_exercicio, data_treino, hora_inicio, hora_fim, duracao_minutos, intensidade, local_treino, observacoes, validado_nutricionista, id_nutricionista_validador, criado_em FROM sessoes_treino WHERE id_usuario = ? ORDER BY data_treino DESC, hora_inicio DESC",
      [id_usuario]
    )
  },

  async findAll(): Promise<SessaoTreino[]> {
    return runQuery<SessaoTreino>(
      "SELECT id_sessao, id_usuario, id_tipo_exercicio, data_treino, hora_inicio, hora_fim, duracao_minutos, intensidade, local_treino, observacoes, validado_nutricionista, id_nutricionista_validador, criado_em FROM sessoes_treino ORDER BY data_treino DESC, hora_inicio DESC"
    )
  },

  async update(id: number, data: UpdateSessaoTreinoDTO): Promise<SessaoTreino> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.id_tipo_exercicio !== undefined) {
      fields.push("id_tipo_exercicio = ?")
      values.push(data.id_tipo_exercicio)
    }

    if (data.data_treino !== undefined) {
      fields.push("data_treino = ?")
      values.push(data.data_treino)
    }

    if (data.hora_inicio !== undefined) {
      fields.push("hora_inicio = ?")
      values.push(data.hora_inicio)
    }

    if (data.hora_fim !== undefined) {
      fields.push("hora_fim = ?")
      values.push(data.hora_fim)
    }

    if (data.duracao_minutos !== undefined) {
      fields.push("duracao_minutos = ?")
      values.push(data.duracao_minutos)
    }

    if (data.intensidade !== undefined) {
      fields.push("intensidade = ?")
      values.push(data.intensidade)
    }

    if (data.local_treino !== undefined) {
      fields.push("local_treino = ?")
      values.push(data.local_treino)
    }

    if (data.observacoes !== undefined) {
      fields.push("observacoes = ?")
      values.push(data.observacoes)
    }

    if (data.validado_nutricionista !== undefined) {
      fields.push("validado_nutricionista = ?")
      values.push(data.validado_nutricionista)
    }

    if (data.id_nutricionista_validador !== undefined) {
      fields.push("id_nutricionista_validador = ?")
      values.push(data.id_nutricionista_validador)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)
    await execute(`UPDATE sessoes_treino SET ${fields.join(", ")} WHERE id_sessao = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Sessão de treino não encontrada")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM sessoes_treino WHERE id_sessao = ?", [id])
  }
}
