import { runOne } from "../../shared"
import { calculoHidratacaoRepository } from "./calculoHidratacaoRepository"
import { CalculoHidratacao, CreateCalculoHidratacaoDTO, UpdateCalculoHidratacaoDTO } from "./calculoHidratacaoTypes"

// ─── Tipos auxiliares para buscar dados da sessão ────────────────────────────

interface SessaoComDados {
  id_sessao: number
  duracao_minutos: number | null
  hora_inicio: string
  hora_fim: string | null
}

interface PesagemRow {
  momento: string
  massa_kg: number
}

interface IngestaoRow {
  volume_ml: number
}

// ─── Funções de cálculo ───────────────────────────────────────────────────────

function classificarDesidratacao(pct: number): string {
  if (pct < 1) return "NORMAL"
  if (pct < 2) return "LEVE"
  if (pct < 3) return "MODERADA"
  return "CRITICA"
}

function calcularRiscoHiponatremia(ingestaoML: number, duracaoH: number, taxaSudorese: number): number {
  // Risco quando ingestão supera significativamente a perda por suor
  const taxaIngestao = ingestaoML / 1000 / duracaoH
  return taxaIngestao > taxaSudorese * 1.5 && ingestaoML > 1500 ? 1 : 0
}

// ─── Serviço ──────────────────────────────────────────────────────────────────

export const calculoHidratacaoService = {
  async create(data: CreateCalculoHidratacaoDTO): Promise<CalculoHidratacao> {
    if (!data.id_sessao || !data.nivel_desidratacao) {
      throw new Error("id_sessao e nivel_desidratacao são obrigatórios")
    }
    return calculoHidratacaoRepository.create(data)
  },

  async getById(id: number): Promise<CalculoHidratacao> {
    const calculo = await calculoHidratacaoRepository.findById(id)
    if (!calculo) throw new Error("Cálculo de hidratação não encontrado")
    return calculo
  },

  async getBySessao(id_sessao: number): Promise<CalculoHidratacao> {
    const calculo = await calculoHidratacaoRepository.findBySessao(id_sessao)
    if (!calculo) throw new Error("Cálculo de hidratação não encontrado")
    return calculo
  },

  async getAll(): Promise<CalculoHidratacao[]> {
    return calculoHidratacaoRepository.findAll()
  },

  async update(id: number, data: UpdateCalculoHidratacaoDTO): Promise<CalculoHidratacao> {
    await this.getById(id)
    return calculoHidratacaoRepository.update(id, data)
  },

  async delete(id: number): Promise<void> {
    await this.getById(id)
    return calculoHidratacaoRepository.delete(id)
  },

  /**
   * Calcula automaticamente a hidratação de uma sessão com base nos dados
   * já registrados (pesagens pré/pós e ingestão de fluidos).
   * Se já existe um cálculo para essa sessão, retorna o existente.
   */
  async calcularPorSessao(id_sessao: number): Promise<CalculoHidratacao> {
    // Retorna cálculo existente se já foi feito
    const existente = await calculoHidratacaoRepository.findBySessao(id_sessao)
    if (existente) return existente

    // Busca dados da sessão
    const sessao = await runOne<SessaoComDados>(
      "SELECT id_sessao, duracao_minutos, hora_inicio, hora_fim FROM sessoes_treino WHERE id_sessao = ?",
      [id_sessao]
    )
    if (!sessao) throw new Error(`Sessão ${id_sessao} não encontrada`)

    // Pesagens pré e pós
    const { runQuery } = await import("../../shared")
    const pesagens = await runQuery<PesagemRow>(
      "SELECT momento, massa_kg FROM pesagens WHERE id_sessao = ? ORDER BY registrado_em ASC",
      [id_sessao]
    )

    const pesoPre = pesagens.find(p => p.momento === "PRE")?.massa_kg ?? null
    const pesoPos = pesagens.find(p => p.momento === "POS")?.massa_kg ?? null

    if (pesoPre === null || pesoPos === null) {
      throw new Error("Pesagens pré e pós-sessão não encontradas para calcular hidratação")
    }

    // Total ingerido
    const fluidos = await runQuery<IngestaoRow>(
      "SELECT volume_ml FROM ingestao_fluido WHERE id_sessao = ?",
      [id_sessao]
    )
    const totalIngestaoML = fluidos.reduce((sum, f) => sum + f.volume_ml, 0)

    // Duração
    let duracaoH = (sessao.duracao_minutos ?? 60) / 60
    if (duracaoH <= 0) {
      const inicio = new Date(`1970-01-01T${sessao.hora_inicio}`)
      const fim = sessao.hora_fim ? new Date(`1970-01-01T${sessao.hora_fim}`) : new Date()
      duracaoH = Math.max(0.1, (fim.getTime() - inicio.getTime()) / 3600000)
    }

    // Cálculos
    const variacaoKg = Math.max(0, pesoPre - pesoPos)
    const perdaPercentual = parseFloat(((variacaoKg / pesoPre) * 100).toFixed(2))
    const taxaSudorese = parseFloat(((variacaoKg * 1000 + totalIngestaoML) / (duracaoH * 1000)).toFixed(3))
    const balancoHidrico = totalIngestaoML - variacaoKg * 1000
    const nivelDesidratacao = classificarDesidratacao(perdaPercentual)
    const riscoHiponatremia = calcularRiscoHiponatremia(totalIngestaoML, duracaoH, taxaSudorese)
    const recomendacaoReposicao = Math.round(variacaoKg * 1500) // 150% do peso perdido

    return calculoHidratacaoRepository.create({
      id_sessao,
      massa_pre_kg: pesoPre,
      massa_pos_kg: pesoPos,
      total_ingestao_ml: totalIngestaoML,
      total_urinario_ml: 0,
      duracao_horas: parseFloat(duracaoH.toFixed(3)),
      variacao_massa_kg: variacaoKg,
      perda_percentual_massa: perdaPercentual,
      taxa_sudorese_lh: taxaSudorese,
      balanco_hidrico_ml: balancoHidrico,
      nivel_desidratacao: nivelDesidratacao,
      risco_hiponatremia: riscoHiponatremia,
      recomendacao_reposicao_ml: recomendacaoReposicao,
      versao_algoritmo: "2.0",
    })
  },
}