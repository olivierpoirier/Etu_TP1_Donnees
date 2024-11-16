import mongoose from "mongoose";
import {connectToMongoDatabase,  MongoProduct} from "../../src/data/databaseMongo"
import {MongoProductController} from "../../src/controllers/product.controllerV2"
import {config} from "../../src/config/config"
import { Response, Request} from "express";
import { before } from "node:test";
import { ProductModel } from "../../src/models/product.model";


const mongoProductController = new MongoProductController();
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
});

afterAll(async () => {
    await mongoose.disconnect();

});

describe('Methods for controller product v2', () => {


    describe('Get All Product', () => {

        let product11:ProductModel;
        let product21:ProductModel;
        let product31:ProductModel;
        beforeEach(async () => {
            MongoProduct.collection.drop();
            const product = new MongoProduct({ title: 'monProduit', price: 9.99, description:"monProduit1",category: "jewelery",stock: 10  });
            await product.save();
            product11 = product;
            const product2 = new MongoProduct({ title: 'monProduitb', price: 189.99, description:"monProduit1",category: "jewelery",stock: 50  });
            await product2.save();
            product21 = product2;
            const product3 = new MongoProduct({ title: 'monProduitc', price: 209.99, description:"monProduit1",category: "jewelery",stock: 100  });
            await product3.save();
            product31 = product3;
        });

        afterEach(async () => {
            MongoProduct.collection.drop();
        });
        /**<-----------------------------GET ALL PRODUCT-----------------------------> */

        //CODE 200
        test('Should return a list of filtered products fetched without stock', async () => {
            const req = mockRequest({minPrice:0, maxPrice:50},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
              expect.objectContaining({
                category: "jewelery",
                description: "monProduit1",
                price: 9.99,
                stock: 10,
                title: "monProduit" 
              }),
            ]));
        });
        
        test('Should return a list of filtered products fetched without maxStock', async () => {
            const req = mockRequest({minPrice:0, maxPrice:210, minStock:70},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
                category: "jewelery",
                description: "monProduit1",
                price: 209.99,
                stock: 100,
                title: "monProduitc" 
              })
            ]));
        });

        test('Should return a list of filtered products fetched', async () => {
            const req = mockRequest({minPrice:0, maxPrice:200, minStock:20, maxStock:70},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);
            
            expect(res.status).toHaveBeenCalledWith(200);
            //expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'monProduitb', price: 189.99, description:"monProduit1",category: "jewelery",stock: 50 }));

            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
                category: "jewelery",
                description: "monProduit1",
                price: 189.99,
                stock: 50,
                title: "monProduitb"
              })
            ]));
        });


        //CODE 400
        test('Should return an error if the minPrice is less than 0', async () => {
            const req = mockRequest({minPrice:-3, maxPrice:200, minStock:20, maxStock:70},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if the maxPrice is less than 0', async () => {
            const req = mockRequest({minPrice:10, maxPrice:-2, minStock:20, maxStock:70},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if the minPrice is greater than maxPrice', async () => {
            const req = mockRequest({minPrice:10, maxPrice:3, minStock:20, maxStock:70},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });




        test('Should return an error if the minStock is less than 0', async () => {
            const req = mockRequest({minPrice:3, maxPrice:200, minStock:-20, maxStock:70},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if the maxStock is less than 0', async () => {
            const req = mockRequest({minPrice:10, maxPrice:20, minStock:20, maxStock:-70},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if the minStock is greater than maxStock', async () => {
            const req = mockRequest({minPrice:10, maxPrice:20, minStock:20, maxStock:10},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should work if the minPrice isnt a number', async () => {
            const req = mockRequest({minPrice:"s", maxPrice:20, minStock:20, maxStock:30},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([]));
        });

        test('Should work if the maxPrice isnt a number', async () => {
            const req = mockRequest({minPrice:10, maxPrice:"s", minStock:20, maxStock:30},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([]));
        });

        test('Should work if the maxStock isnt a number', async () => {
            const req = mockRequest({minPrice:10, maxPrice:"s", minStock:20, maxStock:1000},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
                category: "jewelery",
                description: "monProduit1",
                price: 189.99,
                stock: 50,
                title: "monProduitb" 
              })
            ]));
        });
        test('Should work if the minStock isnt a number', async () => {
            const req = mockRequest({minPrice:10, maxPrice:"s", minStock:20, maxStock:70},{}) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
                category: "jewelery",
                description: "monProduit1",
                price: 189.99,
                stock: 50,
                title: "monProduitb" 
              })
            ]));
        });
    });

    describe('Create Product', () => {

        /**<-----------------------------CREATE PRODUCT-----------------------------> */
        //CODE 201
        test('Should return a new product created', async () => {
            const req = mockRequest(undefined,{ title: 'monProduit', price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'monProduit', price: 9.99, description:"monProduit1",category: "jewelery",stock: 236 }));
        });


        //CODE 400
        //title
        test('Should return an error if title field is missing', async () => {
            const req = mockRequest(undefined,{ price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if title field is too short', async () => {
            const req = mockRequest(undefined,{ title: 'mo',price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if title field is too long', async () => {
            const req = mockRequest(undefined,{ title: 'monProduuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiit',price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if title field have a illegal character', async () => {
            const req = mockRequest(undefined,{ title: 'monProduit...',price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if title field have a number ', async () => {
            const req = mockRequest(undefined,{ title: 'monProduit1',price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if title field is other than string ', async () => {
            const req = mockRequest(undefined,{ title: 999,price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });




        //Price
        
        test('Should return an error if price field is missing', async () => {
            const req = mockRequest(undefined,{ title: 'monProduit',  description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if price field is negative', async () => {
            const req = mockRequest(undefined,{ title: 'monProduit',price: -9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if price field is other than number ', async () => {
            const req = mockRequest(undefined,{ title: 999,price: "s", description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        //Stock
        test('Should return an error if stock field is missing', async () => {
            const req = mockRequest(undefined,{ title: 'monProduit', price: 9.99, description:"monProduit1",category: "jewelery", }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if stock field is negative', async () => {
            const req = mockRequest(undefined,{ title: 'monProduit',price: 9.99, description:"monProduit1",category: "jewelery",stock: -236  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if stock field is a number with digits', async () => {
            const req = mockRequest(undefined,{ title: 999,price: "s", description:"monProduit1",category: "jewelery",stock: 236.1  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

        test('Should return an error if stock field is other than number ', async () => {
            const req = mockRequest(undefined,{ title: 999,price: "s", description:"monProduit1",category: "jewelery",stock: "s"  }) as Request;
            const res = mockResponse() as Response;

            await mongoProductController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    });


    describe('Modify Product', () => {

        /**<-----------------------------MODIFY PRODUCT-----------------------------> */
        let productId:mongoose.Types.ObjectId;
        let productNotFoundId:mongoose.Types.ObjectId =  new mongoose.Types.ObjectId("6736b6716e8eb4c9228fe3b1");
        
        beforeAll(async () => {
            const product = new MongoProduct({ title: 'monProduit', price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  });
            await product.save();
            productId = new mongoose.Types.ObjectId(product._id);
          
        });
        //CODE 200
        test('Should return a modified product', async () => {
            const req = mockRequest({id:productId},{ title: 'nouveauProduit', price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'nouveauProduit', price: 9.99, description:"monProduit1",category: "jewelery",stock: 236 }));
        });
    

            
        //CODE 404
        //title
        test('Should return an error if the product is missing', async () => {
            const req = mockRequest({id:productNotFoundId},{  title: 'nouveauProduit', price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        //CODE 400
        //title
        test('Should return an error if title field is missing', async () => {
            const req = mockRequest({id:productId},{ price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if title field is too short', async () => {
            const req = mockRequest({id:productId},{ title: 'mo',price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if title field is too long', async () => {
            const req = mockRequest({id:productId},{ title: 'monProduuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiit',price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if title field have a illegal character', async () => {
            const req = mockRequest({id:productId},{ title: 'monProduit...',price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if title field have a number ', async () => {
            const req = mockRequest({id:productId}, { title: 'monProduit1',price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if title field is other than string ', async () => {
            const req = mockRequest({id:productId}, { title: 999,price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
    
    
    
        //Price
        
        test('Should return an error if price field is missing', async () => {
            const req = mockRequest({id:productId}, { title: 'monProduit',  description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if price field is negative', async () => {
            const req = mockRequest({id:productId}, { title: 'monProduit',price: -9.99, description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if price field is other than number ', async () => {
            const req = mockRequest({id:productId}, { title: 999,price: "s", description:"monProduit1",category: "jewelery",stock: 236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        //Stock
        test('Should return an error if stock field is missing', async () => {
            const req = mockRequest({id:productId}, { title: 'monProduit', price: 9.99, description:"monProduit1",category: "jewelery", }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if stock field is negative', async () => {
            const req = mockRequest({id:productId}, { title: 'monProduit',price: 9.99, description:"monProduit1",category: "jewelery",stock: -236  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if stock field is a number with digits', async () => {
            const req = mockRequest({id:productId}, { title: 999,price: "s", description:"monProduit1",category: "jewelery",stock: 236.1  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if stock field is other than number ', async () => {
            const req = mockRequest({id:productId}, { title: 999,price: "s", description:"monProduit1",category: "jewelery",stock: "s"  }) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.modifyProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
















        
    });
    describe('Delete Product', () => {

        /**<-----------------------------DELETE PRODUCT-----------------------------> */
        let productId:mongoose.Types.ObjectId;
        let productNotFoundId:mongoose.Types.ObjectId =  new mongoose.Types.ObjectId("6736b6716e8eb4c9228fe3b1");
        
        beforeAll(async () => {
            const product = new MongoProduct({ title: 'monProduit', price: 9.99, description:"monProduit1",category: "jewelery",stock: 236  });
            await product.save();
            productId = new mongoose.Types.ObjectId(product._id);
          
        });

        //CODE 204
        test('Should delete a product', async () => {
            const req = mockRequest({id:productId},{}) as Request;
            const res = mockResponse() as Response;

            console.log(productId);
    
            await mongoProductController.deleteProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({}));
        });
    

            
        //CODE 404
        //title
        test('Should return an error if the product is missing', async () => {
            const req = mockRequest({id:productNotFoundId},{}) as Request;
            const res = mockResponse() as Response;
    
            await mongoProductController.deleteProduct(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    });
});