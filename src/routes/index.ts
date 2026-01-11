import { Router } from 'express';
import ventasRouter from './ventas.routes';
import gastoRouter from './gastos.routes';
import dashboardRouter from './dashboard.routes';
import importMasiveRouter from './import.masive.routes';
const router = Router();

router.use('/ventas', ventasRouter);
router.use('/gastos', gastoRouter);
router.use('/dashboard', dashboardRouter);
router.use('/import-json', importMasiveRouter);

//mas rutas-> ejemplo gastos

export default router;
