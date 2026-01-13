import express, { Application } from 'express';
//importaciones internas
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

export const app: Application = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use('/api', routes);

//Manejo de errores.
app.use(errorHandler);
