import { z } from 'zod';

import { createVentaSchema } from './venta.dto.js';
import { createGastoSchema } from './gasto.dto.js';

export const importJsonSchema = z.object({
  ventas: z.array(createVentaSchema).optional(), //puede venir o no el campo entero.
  gastos: z.array(createGastoSchema).optional(),
});

export type ImportJsonDto = z.infer<typeof importJsonSchema>;
