import express, { Request, Response } from 'express';
import productRoutes from '../src/routes/product.route';
import userRoutes from '../src/routes/user.route';
import { fetchProdData, getDataFromFile } from './data/apiDataPicker';
import { config } from './config/config';
import { errorMiddleWaresHandler } from './middlewares/error.middlewares';
import { logger, loggerMiddleWare } from './logs/winston';
import { connectToMongoDatabase, populateMongoDatabase } from './data/databaseMongo';
//import './src/types/requestTypes.d.ts';


//npx ts-node-dev --ignore-watch data src/index.ts
const app = express();
const port = config.port;
const https = require('https');
const fs = require('fs')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Définir les options de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TP1 API',
      version: '1.0.0',
      description: 'An API to guide you in this website',
    },
  },
  apis: ['./src/routes/*.ts'], // Fichier où les routes de l'API sont définies
};

// Générer la documentation à partir des options
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Servir la documentation Swagger via '/api-docs'
app.use('/v1/api/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};



app.use(loggerMiddleWare);

app.use('/', productRoutes);

app.use('/', userRoutes);

app.use(errorMiddleWaresHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript with Express!');
});


if(config.nodeEnv === "prod") {
  // Démarrer le serveur prod
   app.listen(port, async () => {
    await connectToMongoDatabase(config.DB_PROD_URI)
    populateMongoDatabase()
    console.log("Serveur prod démarré");
    console.log(`Serveur en écoute sur <http://localhost>:${port}`);
  });
} else {
  https.createServer(options, app).listen(port, () => {
    //fetchProdData(config.pathDatabaseProducts);
    console.log("Serveur test démarré");
    console.log(`Server is running on port ${port}`);
  });
}

