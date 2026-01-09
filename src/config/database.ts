//Configuracion de la instancia, pool Singletone

import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

// delcaracion

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL)
  throw new Error(
    'La variable DATABASE_URL no esta definida en el archivo .env'
  );

//implementacion
export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log, // en produccion poner en false.
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000, // si no se usa, pasados los 10 mata conexion p/ ahorrar recursos.
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Probamos la conexion
