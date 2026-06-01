import puppeteer from "puppeteer"

type StatusHidrico = "desidratado" | "hidratado" | "alerta_leve"

interface AtletaPainel {
  id: string
  nome: string
  posicao: string
  categoria: string
  massaAtual: number
  deltaMassa: number
  usg: number
  statusHidrico: StatusHidrico
}

interface SugestaoPainel {
  id: string
  tipo: "emergencial" | "ajuste"
  titulo: string
  descricao: string
}

function badgeClass(status: StatusHidrico): string {
  const map: Record<StatusHidrico, string> = {
    desidratado: "badge-red",
    hidratado: "badge-green",
    alerta_leve: "badge-yellow",
  }
  return map[status]
}

function badgeLabel(status: StatusHidrico): string {
  const map: Record<StatusHidrico, string> = {
    desidratado: "DESIDRATADO",
    hidratado: "HIDRATADO",
    alerta_leve: "ALERTA LEVE",
  }
  return map[status]
}

export async function gerarPdfPainel(
  periodoInicio: string,
  periodoFim: string,
  atletas: AtletaPainel[],
  sugestoes: SugestaoPainel[]
): Promise<Buffer> {
  const atletasEmRisco = atletas.filter((a) => a.statusHidrico === "desidratado").length
  const pctHidratados = atletas.length
    ? Math.round(
        (atletas.filter((a) => a.statusHidrico === "hidratado").length / atletas.length) * 100
      )
    : 0

  const linhasAtletas = atletas
    .map(
      (a) => `
      <tr>
        <td><strong>${a.nome}</strong></td>
        <td class="col-detalhe">${a.posicao.toUpperCase()} · ${a.categoria.toUpperCase()}</td>
        <td><span class="badge ${badgeClass(a.statusHidrico)}">${badgeLabel(a.statusHidrico)}</span></td>
        <td>${a.massaAtual.toFixed(1)} kg</td>
        <td class="${a.deltaMassa < 0 ? "neg" : "pos"}">${a.deltaMassa >= 0 ? "+" : ""}${a.deltaMassa.toFixed(1)}%</td>
        <td>${a.usg.toFixed(3)}</td>
      </tr>`
    )
    .join("")

  const linhasSugestoes = sugestoes
    .map(
      (s) => `
      <div class="sugestao ${s.tipo === "emergencial" ? "sugestao-emergencial" : "sugestao-ajuste"}">
        <div class="sugestao-icone">${s.tipo === "emergencial" ? "⚠" : "🧪"}</div>
        <div>
          <div class="sugestao-titulo">${s.titulo}</div>
          <div class="sugestao-desc">${s.descricao}</div>
        </div>
      </div>`
    )
    .join("")

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fcf9f5; color: #2c2c2c; padding: 48px; font-size: 13px; }

    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; padding-bottom: 24px; border-bottom: 2px solid #e8e0d4; }
    .logo-top { font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #8b7355; }
    .logo-bottom { font-size: 22px; font-weight: 900; letter-spacing: 4px; color: #2c2c2c; margin-top: 2px; }
    .meta { text-align: right; }
    .meta-titulo { font-size: 16px; font-weight: 700; color: #2c2c2c; margin-bottom: 6px; }
    .meta-sub { font-size: 11px; color: #8b7355; line-height: 1.8; }

    .section-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #8b7355; margin-bottom: 14px; }

    .kpis { display: flex; gap: 16px; margin-bottom: 36px; }
    .kpi { flex: 1; background: white; border: 1px solid #e8e0d4; border-radius: 10px; padding: 20px; }
    .kpi-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: #8b7355; margin-bottom: 10px; text-transform: uppercase; }
    .kpi-num { font-size: 40px; font-weight: 900; line-height: 1; }
    .kpi-sub { font-size: 10px; color: #aaa; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .kpi-risco .kpi-num { color: #c0392b; }
    .kpi-hid .kpi-num { color: #27ae60; }
    .kpi-total .kpi-num { color: #2c2c2c; }

    table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; margin-bottom: 36px; border: 1px solid #e8e0d4; }
    thead tr { background: #f5f0e8; }
    th { padding: 12px 16px; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #8b7355; text-align: left; }
    td { padding: 13px 16px; border-bottom: 1px solid #f0ebe3; }
    tr:last-child td { border-bottom: none; }
    .col-detalhe { color: #8b7355; font-size: 11px; }

    .badge { display: inline-block; padding: 4px 10px; border-radius: 99px; font-size: 10px; font-weight: 700; }
    .badge-red { background: #fde8e8; color: #c0392b; }
    .badge-green { background: #e8f5e9; color: #27ae60; }
    .badge-yellow { background: #fff8e1; color: #e67e22; }

    .neg { color: #c0392b; font-weight: 700; }
    .pos { color: #27ae60; font-weight: 700; }

    .sugestoes { display: flex; flex-direction: column; gap: 12px; margin-bottom: 36px; }
    .sugestao { display: flex; align-items: flex-start; gap: 14px; background: white; border: 1px solid #e8e0d4; border-radius: 10px; padding: 16px; }
    .sugestao-icone { font-size: 20px; min-width: 28px; }
    .sugestao-emergencial { border-left: 4px solid #c0392b; }
    .sugestao-ajuste { border-left: 4px solid #2980b9; }
    .sugestao-titulo { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
    .sugestao-desc { font-size: 12px; color: #666; }

    .footer { display: flex; justify-content: space-between; font-size: 10px; color: #bbb; border-top: 1px solid #e8e0d4; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo-top">CLINICAL</div>
      <div class="logo-bottom">ATHLETE</div>
    </div>
    <div class="meta">
      <div class="meta-titulo">Painel Nutricional — Alta Performance A</div>
      <div class="meta-sub">
        Período: ${periodoInicio} a ${periodoFim}<br>
        Gerado em: ${new Date().toLocaleString("pt-BR")}
      </div>
    </div>
  </div>

  <div class="section-label">Indicadores</div>
  <div class="kpis">
    <div class="kpi kpi-risco">
      <div class="kpi-label">Atletas em Risco</div>
      <div class="kpi-num">${String(atletasEmRisco).padStart(2, "0")}</div>
      <div class="kpi-sub">Desidratação detectada</div>
    </div>
    <div class="kpi kpi-hid">
      <div class="kpi-label">Média de Hidratação</div>
      <div class="kpi-num">${pctHidratados}%</div>
      <div class="kpi-sub">Dentro da meta ideal</div>
    </div>
    <div class="kpi kpi-total">
      <div class="kpi-label">Total de Atletas</div>
      <div class="kpi-num">${atletas.length}</div>
      <div class="kpi-sub">Monitorados no período</div>
    </div>
  </div>

  <div class="section-label">Monitoramento Individual</div>
  <table>
    <thead>
      <tr>
        <th>Atleta</th>
        <th>Posição / Categoria</th>
        <th>Status Hídrico</th>
        <th>Massa Atual</th>
        <th>Δ Massa (%)</th>
        <th>USG (g/mL)</th>
      </tr>
    </thead>
    <tbody>${linhasAtletas}</tbody>
  </table>

  <div class="section-label">Sugestões de Recomposição</div>
  <div class="sugestoes">${linhasSugestoes}</div>

  <div class="footer">
    <span>Clinical Athlete — Sistema de Nutrição Esportiva</span>
    <span>${new Date().toLocaleString("pt-BR")}</span>
  </div>
</body>
</html>`

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "domcontentloaded" })
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
    })
    return Buffer.from(pdfBuffer)
  } finally {
    await browser.close()
  }
}