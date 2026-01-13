import { bulkCreateRegister as bulkCreateVentas } from '../services/ventas.service.js';
import { bulkCreateRegister as bulkCreateGastos } from '../services/gastos.service.js';

import { Response, Request, NextFunction } from 'express';
import { respondCreated } from '../utils/apiResponseHelpers.js';

import {
  gastoDtoToCreateInput,
  ventaDtoToCreateInput,
} from '../utils/dtoMappers.js';

import { CreateVentaInputType } from '../types/venta.types.js';
import { CreateGastoInputType } from '../types/gasto.types.js';
import { ImportJsonDto } from '../dtos/import.masive.dto.js';
import { AuthenticatedRequest } from '../types/custom-request.js';

export async function createMasive(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = req as AuthenticatedRequest;
    const body: ImportJsonDto = req.body;

    const ventasInput: (CreateVentaInputType & { usuarioId: number })[] =
      body.ventas?.map(venta => {
        const typedDto = ventaDtoToCreateInput(venta);
        return { ...typedDto, usuarioId: user.id };
      }) || [];
    const gastosInput: (CreateGastoInputType & { usuarioId: number })[] =
      body.gastos?.map(gasto => {
        const typedDto = gastoDtoToCreateInput(gasto);
        return { ...typedDto, usuarioId: user.id };
      }) || [];

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
    return next(error);
  }
}
