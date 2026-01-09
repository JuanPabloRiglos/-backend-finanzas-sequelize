export interface VentaAttributesType {
  id: number;
  fecha: Date; // al momento de crear o editar el dto pide string.
  categoria: string;
  monto: number;
  descripcion: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export type CreateVentaInputType = Omit<
  VentaAttributesType,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export type UpdateVentaInputType = Partial<VentaAttributesType>; //todos sus campos son opcionales con el partial
