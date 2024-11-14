import { Request, Response } from 'express';
import { logger } from '../logs/winston';
import { MongoProductService } from '../services/product.serviceV2';
import { MongoProduct, validateMongoProduct } from '../data/databaseMongo';
import { regexName, regexPrice, regexQuantity } from '../data/regex';

//https://mongoosejs.com/docs/api/model.html#Model.find()


export class MongoProductController {

  public async getAllProducts(req: Request, res: Response): Promise<void> {

    try {
      const minPrice = parseInt(req.params.minPrice) || 0;
      const maxPrice = parseInt(req.params.maxPrice) || 999999999999999;
      const minStock = parseInt(req.params.minStock) || 0;
      const maxStock = parseInt(req.params.maxStock) || 999999999999999;
  
      if (
        minPrice <= 0
        || maxPrice <= 0
        || minStock <= 0
        || maxStock <= 0
        || minPrice <= maxPrice
        || minStock >= maxStock
      ) {
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        console.log("STATUS 400: GETALLPRODUCT DIDNT WORKED");
        res.status(400).send("400 Requête incorrecte");
        return;
      }
      const products = await MongoProductService.getAllProducts(minPrice, maxPrice, minStock, maxStock);
  
      logger.info(`STATUS 200: ${req.method} ${req.url}`);
      console.log("STATUS 200: GETALLPRODUCT WORKED");
      res.status(200).json(products);
  
    } catch(error){
      logger.error(`STATUS 500: ${req.method} ${req.url}`);
      console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
      res.status(500).json(error);
    }

  }

  public async createProduct(req: Request, res: Response): Promise<void> {

    try {
      const prodToAdd = req.body;
      if (prodToAdd.title === undefined
        || prodToAdd.description === undefined
        || prodToAdd.price === undefined
        || prodToAdd.stock === undefined
        || !regexName.test(prodToAdd.title)
        || !regexPrice.test(prodToAdd.price)
        || !regexQuantity.test(prodToAdd.stock)
      ) {
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        console.log("STATUS 400: NEW PRODUCT WASN'T ADDED");
        res.status(400).send("Error with your request");
        return ;
      }
  
      const result = await MongoProductService.createProduct(prodToAdd);
      
      if(!result){
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        console.log("STATUS 400: NEW PRODUCT WASN'T ADDED");
        res.status(400).send("Unexpected error");
        return;
      }

      logger.info(`STATUS 201: ${req.method} ${req.url}`);
      console.log("STATUS 201: NEW PRODUCT ADDED");
      res.status(201).json(prodToAdd);
      
    } catch(error){
      logger.error(`STATUS 500: ${req.method} ${req.url}`);
      console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
      res.status(500).json(error);
    }

  }


  public async modifyProduct(req: Request, res: Response): Promise<void> {

    try{
      if (req.params.id === undefined) { 
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        console.log("STATUS 400: NEW PRODUCT WASN'T MODIFIED");
        res.status(400).send("Error with your request");
        return;
      }
  
  
      if(!validateMongoProduct(req.body)){
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        console.log("STATUS 400: NEW PRODUCT WASN'T MODIFIED");
        res.status(400).send("Error with your data");
        return;
      } 
  
      const productToModify = await MongoProduct.find({ id:req.params.id }).exec();
      if(!productToModify) {
        logger.error(`STATUS 404 : ${req.method} ${req.url}`);
        console.log("STATUS 404: PRODUCT NOT FOUND");
        res.status(404).send("PRODUCT NOT FOUND");
        return;
      }
  
      const response = await MongoProductService.modifyProduct(req.body);
  
      if(response.modifiedCount === 0) {
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        console.log(`STATUS 400: NO PRODUCTS MODIFIED`);
        res.status(404).json(productToModify);
        return;
      }
      logger.info(`STATUS 200: ${req.method} ${req.url}`);
      console.log(`STATUS 200: PRODUCT WITH ID ${req.params.id} MODIFIED`);
      res.status(200).json("Product modified");

    } catch(error){
      logger.error(`STATUS 500: ${req.method} ${req.url}`);
      console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
      res.status(500).json(error);
    }
      
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {

    try {
      if (req.params.id === undefined) {

        logger.error(`STATUS 400 : ${req.method} ${req.url}`); 
        console.log("STATUS 400: NEW PRODUCT WASN'T ADDED");
        res.status(400).send("Error with your request");
        return;
      }
      const productToDelete = await MongoProduct.find({ id:req.params.id }).exec();
      if(!productToDelete) {
  
        logger.error(`STATUS 404 : ${req.method} ${req.url}`);
        console.log("STATUS 404: PRODUCT NOT FOUND");
        res.status(404).send("NOT PRODUCT NOT FOUND");
        return;
      }
  
      const response = await MongoProductService.deleteProduct(parseInt(req.params.id));
      if(response.deletedCount === 0) {
        logger.error(`STATUS 404: ${req.method} ${req.url}`);
        console.log(`STATUS 404: NO PRODUCTS DELETED`);
        res.status(404).json(productToDelete);
        return;
      }

      logger.info(`STATUS 204: ${req.method} ${req.url}`);
      res.status(204).json(productToDelete);
      console.log(`STATUS 204: PRODUCT ${productToDelete} DELETED`);

    } catch(error){
      logger.error(`STATUS 500: ${req.method} ${req.url}`);
      console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
      res.status(500).json(error);
    }

      
  }
}