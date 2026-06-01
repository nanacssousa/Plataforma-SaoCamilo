import pool from '../../shared/infra/database/conexaoDB'
import { AmbienteLeitura, LocalTreino } from './ambienteClimaTypes'

export class AmbienteClimaRepository {
  async salvarLeitura(dados: { id_local?: number | null; id_sessao?: number | null; fonte: 'SENSOR' | 'OPENMETEO' | 'MANUAL'; temperatura_c: number; umidade_pct: number; indice_calor_c?: number | null; pressao_hpa?: number | null; velocidade_vento_ms?: number | null; chuva_mm?: number | null; dispositivo_id?: string | null; }): Promise<number> {
    const [result] = await pool.execute<any>(`INSERT INTO ambiente_leituras (id_local, id_sessao, fonte, temperatura_c, umidade_pct, indice_calor_c, pressao_hpa, velocidade_vento_ms, chuva_mm, dispositivo_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [dados.id_local ?? null, dados.id_sessao ?? null, dados.fonte, dados.temperatura_c, dados.umidade_pct, dados.indice_calor_c ?? null, dados.pressao_hpa ?? null, dados.velocidade_vento_ms ?? null, dados.chuva_mm ?? null, dados.dispositivo_id ?? null]);
    return result.insertId;
  }
  async buscarUltimaLeituraPorLocal(id_local: number): Promise<AmbienteLeitura | null> {
    const [rows] = await pool.execute<any[]>(`SELECT * FROM ambiente_leituras WHERE id_local = ? ORDER BY lido_em DESC LIMIT 1`, [id_local]);
    return rows[0] ?? null;
  }
  async buscarLeituraMaisRecente(): Promise<AmbienteLeitura | null> {
    const [rows] = await pool.execute<any[]>(`SELECT * FROM ambiente_leituras ORDER BY lido_em DESC LIMIT 1`);
    return rows[0] ?? null;
  }
  async listarLocais(): Promise<LocalTreino[]> {
    const [rows] = await pool.execute<any[]>(`SELECT * FROM locais_treino WHERE ativo = 1 ORDER BY nome`);
    return rows;
  }
  async buscarLocalPorId(id_local: number): Promise<LocalTreino | null> {
    const [rows] = await pool.execute<any[]>(`SELECT * FROM locais_treino WHERE id_local = ?`, [id_local]);
    return rows[0] ?? null;
  }
  async historicoLeituras(id_local: number, limite = 20): Promise<AmbienteLeitura[]> {
    const [rows] = await pool.execute<any[]>(`SELECT * FROM ambiente_leituras WHERE id_local = ? ORDER BY lido_em DESC LIMIT ?`, [id_local, limite]);
    return rows;
  }
}
