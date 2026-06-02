//Comentario
import Anthropic from '@anthropic-ai/sdk'
import pool from '../../shared/infra/database/conexaoDB'
import { AgenteIAContrato, AnaliseIAResponse, ContextoAnalise } from './agenteIATypes'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `# ROLE E CONTEXTO
Você é o Core de Inteligência Artificial e Especialista em Fisiologia do Exercício da "Plataforma São Camilo". Seu papel é atuar em background como um agente supervisor analítico e preditivo. Você monitora a saúde, o estresse térmico e o nível de desidratação de atletas de alta performance.

# SUSTENTÁCULO DE ENTRADA (DADOS FORNECIDOS A CADA REQUISIÇÃO)
A cada 5 minutos, o backend enviará um payload contendo:
1. Dados Ambientais Atuais (Temperatura em °C, Umidade Relativa do Ar em %).
2. Perfil do Atleta (Idade, Peso Inicial, Histórico de Desidratação, Modalidade Esportiva).
3. Dados da Sessão Atual (Tempo decorrido de treino, volume de água já ingerido até o momento).

# REGRAS DE NEGÓCIO E DIRETRIZES DE AUTONOMIA
Você deve processar os dados acima seguindo estritamente estes parâmetros científicos:
1. Cálculo de Hidratação Autônomo: Estipule de forma autônoma a quantidade exata de água/fluidos (em mililitros) que o atleta deve consumir nos próximos blocos de treino. Baseie-se no perfil do atleta e no desgaste gerado pelo clima. Não dependa de fórmulas fixas do backend.
2. Impacto da Umidade: Lembre-se de que a umidade relativa do ar acima de 70% prejudica a evaporação do suor, limitando a capacidade termorreguladora do corpo e aumentando drasticamente o risco de intermação.
3. Avaliação de Zona de Risco: Determine se o atleta está em zona de "NORMALIDADE" ou "PERIGO/ALERTA" (risco de choque térmico, cãibras severas ou desidratação crônica).

# DIRETRIZES DE SEGURANÇA
- Suas saídas textuais devem ser diretas, clínicas e limpas, prontas para serem exibidas em uma Notificação Push. Evite saudações ou explicações prolixas.
- Você DEVE responder ÚNICA e EXCLUSIVAMENTE no formato JSON estruturado abaixo. Qualquer caractere fora do JSON quebrará o parser do backend.

# CONTRATO DE SAÍDA (FORMATO JSON OBRIGATÓRIO)
{
  "status_sessao": "STATUS_AQUI",
  "disparar_alerta_push": true_ou_false,
  "mensagem_notificacao": "Texto curto e direto para a notificação push do atleta/staff",
  "recomendacao_hidratacao_ml": 0,
  "analise_clinica_comentario": "Seu comentário técnico e analítico detalhado sobre as métricas e o impacto do clima no atleta"
}
- Em "status_sessao", use apenas: "ESTÁVEL", "ATENÇÃO" ou "CRÍTICO".
- Em "disparar_alerta_push", defina true apenas se houver necessidade de intervenção imediata. Caso contrário, defina false.
- Em "recomendacao_hidratacao_ml", insira apenas o número inteiro representando os mLs calculados por você.
- Não inclua nada fora do JSON. Sem markdown, sem texto antes ou depois.`

function montarPromptMonitor(ctx: ContextoAnalise): string {
  const { atleta, sessao, clima, historico_recente } = ctx;
  return `MONITORAMENTO CONTÍNUO — CICLO DE 5 MINUTOS\n\nATLETA:\n- Nome: ${atleta.nome} | Idade: ${atleta.idade} anos\n- Peso inicial: ${atleta.peso_kg} kg | Modalidade: ${atleta.modalidade}\n- Histórico desidratação médio: ${atleta.historico_desidratacao_pct?.toFixed(1) ?? 'sem dados'}%\n\nSESSÃO EM ANDAMENTO:\n- Exercício: ${sessao.tipo_exercicio} | Intensidade: ${sessao.intensidade}\n- Tempo decorrido: ${sessao.tempo_decorrido_min} min\n- Água já ingerida: ${sessao.agua_ingerida_ml} mL\n\nDADOS AMBIENTAIS ATUAIS:\n- Temperatura: ${clima.temperatura_c}°C\n- Umidade relativa: ${clima.umidade_pct}%${clima.umidade_pct > 70 ? ' ⚠️ ACIMA DE 70% — evaporação comprometida' : ''}\n- Índice de calor: ${clima.indice_calor_c}°C\n- Condição: ${clima.condicao}\n\n${historico_recente ? `HISTÓRICO:\n- Média taxa sudorese: ${historico_recente.media_taxa_sudorese.toFixed(2)} L/h\n- Média desidratação: ${historico_recente.media_desidratacao_pct.toFixed(1)}%` : ''}\n\nCalcule de forma autônoma o volume de fluidos para os próximos blocos. Avalie a zona de risco atual.`;
}

function montarPromptPre(ctx: ContextoAnalise): string {
  const { atleta, sessao, clima, pre_sessao, historico_recente } = ctx;
  return `ANÁLISE PRÉ-SESSÃO\n\nATLETA:\n- Nome: ${atleta.nome} | Idade: ${atleta.idade} anos\n- Peso: ${atleta.peso_kg} kg | Altura: ${atleta.altura_cm} cm\n- Modalidade: ${atleta.modalidade} | Nível: ${atleta.nivel}\n${atleta.condicao_medica ? `- Condição médica: ${atleta.condicao_medica}` : ''}\n\nSESSÃO PLANEJADA:\n- Exercício: ${sessao.tipo_exercicio} | Intensidade: ${sessao.intensidade}\n- Duração estimada: ${sessao.duracao_minutos ?? 'não informada'} min\n\nDADOS AMBIENTAIS:\n- Temperatura: ${clima.temperatura_c}°C\n- Umidade: ${clima.umidade_pct}%${clima.umidade_pct > 70 ? ' ⚠️ ACIMA DE 70%' : ''}\n- Índice de calor: ${clima.indice_calor_c}°C\n\n${pre_sessao ? `ESTADO DO ATLETA:\n- Peso pré: ${pre_sessao.peso_pre_kg} kg\n- Cor da urina (1-6): ${pre_sessao.cor_urina_escala}\n- Sintomas: ${pre_sessao.sintomas.length > 0 ? pre_sessao.sintomas.join(', ') : 'nenhum'}\n- Nível de sede (1-10): ${pre_sessao.nivel_sede}` : ''}\n\n${historico_recente ? `HISTÓRICO:\n- Média taxa sudorese: ${historico_recente.media_taxa_sudorese.toFixed(2)} L/h\n- Média desidratação: ${historico_recente.media_desidratacao_pct.toFixed(1)}%` : ''}\n\nCalcule o volume de fluidos recomendado para os primeiros blocos de treino.`;
}

function montarPromptPos(ctx: ContextoAnalise): string {
  const { atleta, sessao, clima, pos_sessao } = ctx;
  return `ANÁLISE PÓS-SESSÃO\n\nATLETA: ${atleta.nome} | Peso inicial: ${atleta.peso_kg} kg\nSESSÃO: ${sessao.tipo_exercicio} | ${sessao.intensidade} | ${sessao.duracao_minutos ?? '?'} min\n\nCLIMA:\n- Temperatura: ${clima.temperatura_c}°C | Umidade: ${clima.umidade_pct}%\n- Índice de calor: ${clima.indice_calor_c}°C\n\n${pos_sessao ? `RESULTADOS:\n- Peso pós: ${pos_sessao.peso_pos_kg} kg\n- Variação de massa: ${pos_sessao.variacao_massa_pct.toFixed(2)}%\n- Taxa de sudorese: ${pos_sessao.taxa_sudorese_lh.toFixed(2)} L/h\n- Total ingerido: ${pos_sessao.total_ingestao_ml} mL\n- Nível de desidratação: ${pos_sessao.nivel_desidratacao}` : ''}\n\nCalcule o volume de reposição necessário nas próximas horas.`;
}

export class AgenteIAService {
  async analisar(contexto: ContextoAnalise, momento: 'PRE' | 'POS' | 'MONITOR' | 'ALERTA', id_sessao: number, id_usuario: number, id_leitura_ambiente: number | null): Promise<AnaliseIAResponse> {
    const userPrompt = momento === 'PRE' ? montarPromptPre(contexto) : momento === 'POS' ? montarPromptPos(contexto) : montarPromptMonitor(contexto);
    const message = await anthropic.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 1024, system: SYSTEM_PROMPT, messages: [{ role: 'user', content: userPrompt }] });
    const rawText = message.content.filter((b) => b.type === 'text').map((b) => (b as any).text).join('');
    let parsed: AgenteIAContrato;
    try {
      parsed = JSON.parse(rawText);
      if (!['ESTÁVEL', 'ATENÇÃO', 'CRÍTICO'].includes(parsed.status_sessao)) parsed.status_sessao = 'ATENÇÃO';
      parsed.disparar_alerta_push = Boolean(parsed.disparar_alerta_push);
      parsed.recomendacao_hidratacao_ml = Math.round(Number(parsed.recomendacao_hidratacao_ml) || 0);
    } catch {
      parsed = { status_sessao: 'ATENÇÃO', disparar_alerta_push: false, mensagem_notificacao: 'Mantenha a hidratação regular durante o treino.', recomendacao_hidratacao_ml: 300, analise_clinica_comentario: rawText };
    }
    await pool.execute(`INSERT INTO ia_analises (id_sessao, id_usuario, id_leitura_ambiente, momento, modelo_ia, prompt_tokens, output_tokens, status_sessao, disparar_alerta_push, mensagem_notificacao, recomendacao_hidratacao_ml, analise_clinica_comentario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [id_sessao, id_usuario, id_leitura_ambiente, momento, 'claude-sonnet-4-20250514', message.usage.input_tokens, message.usage.output_tokens, parsed.status_sessao, parsed.disparar_alerta_push ? 1 : 0, parsed.mensagem_notificacao, parsed.recomendacao_hidratacao_ml, parsed.analise_clinica_comentario]);
    if (parsed.disparar_alerta_push) {
      await pool.execute(`INSERT INTO alertas (id_usuario, id_sessao, tipo_alerta, mensagem, nivel_urgencia) VALUES (?, ?, 'SUPORTE_TECNICO', ?, ?)`, [id_usuario, id_sessao, parsed.mensagem_notificacao, parsed.status_sessao === 'CRÍTICO' ? 'CRITICO' : 'URGENTE']).catch(() => {});
    }
    return { ...parsed, prompt_tokens: message.usage.input_tokens, output_tokens: message.usage.output_tokens };
  }

  async buscarUltimaAnalise(id_sessao: number, momento: 'PRE' | 'POS' | 'MONITOR' | 'ALERTA') {
    const [rows] = await pool.execute<any[]>(`SELECT * FROM ia_analises WHERE id_sessao = ? AND momento = ? ORDER BY criado_em DESC LIMIT 1`, [id_sessao, momento]);
    return rows[0] ?? null;
  }

  async historicoAnalises(id_usuario: number, limite = 10) {
    const [rows] = await pool.execute<any[]>(`SELECT ia.*, s.data_treino, s.intensidade FROM ia_analises ia JOIN sessoes_treino s ON s.id_sessao = ia.id_sessao WHERE ia.id_usuario = ? ORDER BY ia.criado_em DESC LIMIT ?`, [id_usuario, limite]);
    return rows;
  }
}
