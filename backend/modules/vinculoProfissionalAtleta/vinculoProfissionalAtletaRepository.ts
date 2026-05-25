import { execute, runOne, runQuery } from "../../shared"
import { CreateVinculoProfissionalAtletaDTO, UpdateVinculoProfissionalAtletaDTO, VinculoProfissionalAtleta } from "./vinculoProfissionalAtletaTypes"

export const vinculoProfissionalAtletaRepository = {
  async create(data: CreateVinculoProfissionalAtletaDTO): Promise<VinculoProfissionalAtleta> {
    const dataInicio = data.data_inicio ?? new Date().toISOString().slice(0, 10)

    const result = await execute(
      "INSERT INTO vinculos_profissional_atleta (id_nutricionista, id_atleta, data_inicio, data_fim, ativo) VALUES (?, ?, ?, ?, ?)",
      [data.id_nutricionista, data.id_atleta, dataInicio, data.data_fim ?? null, data.ativo ?? 1]
    )

    const created = await runOne<VinculoProfissionalAtleta>(
      "SELECT id_vinculo, id_nutricionista, id_atleta, data_inicio, data_fim, ativo, criado_em FROM vinculos_profissional_atleta WHERE id_vinculo = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar o vínculo profissional-atleta")
    }

    return created
  },

  async findById(id: number): Promise<VinculoProfissionalAtleta | undefined> {
    return runOne<VinculoProfissionalAtleta>(
      "SELECT id_vinculo, id_nutricionista, id_atleta, data_inicio, data_fim, ativo, criado_em FROM vinculos_profissional_atleta WHERE id_vinculo = ?",
      [id]
    )
  },

  async findByNutricionista(id_nutricionista: number): Promise<VinculoProfissionalAtleta[]> {
    return runQuery<VinculoProfissionalAtleta>(
      "SELECT id_vinculo, id_nutricionista, id_atleta, data_inicio, data_fim, ativo, criado_em FROM vinculos_profissional_atleta WHERE id_nutricionista = ? ORDER BY criado_em DESC",
      [id_nutricionista]
    )
  },

  async findByAtleta(id_atleta: number): Promise<VinculoProfissionalAtleta[]> {
    return runQuery<VinculoProfissionalAtleta>(
      "SELECT id_vinculo, id_nutricionista, id_atleta, data_inicio, data_fim, ativo, criado_em FROM vinculos_profissional_atleta WHERE id_atleta = ? ORDER BY criado_em DESC",
      [id_atleta]
    )
  },

  async update(id: number, data: UpdateVinculoProfissionalAtletaDTO): Promise<VinculoProfissionalAtleta> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.data_fim !== undefined) {
      fields.push("data_fim = ?")
      values.push(data.data_fim)
    }

    if (data.ativo !== undefined) {
      fields.push("ativo = ?")
      values.push(data.ativo)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)
    await execute(`UPDATE vinculos_profissional_atleta SET ${fields.join(", ")} WHERE id_vinculo = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Vínculo não encontrado")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM vinculos_profissional_atleta WHERE id_vinculo = ?", [id])
  }
}
