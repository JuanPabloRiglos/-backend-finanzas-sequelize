import { Request, Response, NextFunction } from 'express';

import * as Service from '../services/dashboard.service.js';
import { respondOk } from '../utils/apiResponseHelpers.js';

//--------------------------GET ALL--------------------------------------------------------------
export async function getLineChartData(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await Service.getLineChartData();

    return respondOk(res, data, 'peticion realizada con exito');
  } catch (error) {
    return next(error);
  }
}
