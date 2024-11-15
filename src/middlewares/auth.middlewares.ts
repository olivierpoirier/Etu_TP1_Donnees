import { NextFunction } from "express";
import { Request, Response } from 'express';
import { config } from "../config/config";
import { UserModel } from "../models/user.model";
import { UserTokenModel } from "../models/userToken.model";
import { logger } from "../logs/winston";



const jwt = require('jsonwebtoken');


// Middleware de vérification du rôle
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {

  try{
    const header = req.headers['authorization']?.split(' ')[1];

    if (!header) {
      console.log("STATUS 401 : UNAUTHORISED");
      logger.error(`STATUS 401 : ${req.method} ${req.url}`);
      res.status(401).json({ message: "Unauthorized" });
      return;
  
    } 
    const token = header
    if (!token) {
      console.log("STATUS 401 : UNAUTHORISED");
      logger.error(`STATUS 401 : ${req.method} ${req.url}`);
      res.status(401).json({ message: "Unauthorized" });
      return;
  
    } 
    jwt.verify(token, config.jwtSecret, (err: Error) => {
      if (err) {
        console.log("STATUS 403 : FORBIDDEN");
        logger.error(`STATUS 403 : ${req.method} ${req.url}`);
        res.status(403).send("STATUS 403 : FORBIDDEN")
        return;
      }
      next();
    });
  } catch(error){
    logger.error(`STATUS 500: ${req.method} ${req.url}`);
    console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
    res.status(500).send("INTERNAL ERROR");
  }

}

export function authorizeRole(role: string) {

    return (req: Request, res: Response, next: NextFunction) => {



      const token = req.headers['authorization']?.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
  
      console.log(decoded.userToLogin.role);
  
      if (role !== decoded.userToLogin.role) {
        console.log("403");
        logger.warn(`STATUS 403 : ${req.method} ${req.url}`);
        res.status(403).json("STATUS 403: USER DON'T HAVE RIGHTS");
      }
  
      next();
      /*
        if (err) {
  
  
          console.log(err)
          logger.warn(`STATUS 403 : ${req.method} ${req.url}`);
          res.status(403).json("STATUS 403: USER DON'T HAVE RIGHTS");
        } else {
  
          console.log("userToken: " + userToken.user);
          console.log(userToken.user.role)
          console.log(role)
          if (role !== userToken.user.role) {
            console.log("403");
            logger.warn(`STATUS 403 : ${req.method} ${req.url}`);
            res.status(403).json("STATUS 403: USER DON'T HAVE RIGHTS");
          } else {
            
          }
        }
      });
      */
  
    };
  

}