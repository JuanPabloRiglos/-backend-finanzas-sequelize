import { Response, Request, NextFunction } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

//importacion del Request Custom por falla de globla con Typescript
import { AuthenticatedRequest } from '../types/custom-request.js';

export function autenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw createHttpError(401, 'Token no proporcionado');

    if (!authHeader.startsWith('Bearer '))
      // deberia llegar con este formato: 'Bearer tokenfirmadoporjwt'
      throw createHttpError(401, 'Formato de token inválido');

    const token = authHeader.split(' ')[1];
    if (!token) throw createHttpError(401, 'Token no proporcionado');

    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) throw new Error('JWT_SECRET no está configurado');

    const decoded = jwt.verify(token, jwt_secret);

    (req as AuthenticatedRequest).user =
      decoded as AuthenticatedRequest['user'];

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(createHttpError(401, 'Token inválido'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Token expirado'));
    }

    // Otros errores
    next(error);
  }
}
