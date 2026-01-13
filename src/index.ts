import { sequelize } from './config/database.js';
import { app } from './app.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    //probamos conexiona  db
    await sequelize.authenticate();
    console.info('Conectando a la DB');
    //levantamos el server
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error(`Error conectando a Supabse ${error}`);
    process.exit(1);
  }
}

//ejecutamos el server.
startServer();
