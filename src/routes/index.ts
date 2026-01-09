import { Router } from 'express';
import ventasRouter from './ventas.routes';

const router = Router();

router.use('/ventas', ventasRouter);
//mas rutas-> ejemplo gastos

export default router;
