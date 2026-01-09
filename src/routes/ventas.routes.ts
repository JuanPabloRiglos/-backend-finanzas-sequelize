import { Router } from 'express';
//importaciones para validacion de entrada
import { validateSchema } from '../middlewares/validateSchema';
import { createVentaSchema, updateVentaSchema } from '../dtos/venta.dto';
//importaciones funciones de controllers
import * as ventasController from '../controllers/ventas.controller';

//inciamos el router
const router = Router();

router.post('/', validateSchema(createVentaSchema), ventasController.create);

router.get('/', ventasController.getAll);

router.get('/:id', ventasController.getById);

router.patch(
  '/:id',
  validateSchema(updateVentaSchema),
  ventasController.updateById
);

router.delete('/:id', ventasController.deleteForId);

export default router;
