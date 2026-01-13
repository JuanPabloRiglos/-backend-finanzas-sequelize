import { Router } from 'express';
import { createMasive } from '../controllers/import.masive.controller.js';
import { autenticate } from '../middlewares/authenticate.js';
const router = Router();

router.use('/', autenticate, createMasive);

export default router;
