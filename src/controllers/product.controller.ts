import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ProductModel } from '../models/product.model';
import { IProduct } from '../interfaces/product.interface';
import { getDataFromFile, getProductsData } from '../data/apiDataPicker';
import { config } from '../config/config';
import { logger } from '../logs/winston';
import { regexName, regexPrice, regexQuantity } from '../data/regex';


export class ProductController {



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
  
      const products = await ProductService.getAllProducts(minPrice, maxPrice, minStock, maxStock);

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

      const productData:IProduct = new ProductModel(
        -1, 
        req.body.title || null, 
        req.body.price || null, 
        req.body.description || null, 
        req.body.category || null, 
        req.body.stock || null
      );

  
      if (
        !productData.title
        || !productData.price
        || !productData.stock
        || !regexName.test(req.body.title.toString())
        || !regexPrice.test(req.body.price.toString())
        || !regexQuantity.test(req.body.stock.toString())
      ) {

        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        console.log("STATUS 400: NEW PRODUCT WASN'T ADDED");
        res.status(400).send("ERROR WITH YOUR REQUEST");
        return ;
  
      } 

      const productDataArray = getProductsData()
      productData.id = productDataArray.length + 1

      ProductService.createProduct(productDataArray,productData);

      logger.info(`STATUS 201: ${req.method} ${req.url}`);
      console.log("STATUS 201: NEW PRODUCT ADDED");
      res.status(201).json(productData);
      
    } catch(error){
      logger.error(`STATUS 500: ${req.method} ${req.url}`);
      console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
      res.status(500).send("INTERNAL ERROR");
    }

  }


  public async modifyProduct(req: Request, res: Response): Promise<void> {


    try {

      const productData:IProduct = new ProductModel(
        parseInt(req.params.id), 
        req.body.title || null, 
        req.body.price || null, 
        req.body.description || null, 
        req.body.category || null, 
        req.body.stock || null
      );
      
  
      if (
        !productData.title
        || !productData.price
        || !productData.stock
        || !regexName.test(req.body.title.toString())
        || !regexPrice.test(req.body.price.toString())
        || !regexQuantity.test(req.body.stock.toString())
      ) {
  
        logger.error(`STATUS 400 : ${req.method} ${req.url}`);
        console.log("STATUS 400: NEW PRODUCT WASN'T MODIFIED");
        res.status(400).send("ERROR WITH YOUR REQUEST");
        return ;
  
      } 
  
      const productDataArray = getProductsData()
      const prodToModify = productDataArray.find(prod => prod.id === parseInt(req.params.id));

      if (!prodToModify) {
        
        logger.error(`STATUS 404 : ${req.method} ${req.url}`);
        console.log("STATUS 404: PRODUCT NOT FOUND");
        res.status(404).send("PRODUCT NOT FOUND");
        return ;
      }
  
      ProductService.modifyProduct(productDataArray, productData);
  
      logger.info(`STATUS 200: ${req.method} ${req.url}`);
      console.log(`STATUS 200: PRODUCT WITH ID ${productData.id} MODIFIED`);
      res.status(200).json(productData);
    }
    catch(error){
      logger.error(`STATUS 500: ${req.method} ${req.url}`);
      console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
      res.status(500).send("INTERNAL ERROR");
    }
    
      
      
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {

    try {
      const productDataArray = getProductsData()
      const prodToDelete = productDataArray.find(prod => prod.id === parseInt(req.params.id));
  
      
      if (!prodToDelete) {
        logger.error(`STATUS 404 : ${req.method} ${req.url}`);
        console.log("STATUS 404: PRODUCT NOT FOUND");
        res.status(404).send("PRODUCT NOT FOUND");
        return; 
  
      } 
      ProductService.deleteProduct(productDataArray, prodToDelete);
  
      logger.info(`STATUS 204 : ${req.method} ${req.url}`);
      console.log(`STATUS 204: PRODUCT WITH ID ${prodToDelete.id} DELETED`);
      res.status(204).json(prodToDelete);

    } catch(error){
      logger.error(`STATUS 500: ${req.method} ${req.url}`);
      console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
      res.status(500).send("INTERNAL ERROR");
    }

  }
}