import { execute, runOne, runQuery } from "../../shared"
import { CreateRegistroCorUrinaDTO, RegistroCorUrina, UpdateRegistroCorUrinaDTO } from "./registroCorUrinaTypes"

export const registroCorUrinaRepository = {
  async create(data: CreateRegistroCorUrinaDTO): Promise<RegistroCorUrina> {
    const result = await execute(
      "INSERT INTO registros_cor_urina (id_sessao, momento, escala_cor, descricao_cor) VALUES (?, ?, ?, ?)",
      [data.id_sessao, data.momento, data.escala_cor, data.descricao_cor ?? null]
    )

    const created = await runOne<RegistroCorUrina>(
      "SELECT id_registro_urina, id_sessao, momento, escala_cor, descricao_cor, horario_registro FROM registros_cor_urina WHERE id_registro_urina = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar o registro de cor da urina")
    }

    return created
  },

  async findById(id: number): Promise<RegistroCorUrina | undefined> {
    return runOne<RegistroCorUrina>(
      "SELECT id_registro_urina, id_sessao, momento, escala_cor, descricao_cor, horario_registro FROM registros_cor_urina WHERE id_registro_urina = ?",
      [id]
    )
  },

  async findBySessao(id_sessao: number): Promise<RegistroCorUrina[]> {
    return runQuery<RegistroCorUrina>(
      "SELECT id_registro_urina, id_sessao, momento, escala_cor, descricao_cor, horario_registro FROM registros_cor_urina WHERE id_sessao = ? ORDER BY horario_registro DESC",
      [id_sessao]
    )
  },

  async findAll(): Promise<RegistroCorUrina[]> {
    return runQuery<RegistroCorUrina>(
      "SELECT id_registro_urina, id_sessao, momento, escala_cor, descricao_cor, horario_registro FROM registros_cor_urina ORDER BY horario_registro DESC"
    )
  },

  async update(id: number, data: UpdateRegistroCorUrinaDTO): Promise<RegistroCorUrina> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.momento !== undefined) {
      fields.push("momento = ?")
      values.push(data.momento)
    }

    if (data.escala_cor !== undefined) {
      fields.push("escala_cor = ?")
      values.push(data.escala_cor)
    }

    if (data.descricao_cor !== undefined) {
      fields.push("descricao_cor = ?")
      values.push(data.descricao_cor)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)
    await execute(`UPDATE registros_cor_urina SET ${fields.join(", ")} WHERE id_registro_urina = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Registro de cor da urina não encontrado")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM registros_cor_urina WHERE id_registro_urina = ?", [id])
  }
}
