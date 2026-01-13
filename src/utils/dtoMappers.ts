import { CreateVentaDto, UpdateVentaDto } from '../dtos/venta.dto.js';
import {
  CreateVentaInputType,
  UpdateVentaInputType,
} from '../types/venta.types.js';

import { CreateGastoDto, UpdateGastoDto } from '../dtos/gasto.dto.js';

import {
  CreateGastoInputType,
  UpdateGastoInputType,
} from '../types/gasto.types.js';

export function ventaDtoToCreateInput(
  dto: CreateVentaDto
): CreateVentaInputType {
  return {
    fecha: new Date(dto.fecha),
    categoria: dto.categoria,
    monto: dto.monto,
    descripcion: dto.descripcion ?? null,
  };
}

export function ventaDtoToUpdateInput(
  dto: UpdateVentaDto
): UpdateVentaInputType {
  const input: UpdateVentaInputType = {};
  if (dto.fecha) input.fecha = new Date(dto.fecha);
  if (dto.categoria) input.categoria = dto.categoria;
  if (dto.monto) input.monto = dto.monto;
  if (dto.descripcion !== undefined)
    input.descripcion = dto.descripcion ?? null;
  return input;
}

//============================================================= Mappers para la tabla Gastos

export function gastoDtoToCreateInput(
  dto: CreateGastoDto
): CreateGastoInputType {
  return {
    fecha: new Date(dto.fecha),
    categoria: dto.categoria,
    monto: dto.monto,
    descripcion: dto.descripcion ?? null,
  };
}

export function gastoDtoToUpdateInput(
  dto: UpdateGastoDto
): UpdateGastoInputType {
  const input: UpdateGastoInputType = {};
  if (dto.fecha) input.fecha = new Date(dto.fecha);
  if (dto.categoria) input.categoria = dto.categoria;
  if (dto.monto) input.monto = dto.monto;
  if (dto.descripcion !== undefined)
    input.descripcion = dto.descripcion ?? null;
  return input;
}
