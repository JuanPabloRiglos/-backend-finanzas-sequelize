import { z } from 'zod';

export const createVentaSchema = z.object({
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe ser formatoYYYY-MM-DD'),
  categoria: z
    .string()
    .min(2, 'Categoría es requerida')
    .max(100, 'Categoría muy larga'),
  monto: z.number().positive('Monto debe ser positivo'),
  descripcion: z.string().nullable().optional(),
});

export const updateVentaSchema = createVentaSchema.partial();

// Tipo TypeScript inferido del schema
export type CreateVentaDto = z.infer<typeof createVentaSchema>;
export type UpdateVentaDto = z.infer<typeof updateVentaSchema>;
