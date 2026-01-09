import { sequelize } from '../config/database';
import { DataTypes, Model } from 'sequelize';

//importaciones de Types
import {
  CreateVentaInputType,
  VentaAttributesType,
} from '../types/venta.types';

//Declaracion la Clase Ventas como Modelo --------------------

export class Venta
  extends Model<VentaAttributesType, CreateVentaInputType>
  implements VentaAttributesType
{
  //campos de logica del negocio
  public id!: number;
  //campos validados por zod dto
  public fecha!: Date;
  public categoria!: string;
  public monto!: number;
  public descripcion!: string | null;
  // Timestamps (readonly porque solo los maneja Sequelize)
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Venta.init(
  {
    id: {
      type: DataTypes.NUMBER,
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    //segundo parametro -> opciones
    sequelize,
    tableName: 'ventas',
    timestamps: true,
    underscored: true, // Usa snake_case para nombres de columnas
    paranoid: true, // Solo si tenemos columna deleted_at
  }
);

//   - Es un método estático de la clase Model
//   - Registra el modelo en la instancia de Sequelize
//   - Define las columnas, tipos, opciones
//   - Crea la conexión entre la clase y la tabla
