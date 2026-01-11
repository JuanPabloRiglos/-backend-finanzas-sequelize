import { Router } from 'express';
import { createMasive } from '../controllers/import.masive.controller';

const router = Router();

router.use('/', createMasive);

export default router;
