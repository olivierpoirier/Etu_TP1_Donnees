import { config } from '../config/config';
import { getDataFromFile, writeDataToFile } from '../data/apiDataPicker';
import { MongoProduct } from '../data/databaseMongo';
import { IProduct } from '../interfaces/product.interface';
import { ProductModel } from '../models/product.model';

const pathDataProd = config.pathDatabaseProducts;


export class MongoProductService {

  public static async getAllProducts(minPrice: number = 0, maxPrice: number = 9999999999999999999999, minStock: number = 0, maxStock: number = 99999999999999999999999999) {

    const filteredProducts = await MongoProduct.find({ price: { $gte: minPrice, $lte: maxPrice }, stock: { $gte: minStock, $lte: maxStock } });
    return filteredProducts;
  }


  public static async createProduct(product: IProduct) {
    const prodToSave = new MongoProduct(product);
    return prodToSave.save();
  }

  public static async modifyProduct(prodToModify: IProduct) {

    //https://mongoosejs.com/docs/api/model.html#Model.updateOne()
    const res = await MongoProduct.updateOne({id:prodToModify.id}, prodToModify);
    return res.modifiedCount;
  }

  public static async deleteProduct(id: Number) {
    //https://mongoosejs.com/docs/api/model.html#Model.deleteOne()
    return await MongoProduct.deleteOne({id:id});
  }
}