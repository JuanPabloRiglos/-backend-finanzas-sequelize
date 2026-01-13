//importaciones de tipo para middwr.
import { Response, Request, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import createHttpError from 'http-errors';

//Middleware factory
//schema como parametro, retorna el middleware.
export const validateSchema = (schema: z.ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      //shcema.parse compara el schema contra el body.
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        //Armamos el detalle del error de zod para nuestro handler
        const details: Record<string, string> = {};

        error.issues.forEach(issue => {
          const path = issue.path.join('.');
          details[path] = issue.message;
        });

        const validationError = createHttpError(400, 'Errores de validacion', {
          details,
        });
        next(validationError);
      } else {
        next(error);
      }
    }
  };
};

//Estructura de ZodError:
//   {
//     issues: [
//       {
//         path: ['monto'],
//         message: 'Expected number, received string'
//       },
//       {
//         path: ['fecha'],
//         message: 'Invalid date format'
//       }
//     ]
//   }
