import { Router } from 'express';
//importaciones para validacion de entrada
import { validateSchema } from '../middlewares/validateSchema';
import { autenticate } from '../middlewares/authenticate';
import { createGastoSchema, updateGastoSchema } from '../dtos/gasto.dto';
//importaciones funciones de controllers
import * as GastosController from '../controllers/gastos.controller';

//inciamos el router
const router = Router();

router.post(
  '/',
  autenticate,
  validateSchema(createGastoSchema),
  GastosController.create
);

router.get('/', autenticate, GastosController.getAll);

router.get('/:id', autenticate, GastosController.getById);

router.patch(
  '/:id',
  autenticate,
  validateSchema(updateGastoSchema),
  GastosController.updateById
);

router.delete('/:id', GastosController.deleteForId);

export default router;
