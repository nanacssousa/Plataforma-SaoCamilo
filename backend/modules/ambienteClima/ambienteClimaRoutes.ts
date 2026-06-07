import { Router } from 'express'
import { authMiddleware } from '../../shared/middlewares/authMiddleware'
import { ambienteClimaController } from './ambienteClimaController'
const router = Router()
router.post('/sensor', ambienteClimaController.receberSensor)
router.get('/atual/:id_local', ambienteClimaController.buscarAtual)
router.get('/meteo', authMiddleware, ambienteClimaController.buscarMeteo)
router.get('/locais', authMiddleware, ambienteClimaController.listarLocais)
router.get('/historico/:id_local', authMiddleware, ambienteClimaController.historico)
export { router as ambienteClimaRoutes }
