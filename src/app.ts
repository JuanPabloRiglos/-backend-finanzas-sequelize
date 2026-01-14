import express, { Application } from 'express';
import cors from 'cors';
//importaciones internas
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

const allowwedOrigin = process.env.ALLOWED_ORIGINS?.split(',') || [];

export const app: Application = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowwedOrigin.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('No permitido por Cors'));
      }
    },
    credentials: true,
  })
);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use('/api', routes);

//Manejo de errores.
app.use(errorHandler);
