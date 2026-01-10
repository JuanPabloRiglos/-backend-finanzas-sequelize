import { Router } from 'express';
//importaciones para validacion de entrada
import { validateSchema } from '../middlewares/validateSchema';
import { createGastoSchema, updateGastoSchema } from '../dtos/gasto.dto';
//importaciones funciones de controllers
import * as GastosController from '../controllers/gastos.controller';

//inciamos el router
const router = Router();

router.post('/', validateSchema(createGastoSchema), GastosController.create);

router.get('/', GastosController.getAll);

router.get('/:id', GastosController.getById);

router.patch(
  '/:id',
  validateSchema(updateGastoSchema),
  GastosController.updateById
);

router.delete('/:id', GastosController.deleteForId);

export default router;
