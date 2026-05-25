import { execute, runOne, runQuery } from "../../shared"
import { CreatePesagemDTO, Pesagem, UpdatePesagemDTO } from "./pesagemTypes"

export const pesagemRepository = {
  async create(data: CreatePesagemDTO): Promise<Pesagem> {
    const result = await execute(
      "INSERT INTO pesagens (id_sessao, momento, massa_kg, confirmou_sem_tenis, confirmou_sem_acessorios, confirmou_bexiga_vazia, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [data.id_sessao, data.momento, data.massa_kg, data.confirmou_sem_tenis ?? 0, data.confirmou_sem_acessorios ?? 0, data.confirmou_bexiga_vazia ?? 0, data.observacoes ?? null]
    )

    const created = await runOne<Pesagem>(
      "SELECT id_pesagem, id_sessao, momento, massa_kg, confirmou_sem_tenis, confirmou_sem_acessorios, confirmou_bexiga_vazia, horario_pesagem, observacoes FROM pesagens WHERE id_pesagem = ?",
      [result.insertId]
    )

    if (!created) {
      throw new Error("Não foi possível criar a pesagem")
    }

    return created
  },

  async findById(id: number): Promise<Pesagem | undefined> {
    return runOne<Pesagem>(
      "SELECT id_pesagem, id_sessao, momento, massa_kg, confirmou_sem_tenis, confirmou_sem_acessorios, confirmou_bexiga_vazia, horario_pesagem, observacoes FROM pesagens WHERE id_pesagem = ?",
      [id]
    )
  },

  async findBySessao(id_sessao: number): Promise<Pesagem[]> {
    return runQuery<Pesagem>(
      "SELECT id_pesagem, id_sessao, momento, massa_kg, confirmou_sem_tenis, confirmou_sem_acessorios, confirmou_bexiga_vazia, horario_pesagem, observacoes FROM pesagens WHERE id_sessao = ? ORDER BY horario_pesagem DESC",
      [id_sessao]
    )
  },

  async findAll(): Promise<Pesagem[]> {
    return runQuery<Pesagem>(
      "SELECT id_pesagem, id_sessao, momento, massa_kg, confirmou_sem_tenis, confirmou_sem_acessorios, confirmou_bexiga_vazia, horario_pesagem, observacoes FROM pesagens ORDER BY horario_pesagem DESC"
    )
  },

  async update(id: number, data: UpdatePesagemDTO): Promise<Pesagem> {
    const fields: string[] = []
    const values: unknown[] = []

    if (data.momento !== undefined) {
      fields.push("momento = ?")
      values.push(data.momento)
    }

    if (data.massa_kg !== undefined) {
      fields.push("massa_kg = ?")
      values.push(data.massa_kg)
    }

    if (data.confirmou_sem_tenis !== undefined) {
      fields.push("confirmou_sem_tenis = ?")
      values.push(data.confirmou_sem_tenis)
    }

    if (data.confirmou_sem_acessorios !== undefined) {
      fields.push("confirmou_sem_acessorios = ?")
      values.push(data.confirmou_sem_acessorios)
    }

    if (data.confirmou_bexiga_vazia !== undefined) {
      fields.push("confirmou_bexiga_vazia = ?")
      values.push(data.confirmou_bexiga_vazia)
    }

    if (data.observacoes !== undefined) {
      fields.push("observacoes = ?")
      values.push(data.observacoes)
    }

    if (fields.length === 0) {
      throw new Error("Nenhum campo para atualizar")
    }

    values.push(id)
    await execute(`UPDATE pesagens SET ${fields.join(", ")} WHERE id_pesagem = ?`, values)

    const updated = await this.findById(id)

    if (!updated) {
      throw new Error("Pesagem não encontrada")
    }

    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM pesagens WHERE id_pesagem = ?", [id])
  }
}
