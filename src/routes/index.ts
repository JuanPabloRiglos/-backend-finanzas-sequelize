import { Router } from 'express';
import ventasRouter from './ventas.routes.js';
import gastoRouter from './gastos.routes.js';
import dashboardRouter from './dashboard.routes.js';
import importMasiveRouter from './import.masive.routes.js';
const router = Router();

router.use('/ventas', ventasRouter);
router.use('/gastos', gastoRouter);
router.use('/dashboard', dashboardRouter);
router.use('/import-json', importMasiveRouter);

//mas rutas-> ejemplo gastos

export default router;
