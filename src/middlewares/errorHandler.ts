import { Request, Response, NextFunction } from 'express'; //types
import { HttpError } from 'http-errors';

// Funcion loggin visual
const logError = (error: any, req: Request) => {
  const isDev = process.env.NODE_ENV === 'development';
  console.error('\n' + '='.repeat(60));
  console.error('🔴 ERROR:', error.status || 500, error.name || 'Error');
  console.error('📍 Path:', req.method, req.path);
  console.error('💬 Message:', error.message);
  console.error('🕒 Timestamp:', new Date().toISOString());

  if (error.details) {
    console.error('📦 Details:', JSON.stringify(error.details, null, 2));
  }

  if (isDev && error.stack) {
    console.error('📚 Stack:\n', error.stack);
  }

  console.error('='.repeat(60) + '\n');
};

// Middleware principal
export const errorHandler = (
  err: Error | HttpError | any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || err.statusCode || 500;
  // err.status → Errores de http-errors (ej: createError(404))
  // err.statusCode → Algunos errores de librerías usan statusCode
  // 500 → Default si no tiene ninguno (error desconocido)
  const errorName = err.name || 'Error';
  const message = err.message || 'Error interno del servidor';
  const details = err.details || undefined;
  logError(
    { status, name: errorName, message, details, stack: err.stack },
    req
  );

  //Construir respuesta JSON
  const errorResponse: any = {
    success: false,
    status,
    error: errorName,
    message,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  if (details) {
    //si esxisten, se agrega
    errorResponse.details = details;
  }

  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorResponse.stack = err.stack;
  }

  res.status(status).json(errorResponse);
};
