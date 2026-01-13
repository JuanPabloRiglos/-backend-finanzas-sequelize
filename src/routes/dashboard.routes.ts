import { Router } from 'express';
import * as DashboardController from '../controllers/dashboard.controller.js';
import { autenticate } from '../middlewares/authenticate.js';
const router = Router();

router.use('/line-chart', autenticate, DashboardController.getLineChartData);

export default router;
