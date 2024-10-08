import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ProductModel } from '../models/product.model';
import { Product } from '../interfaces/product.interface';
import { getDataFromFile } from '../data/apiDataPicker';
import { config } from '../config/config';
import { logger } from '../logs/winston';

const pathDataProd = config.pathDatabaseProducts;

const regexName = new RegExp(/^[A-Za-z ]{3,50}$/);
const regexPrice = new RegExp(/^[1-9]\d*(\.\d+)?$/);
const regexQuantity = new RegExp(/^[1-9]\d*$/);

export class ProductController {



  public async getAllProducts(req: Request, res: Response): Promise<void> {
    const minPrice = parseInt(req.params.minPrice) || 0;
    const maxPrice = parseInt(req.params.maxPrice) || 999999999999999;
    const minStock = parseInt(req.params.minStock) || 0;
    const maxStock = parseInt(req.params.maxStock) || 999999999999999;
    if (
      minPrice >= 0
      && maxPrice >= 0
      && minStock >= 0
      && maxStock >= 0
      && minPrice <= maxPrice
      && minStock <= maxStock
    ) {
      const products = await ProductService.getAllProducts(minPrice, maxPrice, minStock, maxStock);

      logger.info(`${req.method} ${req.url}`);
      res.status(200).json(products);
      console.log("STATUS 200: GETALLPRODUCT WORKED");
    } else {

      logger.error(`STATUS 400 : ${req.method} ${req.url}`);
      res.status(400).send("400 Requête incorrecte");
      console.log("STATUS 400: GETALLPRODUCT DIDNT WORKED");
    }
  }

  public async createProduct(req: Request, res: Response): Promise<void> {


    const prodToAdd = req.body;
    if (prodToAdd.title != undefined
      && prodToAdd.description != undefined
      && prodToAdd.price != undefined
      && prodToAdd.stock != undefined
      && regexName.test(prodToAdd.title)
      && regexPrice.test(prodToAdd.price)
      && regexQuantity.test(prodToAdd.stock)
    ) {

      const jsonArray: Product[] = Array.from(JSON.parse(getDataFromFile(pathDataProd)));
      let id = jsonArray.length + 1
      //console.log(jsonArray.length)
      const newProd = new ProductModel(
        id,
        prodToAdd.title,
        prodToAdd.price,
        prodToAdd.description,
        prodToAdd.category,
        prodToAdd.stock
      );

      //console.log(newProd)
      ProductService.createProduct(newProd);

      logger.info(`${req.method} ${req.url}`);
      res.status(201).json(newProd);
      console.log("STATUS 201: NEW PRODUCT ADDED");
    } else {
      logger.error(`STATUS 400 : ${req.method} ${req.url}`);
      res.status(400).send("Error with your request")
      console.log("STATUS 400: NEW PRODUCT WASN'T ADDED");
    }

  }


  public async modifyProduct(req: Request, res: Response): Promise<void> {


    if (req.params.id !== undefined) {
      const jsonArray: Product[] = Array.from(JSON.parse(getDataFromFile(pathDataProd)));
      const prodToModify = jsonArray.find(prod => prod.id === parseInt(req.params.id));
      //Permet de gérer les erreurs parce que certains éléments dans la 
      // base de données sont déjà trop gros
      const titleBefore = prodToModify?.title



      if (prodToModify !== undefined) {


        prodToModify.title = req.body.title || prodToModify.title
        prodToModify.description = req.body.description || prodToModify.description
        prodToModify.price = parseInt(req.body.price) || prodToModify.price
        prodToModify.stock = parseInt(req.body.stock) || prodToModify.stock

        if ((regexName.test(prodToModify.title) || prodToModify.title === titleBefore)
          && regexPrice.test(prodToModify.price.toString())
          && regexQuantity.test(prodToModify.stock.toString())) {


          ProductService.modifyProduct(prodToModify);

          logger.info(`${req.method} ${req.url}`);
          res.status(200).json(prodToModify);
          console.log(`STATUS 200: PRODUCT WITH ID ${prodToModify.id} MODIFIED`);
        } else {
          logger.error(`STATUS 400 : ${req.method} ${req.url}`);
          res.status(400).send("Error with your request on regex")
          console.log("STATUS 400: NEW PRODUCT WASN'T MODIFIED");
        }
      } else {
        logger.error(`STATUS 404 : ${req.method} ${req.url}`);
        res.status(404).send("NOT FOUND")
        console.log("STATUS 404: PRODUCT NOT FOUND");
      }
    } else {
      logger.error(`STATUS 400 : ${req.method} ${req.url}`);
      res.status(400).send("Error with your request")
      console.log("STATUS 400: NEW PRODUCT WASN'T MODIFIED");
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {

    console.log(req.params)

    if (req.params.id !== undefined) {
      const jsonArray: Product[] = Array.from(JSON.parse(getDataFromFile(pathDataProd)));
      const prodToDelete = jsonArray.find(prod => prod.id === parseInt(req.params.id));

      if (prodToDelete !== undefined) {

        ProductService.deleteProduct(prodToDelete);

        logger.info(`${req.method} ${req.url}`);
        res.status(204).json(prodToDelete);
        console.log(`STATUS 204: PRODUCT WITH ID ${prodToDelete.id} DELETED`);
      } else {
        logger.error(`STATUS 404 : ${req.method} ${req.url}`);
        res.status(404).send("NOT FOUND")
        console.log("STATUS 404: PRODUCT NOT FOUND");
      }
    } else {
      logger.error(`STATUS 400 : ${req.method} ${req.url}`);
      res.status(400).send("Error with your request")
      console.log("STATUS 400: NEW PRODUCT WASN'T ADDED");
    }
  }
}