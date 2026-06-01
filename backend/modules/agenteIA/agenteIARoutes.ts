import { Router } from 'express'
import { agenteIAController } from './agenteIAController'
import { authMiddleware } from '../../shared/middlewares/authMiddleware'
const router = Router()
router.post('/monitor', (req, res, next) => { const secret = req.headers['x-monitor-secret']; if (process.env.MONITOR_SECRET && secret !== process.env.MONITOR_SECRET) return res.status(401).json({ error: 'Não autorizado' }); return next(); }, agenteIAController.monitor)
router.post('/analisar-pre', authMiddleware, agenteIAController.analisarPre)
router.post('/analisar-pos', authMiddleware, agenteIAController.analisarPos)
router.get('/ultima/:id_sessao/:momento', authMiddleware, agenteIAController.buscarUltima)
router.get('/historico/:id_usuario', authMiddleware, agenteIAController.historico)
export { router as agenteIARoutes }
