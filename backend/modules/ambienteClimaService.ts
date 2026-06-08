import { AmbienteClimaRepository } from './ambienteClima/ambienteClimaRepository';
import { AmbienteAtualDTO, OpenMeteoResponse, SensorPayloadDTO } from './ambienteClima/ambienteClimaTypes';

const repo = new AmbienteClimaRepository()

function calcularIndiceCalor(temp_c: number, umidade: number): number {
  const t = temp_c; const h = umidade;
  if (t < 27) return t;
  const hi = -8.78469475556 + 1.61139411 * t + 2.33854883889 * h - 0.14611605 * t * h - 0.012308094 * t * t - 0.016424828 * h * h + 0.002211732 * t * t * h + 0.00072546 * t * h * h - 0.000003582 * t * t * h * h;
  return Math.round(hi * 100) / 100;
}

function classificarCondicao(indice_calor: number): { condicao: 'CONFORTAVEL' | 'ATENCAO' | 'CRITICO'; descricao: string } {
  if (indice_calor < 27) return { condicao: 'CONFORTAVEL', descricao: 'Condições ideais para treino' };
  if (indice_calor < 32) return { condicao: 'ATENCAO', descricao: 'Calor moderado — hidratação reforçada recomendada' };
  if (indice_calor < 38) return { condicao: 'ATENCAO', descricao: 'Calor intenso — atenção aos sinais de desidratação' };
  return { condicao: 'CRITICO', descricao: 'Risco de exaustão por calor — avaliar suspensão do treino' };
}

export class AmbienteClimaService {
  async registrarLeituraSensor(payload: SensorPayloadDTO): Promise<AmbienteAtualDTO> {
    const indice_calor_c = calcularIndiceCalor(payload.temperatura_c, payload.umidade_pct);
    const { condicao, descricao } = classificarCondicao(indice_calor_c);
    const id_leitura = await repo.salvarLeitura({ id_local: payload.id_local ?? null, id_sessao: payload.id_sessao ?? null, fonte: 'SENSOR', temperatura_c: payload.temperatura_c, umidade_pct: payload.umidade_pct, indice_calor_c, pressao_hpa: payload.pressao_hpa ?? null, dispositivo_id: payload.dispositivo_id });
    return { fonte: 'SENSOR', temperatura_c: payload.temperatura_c, umidade_pct: payload.umidade_pct, indice_calor_c, pressao_hpa: payload.pressao_hpa ?? null, velocidade_vento_ms: null, chuva_mm: null, condicao, descricao_condicao: descricao, lido_em: new Date().toISOString(), id_leitura };
  }

  async buscarOpenMeteo(latitude: number, longitude: number, id_local?: number): Promise<AmbienteAtualDTO> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,precipitation&wind_speed_unit=ms&timezone=America%2FSao_Paulo`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Open-Meteo status ${response.status}`);
    const data: OpenMeteoResponse = await response.json();
    const c = data.current;
    const indice_calor_c = calcularIndiceCalor(c.temperature_2m, c.relative_humidity_2m);
    const { condicao, descricao } = classificarCondicao(indice_calor_c);
    const id_leitura = await repo.salvarLeitura({ id_local: id_local ?? null, fonte: 'OPENMETEO', temperatura_c: c.temperature_2m, umidade_pct: c.relative_humidity_2m, indice_calor_c, pressao_hpa: c.surface_pressure, velocidade_vento_ms: c.wind_speed_10m, chuva_mm: c.precipitation });
    return { fonte: 'OPENMETEO', temperatura_c: c.temperature_2m, umidade_pct: c.relative_humidity_2m, indice_calor_c, pressao_hpa: c.surface_pressure, velocidade_vento_ms: c.wind_speed_10m, chuva_mm: c.precipitation, condicao, descricao_condicao: descricao, lido_em: new Date().toISOString(), id_leitura };
  }

  async buscarOpenMeteoSemSalvar(latitude: number, longitude: number): Promise<AmbienteAtualDTO> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,precipitation&wind_speed_unit=ms&timezone=America%2FSao_Paulo`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Open-Meteo status ${response.status}`);
    const data: OpenMeteoResponse = await response.json();
    const c = data.current;
    const indice_calor_c = calcularIndiceCalor(c.temperature_2m, c.relative_humidity_2m);
    const { condicao, descricao } = classificarCondicao(indice_calor_c);
    return { fonte: 'OPENMETEO', temperatura_c: c.temperature_2m, umidade_pct: c.relative_humidity_2m, indice_calor_c, pressao_hpa: c.surface_pressure, velocidade_vento_ms: c.wind_speed_10m, chuva_mm: c.precipitation, condicao, descricao_condicao: descricao, lido_em: new Date().toISOString(), id_leitura: 0 };
  }

  async buscarClimaAtual(id_local: number): Promise<AmbienteAtualDTO> {
    const local = await repo.buscarLocalPorId(id_local);
    if (!local) throw new Error(`Local ${id_local} não encontrado`);
    const ultimaLeitura = await repo.buscarUltimaLeituraPorLocal(id_local);
    if (ultimaLeitura) {
      const diff = Date.now() - new Date(ultimaLeitura.lido_em).getTime();
      if (diff <= 10 * 60 * 1000) {
        const indice = ultimaLeitura.indice_calor_c ?? calcularIndiceCalor(ultimaLeitura.temperatura_c, ultimaLeitura.umidade_pct);
        const { condicao, descricao } = classificarCondicao(indice);
        return { fonte: ultimaLeitura.fonte, temperatura_c: ultimaLeitura.temperatura_c, umidade_pct: ultimaLeitura.umidade_pct, indice_calor_c: indice, pressao_hpa: ultimaLeitura.pressao_hpa, velocidade_vento_ms: ultimaLeitura.velocidade_vento_ms, chuva_mm: ultimaLeitura.chuva_mm, condicao, descricao_condicao: descricao, lido_em: ultimaLeitura.lido_em, id_leitura: ultimaLeitura.id_leitura };
      }
    }
    if (local.latitude !== null && local.longitude !== null) return this.buscarOpenMeteo(local.latitude, local.longitude, id_local);
    throw new Error(`Sensor offline e local sem coordenadas`);
  }

  async listarLocais() { return repo.listarLocais(); }
  async historicoLeituras(id_local: number, limite = 20) { return repo.historicoLeituras(id_local, limite); }
}
