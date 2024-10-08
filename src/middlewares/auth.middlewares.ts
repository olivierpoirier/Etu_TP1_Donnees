import { NextFunction } from "express";
import { Request, Response } from 'express';
import { config } from "../config/config";
import { UserModel } from "../models/user.model";
import { User } from "../interfaces/user.interface";
import { getDataFromFile } from "../data/apiDataPicker";
import { UserTokenModel } from "../models/userToken.model";
import { logger } from "../logs/winston";



const jwt = require('jsonwebtoken');


// Middleware de vérification du rôle
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {

  //Inspiré de : https://medium.com/@christianinyekaka/building-a-rest-api-with-typescript-express-typeorm-authentication-authorization-and-postgres-e87d07d1af08
  //Pas le choix d'utiliser ce boût de code. Il fait exactement ce qu'on a besoin
  console.log(req.headers);
  const header = req.headers['authorization']?.split(' ')[1];
  console.log(header)
  if (!header) {
    console.log("UNAUTHORISED");
    logger.error(`STATUS 401 : ${req.method} ${req.url}`);
    res.status(401).json({ message: "Unauthorized" });

  } else {
    const token = header
    if (!token) {
      console.log("UNAUTHORISED");
      logger.error(`STATUS 401 : ${req.method} ${req.url}`);
      res.status(401).json({ message: "Unauthorized" });

    } else {
      jwt.verify(token, config.jwtSecret, (err: Error, user: UserModel) => {
        if (err) return res.sendStatus(403);
        logger.error(`STATUS 403 : ${req.method} ${req.url}`);
        next();
      });
    }
  }


}

export function authorizeRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {



    const token = req.headers['authorization']?.split(' ')[1];
    jwt.verify(token, config.jwtSecret, (err: Error, userToken: UserTokenModel) => {
      if (err) {


        console.log(err)
        logger.warn(`STATUS 403 : ${req.method} ${req.url}`);
        res.status(403).json("STATUS 403: USER DON'T HAVE RIGHTS");
      } else {

        console.log(userToken.user.role)
        console.log(role)
        if (role !== userToken.user.role) {
          console.log("403");
          logger.warn(`STATUS 403 : ${req.method} ${req.url}`);
          res.status(403).json("STATUS 403: USER DON'T HAVE RIGHTS");
        } else {
          next();
        }
      }
    });

  };
}