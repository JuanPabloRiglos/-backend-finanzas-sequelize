export interface GastoAttributesType {
  id: number;
  fecha: Date; // al momento de crear o editar el dto pide string.
  categoria: string;
  monto: number;
  descripcion: string | null;
  usuarioId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type CreateGastoInputType = Omit<
  GastoAttributesType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'usuarioId'
>;

export type UpdateGastoInputType = Partial<GastoAttributesType>; //todos sus campos son opcionales con el partial
