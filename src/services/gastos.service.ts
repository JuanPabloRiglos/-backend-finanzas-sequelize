//librerias de terceros
import createHttpError from 'http-errors';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';

import { Op } from 'sequelize';

//importaciones propias
import { Gasto } from '../models/gasto.model.js';

import {
  CreateGastoInputType,
  UpdateGastoInputType,
} from '../types/gasto.types.js';

//Funciones que conectan el controller con el modelo -> Db

// ===============================GET ALL==============================
export async function getAllRegisters(
  filters?:
    | {
        periodo?: string;
        fecha_desde?: string;
        fecha_hasta?: string;
      }
    | undefined
) {
  let whereClause: any = {};

  if (filters?.fecha_desde && filters.fecha_hasta) {
    whereClause.fecha = {
      [Op.between]: [filters.fecha_desde, filters.fecha_hasta],
    };
  } else if (filters?.periodo) {
    let today = new Date();
    switch (filters.periodo) {
      case 'hoy':
        whereClause.fecha = {
          [Op.gte]: startOfDay(today),
          [Op.lte]: endOfDay(today),
        };
        break;
      case 'semana':
        whereClause.fecha = {
          [Op.gte]: startOfWeek(today),
          [Op.lte]: endOfWeek(today),
        };
        break;
      case 'mes':
        whereClause.fecha = {
          [Op.gte]: startOfMonth(today),
          [Op.lte]: endOfMonth(today),
        };
        break;
      case 'anual':
        whereClause.fecha = {
          [Op.gte]: startOfYear(today),
          [Op.lte]: endOfYear(today),
        };
        break;
    }
  }
  // La clausula where, sera undefined, o tendra el valor como por ejemplo:
  //  [Op.between]: ['2025-01-01', '2025-01-31'],
  // que se traduce a sql como algo asi : WHERE fecha BETWEEN '2025-01-01' AND '2025-01-31'
  return await Gasto.findAll({ where: whereClause });
}

// ===============================CREATE==============================
export async function createRegister(
  typedDto: CreateGastoInputType & { usuarioId: number }
) {
  return await Gasto.create(typedDto);
}

// ===============================CREATE MASIVE==============================
export async function bulkCreateRegister(
  gastos: (CreateGastoInputType & { usuarioId: number })[]
) {
  if (gastos.length === 0) return [];
  return await Gasto.bulkCreate(gastos);
}

// ===============================GET BY ID==============================
export async function getRegisterById(id: number) {
  const gasto = await Gasto.findByPk(id);

  if (!gasto) {
    throw createHttpError(404, `Gasto con id ${id} no fue encontrada`);
  }
  return gasto;
}

// ===============================UPDATE==============================
export async function updateRegister(
  id: number,
  typedDto: UpdateGastoInputType
) {
  const gasto = await getRegisterById(id);
  return await gasto.update(typedDto);
}

// ===============================DELETE==============================
export async function deleteRegister(id: number) {
  const gasto = await getRegisterById(id);
  return await gasto.destroy(); //el paranoic true, hace que sea borrado logico
}
