import { Router } from 'express';
import * as DashboardController from '../controllers/dashboard.controller';
import { autenticate } from '../middlewares/authenticate';
const router = Router();

router.use('/line-chart', autenticate, DashboardController.getLineChartData);

export default router;
