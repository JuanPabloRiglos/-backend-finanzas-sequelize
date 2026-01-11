import { Router } from 'express';
import * as DashboardController from '../controllers/dashboard.controller';
const router = Router();

router.use('/line-chart', DashboardController.getLineChartData);

export default router;
