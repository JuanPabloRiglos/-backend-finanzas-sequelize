import { z } from 'zod';

import { createVentaSchema } from './venta.dto';
import { createGastoSchema } from './gasto.dto';

export const importJsonSchema = z.object({
  ventas: z.array(createVentaSchema).optional(), //puede venir o no el campo entero.
  gastos: z.array(createGastoSchema).optional(),
});

export type ImportJsonDto = z.infer<typeof importJsonSchema>;
