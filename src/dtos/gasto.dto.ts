import { z } from 'zod';

export const createGastoSchema = z.object({
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe ser formato YYYY-MM-DD'),
  categoria: z
    .string()
    .min(2, 'Categoría es requerida')
    .max(100, 'Categoría muy larga'),
  monto: z.number().positive('Monto debe ser positivo'),
  descripcion: z.string().nullable().optional(),
});

export const updateGastoSchema = createGastoSchema.partial();

// Tipo TypeScript inferido del schema
export type CreateGastoDto = z.infer<typeof createGastoSchema>;
export type UpdateGastoDto = z.infer<typeof updateGastoSchema>;
