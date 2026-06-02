import { Router } from 'express'
import { ambienteClimaController } from './ambienteClimaController'
import { authMiddleware } from '../../shared/middlewares/authMiddleware'
const router = Router()
router.post('/sensor', ambienteClimaController.receberSensor)
router.get('/atual/:id_local', authMiddleware, ambienteClimaController.buscarAtual)
router.get('/meteo', authMiddleware, ambienteClimaController.buscarMeteo)
router.get('/locais', authMiddleware, ambienteClimaController.listarLocais)
router.get('/historico/:id_local', authMiddleware, ambienteClimaController.historico)
export { router as ambienteClimaRoutes }
