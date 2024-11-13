import { Request, Response } from 'express';
import { getDataFromFile } from '../data/apiDataPicker';
import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { config } from '../config/config';
import { logger } from '../logs/winston';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



const regexEmail = new RegExp(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/);

export class UserController {

    public async login(req: Request, res: Response): Promise<void> {

        const email = req.body.email;
        const password = req.body.password;
        if(email !== undefined && password != undefined) {
            if(regexEmail.test(email)) {
                const userDataArray:IUser[] = Array.from(JSON.parse(getDataFromFile(config.pathDatabaseUsers)));
                const user = userDataArray.find(u => u.email === email);
                
                if (user) {
                    const isValidPassword = await bcrypt.compare(password, user.password);
                    if (isValidPassword) {
                        // Génération d'un JWT
                        const token = jwt.sign({ user }, config.jwtSecret, { expiresIn: '1h' });
        
                        logger.info(`${req.method} ${req.url}`);
                        res.status(200).json({"token":token});
                    } else {
                        logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                        res.status(401).send('Mot de passe et/ou courriel incorrect');
                    }
                } else {
                    logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                    res.status(401).send('Utilisateur non trouvé' );
                }
            } else {
                logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                res.status(401).send("Error in courriel regex");
            }
        } else {
            logger.error(`STATUS 400 : ${req.method} ${req.url}`);
            res.status(400).send("Error with your request")
            console.log("STATUS 400: NEW USER WASN'T ADDED");
        }


    
    }

    public async signIn(req: Request, res: Response): Promise<void> {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const role = req.body.role;
        const userDataArray:IUser[] = Array.from(JSON.parse(getDataFromFile(config.pathDatabaseUsers)));
        let id = userDataArray.length+1
        let hashPassword;

        if(username != undefined 
            && password != undefined
            && email != undefined
            && regexEmail.test(email)
            && (role === "Gestionnaire"
                || role === "Employé")
            ) {
            //console.log(jsonArray.length)
            const newUser = new UserModel(
                id,
                username,
                hashPassword = await bcrypt.hash(password, 10),
                email,
                role
            );

            UserService.createUser(newUser);
  
            logger.info(`${req.method} ${req.url}`);
            res.status(201).json(newUser);
            console.log("STATUS 201: NEW USER ADDED");
        
       

      } else {
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        res.status(400).send("Error with your request")
        console.log("STATUS 400: NEW USER WASN'T ADDED");
      }
    };
}