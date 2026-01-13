import { sequelize } from '../config/database';

//El tipado para el modelo se maneja con Squelize y su libreria
//Evitando coliciones con typescrip en campos automaticos

import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

//Declaracion la Clase Gastos como Modelo --------------------
export class Gasto extends Model<
  InferAttributes<Gasto, { omit: 'createdAt' | 'updatedAt' | 'deletedAt' }>,
  InferCreationAttributes<
    Gasto,
    { omit: 'createdAt' | 'updatedAt' | 'deletedAt' }
  >
> {
  //campos de logica del negocio
  declare id: CreationOptional<number>;
  //campos tambien validados por zod dto
  declare fecha: Date;
  declare categoria: string;
  declare monto: number;
  declare descripcion: string | null;
  declare usuarioId: number;
  // Timestamps (solo los maneja Sequelize)
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;
}

Gasto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
  },
  {
    //segundo parametro -> opciones
    sequelize,
    tableName: 'gastos',
    timestamps: true, //meneja de forma automatica los cmapos de createdAt, y updatedAt
    underscored: true, // convierte a snake_case para nombres de columnas
    paranoid: true, // Solo si tenemos columna deleted_at, maneja el soft delete de forma autoamica
  }
);

// init()
//   - Es un método estático de la clase Model
//   - Registra el modelo en la instancia de Sequelize
//   - Define las columnas, tipos, opciones
//   - Crea la conexión entre la clase y la tabla
