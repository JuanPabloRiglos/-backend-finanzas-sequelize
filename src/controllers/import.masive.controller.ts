import { bulkCreateRegister as bulkCreateVentas } from '../services/ventas.service';
import { bulkCreateRegister as bulkCreateGastos } from '../services/gastos.service';

import { Response, Request, NextFunction } from 'express';
import { respondCreated } from '../utils/apiResponseHelpers';

import {
  gastoDtoToCreateInput,
  ventaDtoToCreateInput,
} from '../utils/dtoMappers';

import { CreateVentaInputType } from '../types/venta.types';
import { CreateGastoInputType } from '../types/gasto.types';
import { ImportJsonDto } from '../dtos/import.masive.dto';

export async function createMasive(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body: ImportJsonDto = req.body;

    const ventasInput: CreateVentaInputType[] =
      body.ventas?.map(ventaDtoToCreateInput) || [];
    const gastosInput: CreateGastoInputType[] =
      body.gastos?.map(gastoDtoToCreateInput) || [];

    //ejecutamos los dos bulk en paralelo
    const [ventasCreadas, gastosCreados] = await Promise.all([
      bulkCreateGastos(gastosInput),
      bulkCreateVentas(ventasInput),
    ]);

    return respondCreated(
      res,
      {
        ventas_creadas: ventasCreadas.length,
        gastos_creados: gastosCreados.length,
        total: ventasCreadas.length + gastosCreados.length,
      },
      'Importación masiva exitosa'
    );
  } catch (error) {
    next(error);
  }
}
