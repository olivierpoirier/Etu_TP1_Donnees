import { Request, Response } from 'express';
import { config } from '../config/config';
import { logger } from '../logs/winston';
import { regexEmail } from '../data/regex';
import { MongoUser } from '../data/databaseMongo';
import { MongoUserService } from '../services/user.serviceV2';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');




export class MongoUserController {

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const email = req.body.email;
            const password = req.body.password;
    
            if(email === undefined || password === undefined){
    
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: USER CAN'T LOG");
                res.status(400).send("STATUS 400 : Error with your request");
                return;
            }
    
            if(!regexEmail.test(email)){
    
                logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                console.log("STATUS 401: USER CAN'T LOG");
                res.status(401).send("Error in email formation");
                return;
            }
            const userToLogin = await MongoUser.findOne({ email: email });
                
            if (!userToLogin) {
    
                logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                console.log("STATUS 401: USER NOT FOUND");
                res.status(401).send('Utilisateur non trouvé' );
                return;
            }
            const isValidPassword = await bcrypt.compare(password, userToLogin.password);
            if (!isValidPassword) {
                logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                console.log("STATUS 401: PASSWORD NOT VALID");
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
            res.status(500).json(error);
        }

        
    }

    public async signIn(req: Request, res: Response): Promise<void> {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const role = req.body.role;


        try{
    
            if(
                username === undefined 
                || password === undefined
                || email === undefined
                || !regexEmail.test(email)
                || (role !== "Gestionnaire"
                    || role !== "Employé")
                ) {
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: NEW USER WASN'T ADDED");
                res.status(400).send("Error with your request");
                return;
            }

            const newUser = new MongoUser(req.body);
            newUser.password = await bcrypt.hash(password, 10);
    
            const response = await MongoUserService.createUser(newUser);
    
            if(!response){
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: NEW USER WASN'T ADDED");
                res.status(400).send("Unexpected error");
                return;
            }
            logger.info(`${req.method} ${req.url}`);
            console.log("STATUS 201: NEW USER ADDED");
            res.status(201).json(newUser);

        } catch(error){
            logger.error(`STATUS 500: ${req.method} ${req.url}`);
            console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
            res.status(500).json(error);
        }
    
    };
}