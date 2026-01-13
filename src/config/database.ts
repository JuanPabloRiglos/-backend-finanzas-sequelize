//Configuracion de la instancia, pool Singletone

import dotenv from 'dotenv';
// Solo cargar dotenv en desarrollo (en producción Render inyecta las variables)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

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
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
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
