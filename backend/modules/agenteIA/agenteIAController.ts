//Comentario
import { Request, Response } from 'express'
import pool from '../../shared/infra/database/conexaoDB'
import { AmbienteClimaService } from '../ambienteClima/ambienteClimaService'
import { AgenteIAService } from './agenteIAService'
import { ContextoAnalise } from './agenteIATypes'

const agente = new AgenteIAService()
const climaService = new AmbienteClimaService()

async function montarContexto(id_usuario: number, id_sessao: number, id_local?: number, overrideClima?: { temperatura_c: number; umidade_pct: number }): Promise<{ contexto: ContextoAnalise; id_leitura_ambiente: number | null }> {
  const [atletaRows] = await pool.execute<any[]>(`SELECT u.nome_completo, u.data_nascimento, pa.modalidade, pa.nivel, pa.altura_cm, pa.peso_habitual_kg, pa.condicao_medica FROM usuarios u LEFT JOIN perfis_atleticos pa ON pa.id_usuario = u.id_usuario WHERE u.id_usuario = ?`, [id_usuario]);
  const a = atletaRows[0]; if (!a) throw new Error('Atleta não encontrado');
  const idade = a.data_nascimento ? Math.floor((Date.now() - new Date(a.data_nascimento).getTime()) / (365.25 * 24 * 3600 * 1000)) : 25;
  const [sessaoRows] = await pool.execute<any[]>(`SELECT s.intensidade, s.duracao_minutos, s.local_treino, s.hora_inicio, te.nome AS tipo_exercicio FROM sessoes_treino s JOIN tipos_exercicio te ON te.id_tipo_exercicio = s.id_tipo_exercicio WHERE s.id_sessao = ?`, [id_sessao]);
  const s = sessaoRows[0]; if (!s) throw new Error('Sessão não encontrada');
  const horaInicio = s.hora_inicio ? new Date(`1970-01-01T${s.hora_inicio}Z`).getTime() : Date.now();
  const agora = new Date(); const horaAgoraMs = (agora.getUTCHours() * 3600 + agora.getUTCMinutes() * 60 + agora.getUTCSeconds()) * 1000;
  const tempoDecorridoMin = Math.max(0, Math.round((horaAgoraMs - horaInicio) / 60000));
  const [aguaRows] = await pool.execute<any[]>(`SELECT COALESCE(SUM(volume_ml), 0) AS total FROM ingestao_fluidos WHERE id_sessao = ? AND momento = 'DURANTE'`, [id_sessao]);
  const aguaIngeridaMl = Number(aguaRows[0]?.total ?? 0);

  let clima: ContextoAnalise['clima']; let id_leitura_ambiente: number | null = null;
  if (overrideClima) {
    clima = { temperatura_c: overrideClima.temperatura_c, umidade_pct: overrideClima.umidade_pct, indice_calor_c: overrideClima.temperatura_c, condicao: overrideClima.umidade_pct > 70 || overrideClima.temperatura_c > 32 ? 'ATENCAO' : 'CONFORTAVEL', fonte: 'SENSOR' };
  } else {
    try {
      const climaAtual = id_local ? await climaService.buscarClimaAtual(id_local) : await climaService.buscarOpenMeteo(-23.548943, -46.638818);
      clima = { temperatura_c: climaAtual.temperatura_c, umidade_pct: climaAtual.umidade_pct, indice_calor_c: climaAtual.indice_calor_c, condicao: climaAtual.condicao, fonte: climaAtual.fonte };
      id_leitura_ambiente = climaAtual.id_leitura;
    } catch { clima = { temperatura_c: 25, umidade_pct: 60, indice_calor_c: 25, condicao: 'CONFORTAVEL', fonte: 'MANUAL' }; }
  }
  if (!id_leitura_ambiente) { const [leitRows] = await pool.execute<any[]>(`SELECT id_leitura FROM ambiente_leituras ORDER BY lido_em DESC LIMIT 1`); id_leitura_ambiente = leitRows[0]?.id_leitura ?? null; }

  const [histRows] = await pool.execute<any[]>(`SELECT AVG(c.taxa_sudorese_lh) AS media_taxa, AVG(c.perda_percentual_massa) AS media_desid, COUNT(*) AS total FROM calculos_hidratacao c JOIN sessoes_treino st ON st.id_sessao = c.id_sessao WHERE st.id_usuario = ? LIMIT 10`, [id_usuario]);
  const h = histRows[0];

  const contexto: ContextoAnalise = {
    atleta: { nome: a.nome_completo, idade, peso_kg: a.peso_habitual_kg ?? 70, altura_cm: a.altura_cm ?? 170, modalidade: a.modalidade ?? 'Futebol', nivel: a.nivel ?? 'PROFISSIONAL', condicao_medica: a.condicao_medica, historico_desidratacao_pct: h?.total > 0 ? Number(h.media_desid ?? 0) : null },
    sessao: { intensidade: s.intensidade, duracao_minutos: s.duracao_minutos, tempo_decorrido_min: tempoDecorridoMin, tipo_exercicio: s.tipo_exercicio, local_treino: s.local_treino, agua_ingerida_ml: aguaIngeridaMl },
    clima,
    historico_recente: h?.total > 0 ? { media_taxa_sudorese: Number(h.media_taxa ?? 0), media_desidratacao_pct: Number(h.media_desid ?? 0), total_sessoes: Number(h.total) } : undefined,
  };
  return { contexto, id_leitura_ambiente };
}

export const agenteIAController = {
  async monitor(req: Request, res: Response) {
    try {
      const { id_sessao, id_usuario, id_local, temperatura_c, umidade_pct } = req.body;
      if (!id_sessao || !id_usuario) return res.status(400).json({ error: 'id_sessao e id_usuario são obrigatórios' });
      const overrideClima = (temperatura_c !== undefined && umidade_pct !== undefined) ? { temperatura_c: Number(temperatura_c), umidade_pct: Number(umidade_pct) } : undefined;
      const { contexto, id_leitura_ambiente } = await montarContexto(id_usuario, id_sessao, id_local, overrideClima);
      return res.json(await agente.analisar(contexto, 'MONITOR', id_sessao, id_usuario, id_leitura_ambiente));
    } catch (err: any) { console.error('[AgenteIA] monitor:', err.message); return res.status(500).json({ error: err.message }); }
  },
  async analisarPre(req: Request, res: Response) {
    try {
      const { id_sessao, id_usuario, id_local, peso_pre_kg, cor_urina, sintomas, nivel_sede } = req.body;
      if (!id_sessao || !id_usuario) return res.status(400).json({ error: 'id_sessao e id_usuario são obrigatórios' });
      const { contexto, id_leitura_ambiente } = await montarContexto(id_usuario, id_sessao, id_local);
      contexto.pre_sessao = peso_pre_kg ? { peso_pre_kg: Number(peso_pre_kg), cor_urina_escala: Number(cor_urina ?? 2), sintomas: Array.isArray(sintomas) ? sintomas : [], nivel_sede: Number(nivel_sede ?? 3) } : undefined;
      return res.json(await agente.analisar(contexto, 'PRE', id_sessao, id_usuario, id_leitura_ambiente));
    } catch (err: any) { console.error('[AgenteIA] pre:', err.message); return res.status(500).json({ error: err.message }); }
  },
  async analisarPos(req: Request, res: Response) {
    try {
      const { id_sessao, id_usuario, id_local } = req.body;
      if (!id_sessao || !id_usuario) return res.status(400).json({ error: 'id_sessao e id_usuario são obrigatórios' });
      const { contexto, id_leitura_ambiente } = await montarContexto(id_usuario, id_sessao, id_local);
      const [calcRows] = await pool.execute<any[]>(`SELECT c.*, p_pos.massa_kg AS peso_pos, rc.escala_cor AS cor_urina_pos FROM calculos_hidratacao c LEFT JOIN pesagens p_pos ON p_pos.id_sessao = c.id_sessao AND p_pos.momento = 'POS' LEFT JOIN registros_cor_urina rc ON rc.id_sessao = c.id_sessao AND rc.momento = 'POS' WHERE c.id_sessao = ? ORDER BY c.calculado_em DESC LIMIT 1`, [id_sessao]);
      const calc = calcRows[0];
      contexto.pos_sessao = calc ? { peso_pos_kg: Number(calc.massa_pos_kg), variacao_massa_pct: Number(calc.perda_percentual_massa), taxa_sudorese_lh: Number(calc.taxa_sudorese_lh), total_ingestao_ml: Number(calc.total_ingestao_ml), nivel_desidratacao: calc.nivel_desidratacao, cor_urina_pos: calc.cor_urina_pos ?? null } : undefined;
      return res.json(await agente.analisar(contexto, 'POS', id_sessao, id_usuario, id_leitura_ambiente));
    } catch (err: any) { console.error('[AgenteIA] pos:', err.message); return res.status(500).json({ error: err.message }); }
  },
  async buscarUltima(req: Request, res: Response) {
    try {
      const { id_sessao, momento } = req.params;
      const analise = await agente.buscarUltimaAnalise(Number(id_sessao), momento as 'PRE' | 'POS' | 'MONITOR' | 'ALERTA');
      if (!analise) return res.status(404).json({ error: 'Análise não encontrada' });
      return res.json(analise);
    } catch (err: any) { return res.status(500).json({ error: err.message }); }
  },
  async historico(req: Request, res: Response) {
    try {
      const { id_usuario } = req.params; const limite = Number(req.query.limite ?? 10);
      return res.json(await agente.historicoAnalises(Number(id_usuario), limite));
    } catch (err: any) { return res.status(500).json({ error: err.message }); }
  },
}
