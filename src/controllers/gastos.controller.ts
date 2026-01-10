//importamos typados
import { Request, Response, NextFunction } from 'express';

import {
  respondCreated,
  respondNoContent,
  respondOk,
} from '../utils/apiResponseHelpers';

//funciones del Servicio
import * as Service from '../services/gastos.service';

//Typado. Necesitamos trbajar el tipo de dato entre capas
import {
  CreateGastoInputType,
  UpdateGastoInputType,
} from '../types/gasto.types';
import { CreateGastoDto, UpdateGastoDto } from '../dtos/gasto.dto';
//funciones de transformacion de tipo.
import {
  gastoDtoToCreateInput,
  gastoDtoToUpdateInput,
} from '../utils/dtoMappers';

//--------------------------CREATE--------------------------------------------------------------
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body: CreateGastoDto = req.body;
    const typedDto: CreateGastoInputType = gastoDtoToCreateInput(body);
    const data = await Service.createRegister(typedDto);
    return respondCreated(res, data, 'Gasto creado con exito');
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
    const body: UpdateGastoDto = req.body;
    const typedDto: UpdateGastoInputType = gastoDtoToUpdateInput(body);
    const data = await Service.updateRegister(id, typedDto);
    return respondOk(res, data, 'Gasto actualizado');
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
