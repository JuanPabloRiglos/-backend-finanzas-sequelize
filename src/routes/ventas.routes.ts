import { Router } from 'express';
//importaciones para validacion de entrada
import { validateSchema } from '../middlewares/validateSchema';
import { autenticate } from '../middlewares/authenticate';
import { createVentaSchema, updateVentaSchema } from '../dtos/venta.dto';
//importaciones funciones de controllers
import * as ventasController from '../controllers/ventas.controller';

//inciamos el router
const router = Router();

router.post(
  '/',
  autenticate,
  validateSchema(createVentaSchema),
  ventasController.create
);

router.get('/', autenticate, ventasController.getAll);

router.get('/:id', autenticate, ventasController.getById);

router.patch(
  '/:id',
  autenticate,
  validateSchema(updateVentaSchema),
  ventasController.updateById
);

router.delete('/:id', autenticate, ventasController.deleteForId);

export default router;
