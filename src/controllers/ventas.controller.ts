//importamos typados
import { Request, Response, NextFunction } from 'express';

import {
  respondCreated,
  respondNoContent,
  respondOk,
} from '../utils/apiResponseHelpers';

//funciones del Servicio
import * as Service from '../services/ventas.service';

//Typado. Necesitamos trbajar el tipo de dato entre capas
import {
  CreateVentaInputType,
  UpdateVentaInputType,
} from '../types/venta.types';
import { CreateVentaDto, UpdateVentaDto } from '../dtos/venta.dto';
//funciones de transformacion de tipo.
import {
  ventaDtoToCreateInput,
  ventaDtoToUpdateInput,
} from '../utils/dtoMappers';

//--------------------------CREATE--------------------------------------------------------------
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body: CreateVentaDto = req.body;
    const typedDto: CreateVentaInputType = ventaDtoToCreateInput(body);
    const data = await Service.createRegister(typedDto);
    return respondCreated(res, data, 'Venta creada con exito');
  } catch (error) {
    next(error);
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
    next(error);
  }
}

//--------------------------GET FOR ID--------------------------------------------------------------
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id: number = Number(req.params.id);
    const data = await Service.getRegisterById(id);
    return respondOk(res, data, 'peticion realizada con exito');
  } catch (error) {
    next(error);
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
    next(error);
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
    next(error);
  }
}
