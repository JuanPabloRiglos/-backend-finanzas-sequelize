export interface VentaAttributesType {
  id: number;
  fecha: Date; // al momento de crear o editar el dto pide string.
  categoria: string;
  monto: number;
  descripcion: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type CreateVentaInputType = Omit<
  VentaAttributesType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type UpdateVentaInputType = Partial<VentaAttributesType>; //todos sus campos son opcionales con el partial
