// src/config/config.ts
import dotenv from 'dotenv';

// Charger les variables d'environnement à partir du fichier .env
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'secret_par_defaut_pour_les_sessions',
  jwtSecret: process.env.JWT_SECRET || 'AKJHGSDHJKSA_KS',
  databaseFetchUrl: process.env.DATABASE_FETCH_URL || 'https://fakestoreapi.com/products',
  pathDatabaseProducts: process.env.PATH_DATABASE_PRODUCTS || './src/data/products.json',
  pathDatabaseUsers: process.env.PATH_DATABASE_USERS || './src/data/users.json',
  nodeEnv: process.env.NODE_ENV || 'production',
  isProduction: process.env.NODE_ENV === 'production',
};