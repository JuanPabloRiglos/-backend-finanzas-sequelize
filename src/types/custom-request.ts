//Creamos una interface nueva que extiende el resuqes tradicional
// Esto es fundamental para poder sumar el TOKEN al objeto global
//De otra forma, las versiones actuales del stack tirar error y no permiten compilar.

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    rol: 'user' | 'admin';
    iat?: number;
    exp?: number;
  };
}
