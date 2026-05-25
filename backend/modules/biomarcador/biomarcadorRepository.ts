import { execute, runOne, runQuery } from "../../shared"
import { Biomarcador, CreateBiomarcadorDTO, UpdateBiomarcadorDTO } from "./biomarcadorTypes"

export const biomarcadorRepository = {
  async create(data: CreateBiomarcadorDTO): Promise<Biomarcador> {
    const result = await execute(
      "INSERT INTO biomarcadores (nome, unidade, faixa_min, faixa_max, descricao, ativo) VALUES (?, ?, ?, ?, ?, ?)",
      [data.nome, data.unidade, data.faixa_min ?? null, data.faixa_max ?? null, data.descricao ?? null, data.ativo ?? 1]
    )

    const created = await runOne<Biomarcador>("SELECT id_biomarcador, nome, unidade, faixa_min, faixa_max, descricao, ativo FROM biomarcadores WHERE id_biomarcador = ?", [result.insertId])

    if (!created) {
      throw new Error("Não foi possível criar o biomarcador")
    }

    return created
  },

  async findById(id: number): Promise<Biomarcador | undefined> {
    return runOne<Biomarcador>("SELECT id_biomarcador, nome, unidade, faixa_min, faixa_max, descricao, ativo FROM biomarcadores WHERE id_biomarcador = ?", [id])
  },

  async findAll(): Promise<Biomarcador[]> {
    return runQuery<Biomarcador>("SELECT id_biomarcador, nome, unidade, faixa_min, faixa_max, descricao, ativo FROM biomarcadores ORDER BY nome ASC")
  },

  async update(id: number, data: UpdateBiomarcadorDTO): Promise<Biomarcador> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.nome !== undefined) { fields.push("nome = ?"); values.push(data.nome) }
    if (data.unidade !== undefined) { fields.push("unidade = ?"); values.push(data.unidade) }
    if (data.faixa_min !== undefined) { fields.push("faixa_min = ?"); values.push(data.faixa_min) }
    if (data.faixa_max !== undefined) { fields.push("faixa_max = ?"); values.push(data.faixa_max) }
    if (data.descricao !== undefined) { fields.push("descricao = ?"); values.push(data.descricao) }
    if (data.ativo !== undefined) { fields.push("ativo = ?"); values.push(data.ativo) }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)
    await execute("UPDATE biomarcadores SET " + fields.join(", ") + " WHERE id_biomarcador = ?", values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Biomarcador não encontrado")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM biomarcadores WHERE id_biomarcador = ?", [id])
  }
}