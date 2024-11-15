import express, { Request, Response } from 'express';
import productRoutes from '../src/routes/product.route';
import userRoutes from '../src/routes/user.route';
import mongoProductRoutes from '../src/routes/product.routeV2';
import mongoUserRoutes from '../src/routes/user.routeV2';
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

app.use('/v1/', productRoutes);

app.use('/v1/', userRoutes);

app.use('/v2/', mongoProductRoutes);

app.use('/v2/', mongoUserRoutes);

app.use(errorMiddleWaresHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript with Express!');
});


if(config.nodeEnv === "prod") {
  // Démarrer le serveur prod
   app.listen(port, async () => {
    await connectToMongoDatabase(config.DB_PROD_URI)
    populateMongoDatabase()
    console.log("Serveur prod started");
    console.log(`Server is running on port http://localhost:${port}`);
  });
} else if (config.nodeEnv === "test"){
  https.createServer(options, app).listen(port, async () => {
    //fetchProdData(config.pathDatabaseProducts);
    await connectToMongoDatabase(config.DB_TEST_URI)
    populateMongoDatabase()
    console.log("Serveur test started");
    console.log(`Server is running on port https://localhost:${port}`);
  });
} else if (config.nodeEnv === "dev") {
  https.createServer(options, app).listen(port, async () => {
    await connectToMongoDatabase(config.DB_PROD_URI)
    populateMongoDatabase()
    console.log("Serveur dev started");
    console.log(`Server is running on port https://localhost:${port}`);
  });
}

