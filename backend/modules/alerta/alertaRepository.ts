import { execute, runOne, runQuery } from "../../shared"
import { Alerta, CreateAlertaDTO, UpdateAlertaDTO } from "./alertaTypes"

export const alertaRepository = {
  async create(data: CreateAlertaDTO): Promise<Alerta> {
    const result = await execute(
      "INSERT INTO alertas (id_usuario, id_sessao, id_calculo, tipo_alerta, mensagem, nivel_urgencia, lido, enviado_push) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [data.id_usuario, data.id_sessao ?? null, data.id_calculo ?? null, data.tipo_alerta, data.mensagem, data.nivel_urgencia ?? "ATENCAO", data.lido ?? 0, data.enviado_push ?? 0]
    )

    const created = await runOne<Alerta>(
      "SELECT id_alerta, id_usuario, id_sessao, id_calculo, tipo_alerta, mensagem, nivel_urgencia, lido, lido_em, enviado_push, criado_em FROM alertas WHERE id_alerta = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar o alerta")
    }

    return created
  },

  async findById(id: number): Promise<Alerta | undefined> {
    return runOne<Alerta>(
      "SELECT id_alerta, id_usuario, id_sessao, id_calculo, tipo_alerta, mensagem, nivel_urgencia, lido, lido_em, enviado_push, criado_em FROM alertas WHERE id_alerta = ?",
      [id]
    )
  },

  async findByUsuario(id_usuario: number): Promise<Alerta[]> {
    return runQuery<Alerta>(
      "SELECT id_alerta, id_usuario, id_sessao, id_calculo, tipo_alerta, mensagem, nivel_urgencia, lido, lido_em, enviado_push, criado_em FROM alertas WHERE id_usuario = ? ORDER BY criado_em DESC",
      [id_usuario]
    )
  },

  async findAll(): Promise<Alerta[]> {
    return runQuery<Alerta>(
      "SELECT id_alerta, id_usuario, id_sessao, id_calculo, tipo_alerta, mensagem, nivel_urgencia, lido, lido_em, enviado_push, criado_em FROM alertas ORDER BY criado_em DESC"
    )
  },

  async update(id: number, data: UpdateAlertaDTO): Promise<Alerta> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.lido !== undefined) {
      fields.push("lido = ?")
      values.push(data.lido)
    }

    if (data.lido_em !== undefined) {
      fields.push("lido_em = ?")
      values.push(data.lido_em)
    }

    if (data.enviado_push !== undefined) {
      fields.push("enviado_push = ?")
      values.push(data.enviado_push)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)
    await execute(`UPDATE alertas SET ${fields.join(", ")} WHERE id_alerta = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Alerta não encontrado")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM alertas WHERE id_alerta = ?", [id])
  }
}
