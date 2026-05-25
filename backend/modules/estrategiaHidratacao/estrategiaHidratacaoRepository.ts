import { execute, runOne, runQuery } from "../../shared"
import { CreateEstrategiaHidratacaoDTO, EstrategiaHidratacao, UpdateEstrategiaHidratacaoDTO } from "./estrategiaHidratacaoTypes"

export const estrategiaHidratacaoRepository = {
  async create(data: CreateEstrategiaHidratacaoDTO): Promise<EstrategiaHidratacao> {
    const result = await execute("INSERT INTO estrategias_hidratacao (id_nutricionista, id_atleta, titulo, descricao, volume_pre_ml, volume_durante_ml_h, volume_pos_ml, tipo_fluido_recom, eletrólitos_recom, valida_ate, ativa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [data.id_nutricionista, data.id_atleta, data.titulo, data.descricao, data.volume_pre_ml ?? null, data.volume_durante_ml_h ?? null, data.volume_pos_ml ?? null, data.tipo_fluido_recom ?? null, data.eletrólitos_recom ?? null, data.valida_ate ?? null, data.ativa ?? 1])
    const created = await runOne<EstrategiaHidratacao>("SELECT id_estrategia, id_nutricionista, id_atleta, titulo, descricao, volume_pre_ml, volume_durante_ml_h, volume_pos_ml, tipo_fluido_recom, eletrólitos_recom, valida_ate, ativa, criado_em, atualizado_em FROM estrategias_hidratacao WHERE id_estrategia = ?", [result.insertId])
    if (!created) { throw new Error("Não foi possível criar a estratégia de hidratação") }
    return created
  },

  async findById(id: number): Promise<EstrategiaHidratacao | undefined> {
    return runOne<EstrategiaHidratacao>("SELECT id_estrategia, id_nutricionista, id_atleta, titulo, descricao, volume_pre_ml, volume_durante_ml_h, volume_pos_ml, tipo_fluido_recom, eletrólitos_recom, valida_ate, ativa, criado_em, atualizado_em FROM estrategias_hidratacao WHERE id_estrategia = ?", [id])
  },

  async findByAtleta(id_atleta: number): Promise<EstrategiaHidratacao[]> {
    return runQuery<EstrategiaHidratacao>("SELECT id_estrategia, id_nutricionista, id_atleta, titulo, descricao, volume_pre_ml, volume_durante_ml_h, volume_pos_ml, tipo_fluido_recom, eletrólitos_recom, valida_ate, ativa, criado_em, atualizado_em FROM estrategias_hidratacao WHERE id_atleta = ? ORDER BY criado_em DESC", [id_atleta])
  },

  async findByNutricionista(id_nutricionista: number): Promise<EstrategiaHidratacao[]> {
    return runQuery<EstrategiaHidratacao>("SELECT id_estrategia, id_nutricionista, id_atleta, titulo, descricao, volume_pre_ml, volume_durante_ml_h, volume_pos_ml, tipo_fluido_recom, eletrólitos_recom, valida_ate, ativa, criado_em, atualizado_em FROM estrategias_hidratacao WHERE id_nutricionista = ? ORDER BY criado_em DESC", [id_nutricionista])
  },

  async findAll(): Promise<EstrategiaHidratacao[]> {
    return runQuery<EstrategiaHidratacao>("SELECT id_estrategia, id_nutricionista, id_atleta, titulo, descricao, volume_pre_ml, volume_durante_ml_h, volume_pos_ml, tipo_fluido_recom, eletrólitos_recom, valida_ate, ativa, criado_em, atualizado_em FROM estrategias_hidratacao ORDER BY criado_em DESC")
  },

  async update(id: number, data: UpdateEstrategiaHidratacaoDTO): Promise<EstrategiaHidratacao> {
    const fields: string[] = []
    const values: unknown[] = []
    if (data.titulo !== undefined) { fields.push("titulo = ?"); values.push(data.titulo) }
    if (data.descricao !== undefined) { fields.push("descricao = ?"); values.push(data.descricao) }
    if (data.volume_pre_ml !== undefined) { fields.push("volume_pre_ml = ?"); values.push(data.volume_pre_ml) }
    if (data.volume_durante_ml_h !== undefined) { fields.push("volume_durante_ml_h = ?"); values.push(data.volume_durante_ml_h) }
    if (data.volume_pos_ml !== undefined) { fields.push("volume_pos_ml = ?"); values.push(data.volume_pos_ml) }
    if (data.tipo_fluido_recom !== undefined) { fields.push("tipo_fluido_recom = ?"); values.push(data.tipo_fluido_recom) }
    if (data.eletrólitos_recom !== undefined) { fields.push("eletrólitos_recom = ?"); values.push(data.eletrólitos_recom) }
    if (data.valida_ate !== undefined) { fields.push("valida_ate = ?"); values.push(data.valida_ate) }
    if (data.ativa !== undefined) { fields.push("ativa = ?"); values.push(data.ativa) }
    if (fields.length === 0) { throw new Error("Nenhum campo para atualizar") }
    values.push(id)
    await execute("UPDATE estrategias_hidratacao SET " + fields.join(", ") + " WHERE id_estrategia = ?", values)
    const updated = await this.findById(id)
    if (!updated) { throw new Error("Estratégia não encontrada") }
    return updated
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM estrategias_hidratacao WHERE id_estrategia = ?", [id])
  }
}