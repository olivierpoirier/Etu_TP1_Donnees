import { Request, Response } from 'express';


import { logger } from '../logs/winston';
import { MongoProductService } from '../services/product.serviceV2';
import { MongoProduct, validateMongoProduct } from '../data/databaseMongo';
import { regexName, regexPrice, regexQuantity } from '../data/regex';

//https://mongoosejs.com/docs/api/model.html#Model.find()


export class MongoProductController {

  public async getAllProducts(req: Request, res: Response) {

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
      return res.status(400).send("400 Requête incorrecte");
    }
    const products = await MongoProductService.getAllProducts(minPrice, maxPrice, minStock, maxStock);

    logger.info(`${req.method} ${req.url}`);
    console.log("STATUS 200: GETALLPRODUCT WORKED");
    res.status(200).json(products);

  }

  public async createProduct(req: Request, res: Response) {


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
      return res.status(400).send("Error with your request")
    }

    MongoProductService.createProduct(prodToAdd);

    logger.info(`${req.method} ${req.url}`);
    console.log("STATUS 201: NEW PRODUCT ADDED");
    res.status(201).json(prodToAdd);
  }


  public async modifyProduct(req: Request, res: Response) {


    if (req.params.id === undefined) { 
      logger.error(`STATUS 400 : ${req.method} ${req.url}`);
      console.log("STATUS 400: NEW PRODUCT WASN'T MODIFIED");
      return res.status(400).send("Error with your request");
    }


    if(!validateMongoProduct(req.body)){
      logger.error(`STATUS 400 : ${req.method} ${req.url}`);
      console.log("STATUS 400: NEW PRODUCT WASN'T MODIFIED");
      return res.status(400).send("Error with your data")
    } 

    const productToModify = await MongoProduct.find({ id:req.params.id }).exec();
    if(!productToModify) {
      logger.error(`STATUS 404 : ${req.method} ${req.url}`);
      console.log("STATUS 404: PRODUCT NOT FOUND");
      return res.status(404).send("NOT FOUND")
    }

    MongoProductService.modifyProduct(req.body);

    logger.info(`${req.method} ${req.url}`);
    console.log(`STATUS 200: PRODUCT WITH ID ${req.params.id} MODIFIED`);
    res.status(200).json("Product modified");

    
  }

  public async deleteProduct(req: Request, res: Response) {

    if (req.params.id === undefined) {

      logger.error(`STATUS 400 : ${req.method} ${req.url}`); 
      console.log("STATUS 400: NEW PRODUCT WASN'T ADDED");
      return res.status(400).send("Error with your request");
    }
    const productToDelete = await MongoProduct.find({ id:req.params.id }).exec();
    if(!productToDelete) {
      logger.error(`STATUS 404 : ${req.method} ${req.url}`);
      console.log("STATUS 404: PRODUCT NOT FOUND");
      return res.status(404).send("NOT FOUND")
    }

    MongoProductService.deleteProduct(parseInt(req.params.id));

    logger.info(`${req.method} ${req.url}`);
    res.status(204).json(productToDelete);
    console.log(`STATUS 204: PRODUCT ${productToDelete} DELETED`);
      
  }
}