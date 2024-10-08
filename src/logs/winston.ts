import { NextFunction, Request, Response } from "express";

const winston = require('winston');

// Configuration du logger avec Winston
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './src/logs/app.log' })
  ]
});

// Middleware de logging utilisant Winston
export function loggerMiddleWare(req: Request, res: Response, next: NextFunction): void {
  logger.info(`${req.method} ${req.url}`);
  next();
};
