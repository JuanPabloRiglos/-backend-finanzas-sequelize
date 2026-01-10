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
import { Venta } from '../models/venta.model';

import {
  CreateVentaInputType,
  UpdateVentaInputType,
} from '../types/venta.types';

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
  return await Venta.findAll({ where: whereClause });
}

// ===============================CREATE==============================
export async function createRegister(typedDto: CreateVentaInputType) {
  return await Venta.create(typedDto);
}

// ===============================GET BY ID==============================
export async function getRegisterById(id: number) {
  const venta = await Venta.findByPk(id);

  if (!venta) {
    throw createHttpError(404, `Venta con id ${id} no fue encontrada`);
  }
  return venta;
}

// ===============================UPDATE==============================
export async function updateRegister(
  id: number,
  typedDto: UpdateVentaInputType
) {
  const venta = await getRegisterById(id);
  return await venta.update(typedDto);
}

// ===============================DELETE==============================
export async function deleteRegister(id: number) {
  const venta = await getRegisterById(id);
  return await venta.destroy(); //el paranoic true, hace que sea borrado logico
}
