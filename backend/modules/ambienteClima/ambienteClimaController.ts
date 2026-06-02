import { Request, Response } from 'express'
import { AmbienteClimaService } from './ambienteClimaService'
const service = new AmbienteClimaService()

export const ambienteClimaController = {
  async receberSensor(req: Request, res: Response) {
    try {
      const { dispositivo_id, id_local, id_sessao, temperatura_c, umidade_pct, pressao_hpa } = req.body;
      if (temperatura_c === undefined || umidade_pct === undefined || !dispositivo_id) return res.status(400).json({ error: 'dispositivo_id, temperatura_c e umidade_pct são obrigatórios' });
      if (temperatura_c < -50 || temperatura_c > 80) return res.status(400).json({ error: 'temperatura_c fora do intervalo' });
      if (umidade_pct < 0 || umidade_pct > 100) return res.status(400).json({ error: 'umidade_pct deve estar entre 0 e 100' });
      const resultado = await service.registrarLeituraSensor({ dispositivo_id, id_local, id_sessao, temperatura_c: Number(temperatura_c), umidade_pct: Number(umidade_pct), pressao_hpa: pressao_hpa ? Number(pressao_hpa) : undefined });
      return res.status(201).json(resultado);
    } catch (err: any) { return res.status(500).json({ error: err.message }); }
  },
  async buscarAtual(req: Request, res: Response) {
    try {
      const id_local = Number(req.params.id_local);
      if (isNaN(id_local)) return res.status(400).json({ error: 'id_local inválido' });
      return res.json(await service.buscarClimaAtual(id_local));
    } catch (err: any) { return res.status(500).json({ error: err.message }); }
  },
  async buscarMeteo(req: Request, res: Response) {
    try {
      const lat = Number(req.query.lat); const lon = Number(req.query.lon);
      if (isNaN(lat) || isNaN(lon)) return res.status(400).json({ error: 'Parâmetros lat e lon são obrigatórios' });
      return res.json(await service.buscarOpenMeteo(lat, lon));
    } catch (err: any) { return res.status(500).json({ error: err.message }); }
  },
  async listarLocais(_req: Request, res: Response) {
    try { return res.json(await service.listarLocais()); } catch (err: any) { return res.status(500).json({ error: err.message }); }
  },
  async historico(req: Request, res: Response) {
    try {
      const id_local = Number(req.params.id_local); const limite = Number(req.query.limite ?? 20);
      if (isNaN(id_local)) return res.status(400).json({ error: 'id_local inválido' });
      return res.json(await service.historicoLeituras(id_local, limite));
    } catch (err: any) { return res.status(500).json({ error: err.message }); }
  },
}
