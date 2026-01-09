import { Response } from 'express';

//tipado
interface SuccessResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const respondOk = (
  res: Response,
  data: any = null,
  message: string = 'Operacion exitosa'
): Response<SuccessResponse> => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

export const respondCreated = (
  res: Response,
  data: any,
  message: string = 'Recurso creado con exito'
): Response<SuccessResponse> => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

export const respondNoContent = (res: Response): Response => {
  return res.status(204).send();
};
