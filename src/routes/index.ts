import { Router } from 'express';
import ventasRouter from './ventas.routes';
import gastoRouter from './gastos.routes';
const router = Router();

router.use('/ventas', ventasRouter);
router.use('/gastos', gastoRouter);
//mas rutas-> ejemplo gastos

export default router;
