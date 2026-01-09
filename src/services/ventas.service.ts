import { Venta } from '../models/venta.model';

import {
  CreateVentaInputType,
  UpdateVentaInputType,
} from '../types/venta.types';
import createHttpError from 'http-errors';

//Funciones que conectan el controller con el modelo -> Db

// ===============================GET ALL==============================
export async function getAllRegisters(filters?: {
  period?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  fecha_especifica?: string;
}) {
  const whereCluase: any = {}; //no me gusta el nmbre, que significa??

  if (filters?.fecha_especifica) {
    whereCluase.fecha = fecha_especifica;
  } else if (filters?.period === 'mes') {
    whereCluase.fecha = {
      [Op.gte]: startOfMonth(new Date()),
      [Op.lte]: endOfMonth(new Date()), // no entiendo nada de estos Op??
    };
  }

  if (filters?.fecha_desde && filters?.fecha_hasta) {
    whereCluase.fecha = {
      [Op.between]: [filters.fecha_desde, filters.fecha_hasta], //esto sobreescribe el objeto qu ehicimos mas arriba con un parametro en el medio? no entiendo que queda guardado
    };
  }
  //que pasa si tenemos fechas especificas?

  return await Venta.findAll({ where: whereCluase });
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
