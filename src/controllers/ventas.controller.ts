//importamos typados
import { Request, Response, NextFunction } from 'express';

import {
  respondCreated,
  respondNoContent,
  respondOk,
} from '../utils/apiResponseHelpers.js';

//funciones del Servicio
import * as Service from '../services/ventas.service.js';

//Typado. Necesitamos trbajar el tipo de dato entre capas
import {
  CreateVentaInputType,
  UpdateVentaInputType,
} from '../types/venta.types.js';
import { CreateVentaDto, UpdateVentaDto } from '../dtos/venta.dto.js';

//funciones de transformacion de tipo.
import {
  ventaDtoToCreateInput,
  ventaDtoToUpdateInput,
} from '../utils/dtoMappers.js';
import { AuthenticatedRequest } from '../types/custom-request.js';

//--------------------------CREATE--------------------------------------------------------------
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req as AuthenticatedRequest;
    const body: CreateVentaDto = req.body;
    const typedDto: CreateVentaInputType = ventaDtoToCreateInput(body);
    const data = await Service.createRegister({
      ...typedDto,
      usuarioId: user.id,
    });
    return respondCreated(res, data, 'Venta creada con exito');
  } catch (error) {
    return next(error);
  }
}

//--------------------------GET ALL--------------------------------------------------------------
export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { periodo, fecha_desde, fecha_hasta } = req.query;

    let filters = undefined;

    if (periodo || fecha_desde || fecha_hasta) {
      filters = {
        periodo: periodo as string | undefined,
        fecha_desde: fecha_desde as string | undefined,
        fecha_hasta: fecha_hasta as string | undefined,
      };
    }

    const data = await Service.getAllRegisters(filters);

    return respondOk(res, data, 'peticion realizada con exito');
  } catch (error) {
    return next(error);
  }
}

//--------------------------GET FOR ID--------------------------------------------------------------
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id: number = Number(req.params.id);
    const data = await Service.getRegisterById(id);
    return respondOk(res, data, 'peticion realizada con exito');
  } catch (error) {
    return next(error);
  }
}

//--------------------------UPDATE FOR ID--------------------------------------------------------------
export async function updateById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id: number = Number(req.params.id);
    const body: UpdateVentaDto = req.body;
    const typedDto: UpdateVentaInputType = ventaDtoToUpdateInput(body);
    const data = await Service.updateRegister(id, typedDto);
    return respondOk(res, data, 'Venta actualizada');
  } catch (error) {
    return next(error);
  }
}

//--------------------------DELETE FOR ID--------------------------------------------------------------
export async function deleteForId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id: number = Number(req.params.id);
    await Service.deleteRegister(id);
    return respondNoContent(res);
  } catch (error) {
    return next(error);
  }
}
