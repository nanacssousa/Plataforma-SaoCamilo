// src/services/pdfService.ts
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export interface AtletaPDF {
  nome: string;
  posicao: string;
  categoria: string;
  massaAtual: number;
  deltaMassa: number;
  usg: number;
  statusHidrico: "desidratado" | "hidratado" | "alerta_leve";
}

function statusInfo(s: AtletaPDF["statusHidrico"]) {
  if (s === "desidratado")
    return { label: "DESIDRATADO", cor: "#b91c1c", bg: "#fef2f2" };
  if (s === "alerta_leve")
    return { label: "ALERTA LEVE", cor: "#b45309", bg: "#fffbeb" };
  return { label: "HIDRATADO", cor: "#166534", bg: "#f0fdf4" };
}

function interpretarUSG(usg: number): string {
  if (usg < 1.01) return "Hiper-hidratado";
  if (usg < 1.02) return "Hidratacao adequada";
  if (usg < 1.025) return "Desidratacao leve";
  return "Desidratacao severa";
}

function interpretarDelta(delta: number): string {
  if (delta >= 0) return "Sem perda de massa";
  if (delta >= -1) return "Perda aceitavel";
  if (delta >= -2) return "Atencao necessaria";
  return "Estado critico";
}

function buildHtml(
  atletas: AtletaPDF[],
  titulo: string,
  mediaHidratacao: number,
): string {
  const data = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const hora = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const total = atletas.length;
  const hidratados = atletas.filter(
    (a) => a.statusHidrico === "hidratado",
  ).length;
  const alertas = atletas.filter(
    (a) => a.statusHidrico === "alerta_leve",
  ).length;
  const desidratados = atletas.filter(
    (a) => a.statusHidrico === "desidratado",
  ).length;

  const linhas = atletas
    .map((a) => {
      const st = statusInfo(a.statusHidrico);
      const deltaStr =
        (a.deltaMassa >= 0 ? "+" : "") + a.deltaMassa.toFixed(1) + "%";
      const deltaColor =
        a.deltaMassa >= -1
          ? "#166534"
          : a.deltaMassa >= -2
            ? "#b45309"
            : "#b91c1c";
      const iniciais = a.nome
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      return `<tr>
      <td class="td-atleta">
        <div class="row-atleta">
          <div class="avatar">${iniciais}</div>
          <div>
            <div class="atleta-nome">${a.nome}</div>
            <div class="atleta-sub">${a.posicao.toUpperCase()} · ${a.categoria.toUpperCase()}</div>
          </div>
        </div>
      </td>
      <td class="td-center">
        <span class="badge" style="background:${st.bg};color:${st.cor};">${st.label}</span>
      </td>
      <td class="td-center td-valor">${a.massaAtual > 0 ? a.massaAtual.toFixed(1) + " kg" : "—"}</td>
      <td class="td-center">
        <span class="td-valor" style="color:${deltaColor};">${deltaStr}</span>
        <div class="td-interp">${interpretarDelta(a.deltaMassa)}</div>
      </td>
      <td class="td-center">
        <span class="td-valor">${a.usg.toFixed(3)}</span>
        <div class="td-interp">${interpretarUSG(a.usg)}</div>
      </td>
    </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Helvetica, Arial, sans-serif; background: #f9fafb; padding: 28px; color: #111827; }
  .cabecalho { background: #fff; border-left: 5px solid #8f000a; border-radius: 8px; padding: 16px 20px; margin-bottom: 18px; }
  .marca { font-size: 9px; font-weight: 700; letter-spacing: 2px; color: #8f000a; text-transform: uppercase; margin-bottom: 4px; }
  .titulo { font-size: 20px; font-weight: 800; color: #111827; }
  .subtitulo { font-size: 11px; color: #6b7280; margin-top: 3px; }
  .data-hora { font-size: 10px; color: #9ca3af; margin-top: 8px; }
  .kpis { display: flex; gap: 10px; margin-bottom: 18px; }
  .kpi { flex: 1; background: #fff; border-radius: 8px; border: 1px solid #e5e7eb; padding: 12px 8px; text-align: center; }
  .kpi-num { font-size: 24px; font-weight: 800; }
  .kpi-label { font-size: 9px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3px; }
  .ref { background: #fff; border-radius: 8px; border: 1px solid #e5e7eb; padding: 12px 14px; margin-bottom: 18px; }
  .ref-titulo { font-size: 9px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .ref-itens { display: flex; flex-wrap: wrap; gap: 5px; }
  .ref-item { font-size: 9px; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
  .secao { font-size: 9px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
  thead { background: #8f000a; }
  thead th { color: #fff; font-size: 9px; font-weight: 700; letter-spacing: 1px; padding: 10px 12px; text-align: center; }
  thead th:first-child { text-align: left; }
  tbody tr { border-bottom: 1px solid #f3f4f6; }
  tbody tr:last-child { border-bottom: none; }
  .td-atleta { padding: 10px 12px; }
  .td-center { padding: 10px 12px; text-align: center; vertical-align: middle; }
  .td-valor { font-size: 13px; font-weight: 700; color: #111827; }
  .td-interp { font-size: 9px; color: #9ca3af; margin-top: 2px; }
  .row-atleta { display: flex; align-items: center; gap: 8px; }
  .avatar { width: 30px; height: 30px; border-radius: 6px; background: #8f000a; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; flex-shrink: 0; }
  .atleta-nome { font-size: 13px; font-weight: 700; color: #111827; }
  .atleta-sub { font-size: 10px; color: #6b7280; margin-top: 1px; }
  .badge { padding: 3px 9px; border-radius: 12px; font-size: 9px; font-weight: 700; }
  .rodape { margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 9px; color: #9ca3af; }
</style>
</head>
<body>

<div class="cabecalho">
  <div class="marca">Clinical Athlete</div>
  <div class="titulo">${titulo}</div>
  <div class="subtitulo">Monitoramento de Hidratacao e Composicao Corporal</div>
  <div class="data-hora">Gerado em ${data} as ${hora}</div>
</div>

<div class="kpis">
  <div class="kpi"><div class="kpi-num" style="color:#111827;">${total}</div><div class="kpi-label">Atletas</div></div>
  <div class="kpi"><div class="kpi-num" style="color:#166534;">${hidratados}</div><div class="kpi-label">Hidratados</div></div>
  <div class="kpi"><div class="kpi-num" style="color:#b45309;">${alertas}</div><div class="kpi-label">Em Alerta</div></div>
  <div class="kpi"><div class="kpi-num" style="color:#b91c1c;">${desidratados}</div><div class="kpi-label">Desidratados</div></div>
  <div class="kpi"><div class="kpi-num" style="color:#8f000a;">${mediaHidratacao}%</div><div class="kpi-label">Media Hidrica</div></div>
</div>

<div class="ref">
  <div class="ref-titulo">Referencia USG Urinaria</div>
  <div class="ref-itens">
    <div class="ref-item" style="background:#f0fdf4;color:#166534;">&lt; 1.010 — Hiper-hidratado</div>
    <div class="ref-item" style="background:#f0fdf4;color:#166534;">1.010 – 1.019 — Adequado</div>
    <div class="ref-item" style="background:#fffbeb;color:#b45309;">1.020 – 1.024 — Desid. leve</div>
    <div class="ref-item" style="background:#fef2f2;color:#b91c1c;">>= 1.025 — Desid. severa</div>
  </div>
</div>

<div class="secao">Dados Individuais dos Atletas</div>

<table>
  <thead>
    <tr>
      <th style="text-align:left;">ATLETA</th>
      <th>STATUS HIDRICO</th>
      <th>MASSA CORPORAL</th>
      <th>VARIACAO DE MASSA</th>
      <th>USG URINARIA</th>
    </tr>
  </thead>
  <tbody>${linhas}</tbody>
</table>

<div class="rodape">
  <span>Uso exclusivo da equipe tecnica — Clinical Athlete</span>
  <span>${data} · ${hora}</span>
</div>

</body>
</html>`;
}

export async function gerarECompartilharPDF(
  atletas: AtletaPDF[],
  titulo: string,
  subtitulo: string,
  mediaHidratacao: number,
): Promise<void> {
  const html = buildHtml(atletas, titulo, mediaHidratacao);

  const { uri } = await Print.printToFileAsync({ html });

  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    dialogTitle: "Relatorio de Hidratacao",
    UTI: "com.adobe.pdf",
  });
}
