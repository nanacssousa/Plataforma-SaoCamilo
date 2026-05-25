import { execute, runOne, runQuery } from "../../shared"
import { CreateEquipeDTO, Equipe, UpdateEquipeDTO } from "./equipeTypes"

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

  async findAll(): Promise<Equipe[]> {
    return runQuery<Equipe>(
      "SELECT id_equipe, nome, modalidade, descricao, ativo, criado_em FROM equipes ORDER BY criado_em DESC"
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
