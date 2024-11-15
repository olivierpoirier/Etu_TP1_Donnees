import { Request, Response } from 'express';
import { getDataFromFile, getUsersData } from '../data/apiDataPicker';
import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { config } from '../config/config';
import { logger } from '../logs/winston';
import { regexEmail } from '../data/regex';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');




export class UserController {

    public async login(req: Request, res: Response): Promise<void> {

        try {
            const email = req.body.email;
            const password = req.body.password;
            if(
                !email 
                || !password
                || !regexEmail.test(email)
            ) {
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: USER CAN'T LOG");
                res.status(400).send("STATUS 400 : ERROR WITH YOUR REQUEST");
                return;
            }
               
            const userDataArray = getUsersData();
            const userToLogin = userDataArray.find(u => u.email === email);
                    
            if (!userToLogin) {
    
                logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                console.log("STATUS 401: INCORRECT PASSWORD OR EMAIL");
                res.status(401).send('INCORRECT PASSWORD OR EMAIL' );
                return;
            } 
            const isValidPassword = await bcrypt.compare(password, userToLogin.password);
            if (!isValidPassword) {
                logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                console.log("STATUS 401: INCORRECT PASSWORD OR EMAIL");
                res.status(401).send('INCORRECT PASSWORD OR EMAIL');
                return;
            } 
            
            // Génération d'un JWT
            const token = jwt.sign({ userToLogin }, config.jwtSecret, { expiresIn: '1h' });
            
            logger.info(`STATUS 200: ${req.method} ${req.url}`);
            console.log("STATUS 200: WELCOME");
            res.status(200).json({"token":token});
        } catch(error){
            logger.error(`STATUS 500: ${req.method} ${req.url}`);
            console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
            res.status(500).send("INTERNAL ERROR");
        }

    }

    public async signIn(req: Request, res: Response): Promise<void> {

        try {
            const userData:IUser = new UserModel(
                -1, 
                req.body.username || null, 
                req.body.password || null, 
                req.body.email || null, 
                req.body.role || null
            );
    
    
            const userDataArray = getUsersData();
    
            const userAlreadyCreated = userDataArray.find(user => user.email === userData.email);
           
            if(
                userAlreadyCreated
                || !userData.username 
                || !userData.password
                || !userData.email 
                || !regexEmail.test(userData.email)
                || !(userData.role === "Gestionnaire"
                    || userData.role === "Employé")
                ) {
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: NEW USER NOT ADDED");
                res.status(400).send("STATUS 400 : ERROR WITH YOUR REQUEST");
                return;
            }
    
            userData.id = userDataArray.length+1
            userData.password = await bcrypt.hash(userData.password, 10),
    
            UserService.createUser(userDataArray, userData);
    
            logger.info(`STATUS 201: ${req.method} ${req.url}`);
            console.log("STATUS 201: NEW USER ADDED");
            res.status(201).json(userData);
        } catch(error){
            logger.error(`STATUS 500: ${req.method} ${req.url}`);
            console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
            res.status(500).send("INTERNAL ERROR");
        }
    };
}