import { Router } from 'express';
import { createMasive } from '../controllers/import.masive.controller';
import { autenticate } from '../middlewares/authenticate';
const router = Router();

router.use('/', autenticate, createMasive);

export default router;
