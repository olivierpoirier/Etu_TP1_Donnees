import { Request, Response } from 'express';
import { logger } from '../logs/winston';
import { MongoProductService } from '../services/product.serviceV2';
import { MongoProduct, validateMongoProduct } from '../data/databaseMongo';
import { regexName, regexPrice, regexQuantity } from '../data/regex';
import mongoose from 'mongoose';

//https://mongoosejs.com/docs/api/model.html#Model.find()
//https://mongoosejs.com/docs/api/model.html#Model.findById()

export class MongoProductController {

  public async getAllProducts(req: Request, res: Response): Promise<void> {

    try {
      const minPrice = parseInt(req.params.minPrice) || 0;
      const maxPrice = parseInt(req.params.maxPrice) || 999999999999999;
      const minStock = parseInt(req.params.minStock) || 0;
      const maxStock = parseInt(req.params.maxStock) || 999999999999999;
  
      if (
        minPrice < 0
        || maxPrice < 0
        || minStock < 0
        || maxStock < 0
        || minPrice > maxPrice
        || minStock > maxStock
      ) {
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        console.log("STATUS 400: GETALLPRODUCT DIDNT WORKED");
        res.status(400).send("400 ERROR WITH YOUR REQUEST");
        return;
      }
      const products = await MongoProductService.getAllProducts(minPrice, maxPrice, minStock, maxStock);
  
      logger.info(`STATUS 200: ${req.method} ${req.url}`);
      console.log("STATUS 200: GETALLPRODUCT WORKED");
      res.status(200).json(products);
  
    } catch(error){
      logger.error(`STATUS 500: ${req.method} ${req.url}`);
      console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
      res.status(500).send("INTERNAL ERROR");
    }

  }

  public async createProduct(req: Request, res: Response): Promise<void> {

    try {
      
      if(!validateMongoProduct(req.body)){
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        console.log("STATUS 400: NEW PRODUCT WASN'T ADDED");
        res.status(400).send("ERROR WITH YOUR REQUEST");
        return ;
      }
  
      const response = await MongoProductService.createProduct(req.body);

      logger.info(`STATUS 201: ${req.method} ${req.url}`);
      console.log("STATUS 201: NEW PRODUCT ADDED");
      res.status(201).json(response);
      
    } catch(error){
      logger.error(`STATUS 500: ${req.method} ${req.url}`);
      console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
      res.status(500).send("INTERNAL ERROR");
    }

  }


  public async modifyProduct(req: Request, res: Response): Promise<void> {


    try{
      const productId = new mongoose.Types.ObjectId(req.params.id);

      if(!validateMongoProduct(req.body)){
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        console.log("STATUS 400: NEW PRODUCT WASN'T MODIFIED");
        res.status(400).send("ERROR WITH YOUR REQUEST");
        return;
      } 
  
      const productToModify = await MongoProduct.findById( productId ).exec();
      if(!productToModify) {
        logger.error(`STATUS 404 : ${req.method} ${req.url}`);
        console.log("STATUS 404: PRODUCT NOT FOUND");
        res.status(404).send("PRODUCT NOT FOUND");
        return;
      } 
  
      const response = await MongoProductService.modifyProduct(productId, req.body);
  
      logger.info(`STATUS 200: ${req.method} ${req.url}`);
      console.log(`STATUS 200: PRODUCT WITH ID ${productId} MODIFIED`);
      res.status(200).json(response);

    } catch(error){
      logger.error(`STATUS 500: ${req.method} ${req.url}`);
      console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
      res.status(500).send("INTERNAL ERROR");
    }
      
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {

    try {


      const productId = new mongoose.Types.ObjectId(req.params.id);
        
      const productToDelete = await MongoProduct.findById( productId ).exec();

      if(!productToDelete) {
  
        logger.error(`STATUS 404 : ${req.method} ${req.url}`);
        console.log("STATUS 404: PRODUCT NOT FOUND");
        res.status(404).send("PRODUCT NOT FOUND");
        return;
      }
  
      const response = await MongoProductService.deleteProduct( productId );


      logger.info(`STATUS 204: ${req.method} ${req.url}`);
      console.log(`STATUS 204: PRODUCT ${productToDelete} DELETED`);
      res.status(204).json(response);

    } catch(error){
      logger.error(`STATUS 500: ${req.method} ${req.url}`);
      console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
      res.status(500).send("INTERNAL ERROR");
    }
  }
}