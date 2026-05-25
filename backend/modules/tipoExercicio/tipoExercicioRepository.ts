import { execute, runOne, runQuery } from "../../shared"
import { CreateTipoExercicioDTO, TipoExercicio, UpdateTipoExercicioDTO } from "./tipoExercicioTypes"

export const tipoExercicioRepository = {
  async create(data: CreateTipoExercicioDTO): Promise<TipoExercicio> {
    const result = await execute(
      "INSERT INTO tipos_exercicio (nome, descricao, categoria) VALUES (?, ?, ?)",
      [data.nome, data.descricao ?? null, data.categoria ?? "MISTO"]
    )

    const created = await runOne<TipoExercicio>(
      "SELECT id_tipo_exercicio, nome, descricao, categoria FROM tipos_exercicio WHERE id_tipo_exercicio = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar o tipo de exercício")
    }

    return created
  },

  async findById(id: number): Promise<TipoExercicio | undefined> {
    return runOne<TipoExercicio>(
      "SELECT id_tipo_exercicio, nome, descricao, categoria FROM tipos_exercicio WHERE id_tipo_exercicio = ?",
      [id]
    )
  },

  async findAll(): Promise<TipoExercicio[]> {
    return runQuery<TipoExercicio>(
      "SELECT id_tipo_exercicio, nome, descricao, categoria FROM tipos_exercicio ORDER BY nome ASC"
    )
  },

  async update(id: number, data: UpdateTipoExercicioDTO): Promise<TipoExercicio> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.nome !== undefined) {
      fields.push("nome = ?")
      values.push(data.nome)
    }

    if (data.descricao !== undefined) {
      fields.push("descricao = ?")
      values.push(data.descricao)
    }

    if (data.categoria !== undefined) {
      fields.push("categoria = ?")
      values.push(data.categoria)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)
    await execute(`UPDATE tipos_exercicio SET ${fields.join(", ")} WHERE id_tipo_exercicio = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Tipo de exercício não encontrado")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM tipos_exercicio WHERE id_tipo_exercicio = ?", [id])
  }
}
