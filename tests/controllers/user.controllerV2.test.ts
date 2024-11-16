import mongoose from "mongoose";
import {connectToMongoDatabase,  MongoUser} from "../../src/data/databaseMongo"
import {MongoUserController} from "../../src/controllers/user.controllerV2"
import {config} from "../../src/config/config"
import { Response, Request} from "express";
import { before } from "node:test";


const mongoUserController = new MongoUserController();
// Mock response and request objects
const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (params:any, data:any):Partial<Request> => ({ params:params, body: data });


beforeAll(async () => {
    await connectToMongoDatabase(config.DB_TEST_URI);
    MongoUser.collection.drop();
});

afterAll(async () => {
    await mongoose.disconnect();

});

describe('Methods for controller user v2', () => {


    describe('Create User', () => {

        beforeAll(async () => {
            const user = new MongoUser({
                username:"Muffin",
                password:"muffinLovesHerCat",
                email:"muffin.hamburger@gmail.com",
                role:"Employé"
            });
            await user.save();

        });

        /**<-----------------------------CREATE USER-----------------------------> */
        //CODE 201
        test('Should return a new user created', async () => {
            const req = mockRequest(undefined,{
                username:"Muffin",
                password:"muffinLovesHerCat",
                email:"muffin.bob@gmail.com",
                role:"Employé"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username:"Muffin", email:"muffin.bob@gmail.com",role:"Employé" }));
        });


        //CODE 400
        //username
        test('Should return an error if username field is missing', async () => {
            const req = mockRequest(undefined,{
                
                password:"muffinLovesHerCat",
                email:"muffin.bob@gmail.com",
                role:"Employé"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if username field is not a string', async () => {
            const req = mockRequest(undefined,{
                
                username: 622,
                password:"muffinLovesHerCat",
                email:"muffin.bob@gmail.com",
                role:"Employé"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });


        //password
        test('Should return an error if password field is missing', async () => {
            const req = mockRequest(undefined,{
                username:"Muffin",

                email:"muffin.bob@gmail.com",
                role:"Employé"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if password field is not a string', async () => {
            const req = mockRequest(undefined,{
                username: "Muffin",
                password: 2224,
                email:"muffin.bob@gmail.com",
                role:"Employé"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });



        //email
        test('Should return an error if email field is missing', async () => {
            const req = mockRequest(undefined,{
                username:"Muffin",
                password:"muffinLovesHerCat",

                role:"Employé"
                

            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if email field is not a correct email', async () => {
            const req = mockRequest(undefined,{
                username: "Muffin",
                password: "muffinLovesHerCat",
                email:"HAMBURGER",
                role:"Gestionnaire"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        //role
        test('Should return an error if role field is missing', async () => {
            const req = mockRequest(undefined,{
                username:"Muffin",
                password:"muffinLovesHerCat",
                email:"muffin.bob@gmail.com"

            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if role field is not a correct value', async () => {
            const req = mockRequest(undefined,{
                username: "Muffin",
                password: "muffinLovesHerCat",
                email:"muffin.bob@gmail.com",
                role:"HAMBURGER"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });


        //email
        test('Should return an error if email is already in use', async () => {
            const req = mockRequest(undefined,{
                username:"Muffin",
                password:"muffinLovesHerCat",
                email:"muffin.bob@gmail.com",
                role:"Employé"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.signIn(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

    });



    describe('Login User', () => {

        /**<-----------------------------LOGIN USER-----------------------------> */
        //CODE 200
        test('Should login', async () => {
            const req = mockRequest(undefined,{
                username:"Muffin",
                password:"muffinLovesHerCat",
                email:"muffin.bob@gmail.com",
                role:"Employé"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            
        });


        //CODE 400
        //username
        test('Should return an error if username field is missing', async () => {
            const req = mockRequest(undefined,{
                
                password:"muffinLovesHerCat",
                email:"muffin.bob@gmail.com",
                role:"Employé"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if username field is not a string', async () => {
            const req = mockRequest(undefined,{
                
                username: 6,
                password:"muffinLovesHerCat",
                email:"muffin.bob@gmail.com",
                role:"Employé"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });


        //password
        test('Should return an error if password field is missing', async () => {
            const req = mockRequest(undefined,{
                username:"Muffin",

                email:"muffin.bob@gmail.com",
                role:"Employé"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if password field is not a string', async () => {
            const req = mockRequest(undefined,{
                username: "Muffin",
                password:5,
                email:"muffin.bob@gmail.com",
                role:"Employé"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });



        //email
        test('Should return an error if email field is missing', async () => {
            const req = mockRequest(undefined,{
                username:"Muffin",
                password:"muffinLovesHerCat",

                role:"Employé"
                

            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if email field is not a correct email', async () => {
            const req = mockRequest(undefined,{
                username: "Muffin",
                password: "muffinLovesHerCat",
                email:"HAMBURGER",
                role:"Gestionnaire"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        //role
        test('Should return an error if role field is missing', async () => {
            const req = mockRequest(undefined,{
                username:"Muffin",
                password:"muffinLovesHerCat",
                email:"muffin.bob@gmail.com"

            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if role field is not a correct value', async () => {
            const req = mockRequest(undefined,{
                username: "Muffin",
                password: "muffinLovesHerCat",
                email:"muffin.bob@gmail.com",
                role:"HAMBURGER"
            }) as Request;
            const res = mockResponse() as Response;

            await mongoUserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });




    });
});
