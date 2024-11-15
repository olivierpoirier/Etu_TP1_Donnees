import mongoose from 'mongoose';
import { MongoProduct } from '../data/databaseMongo';
import { IProduct } from '../interfaces/product.interface';

export class MongoProductService {

  public static async getAllProducts(minPrice: number = 0, maxPrice: number = 9999999999999999999999, minStock: number = 0, maxStock: number = 99999999999999999999999999) {
    //https://mongoosejs.com/docs/api/model.html#Model.find()
    return await MongoProduct.find({ price: { $gte: minPrice, $lte: maxPrice }, stock: { $gte: minStock, $lte: maxStock } });
  }

  public static async createProduct(product: IProduct) {
    //https://mongoosejs.com/docs/api/model.html#Model.prototype.save()
    return await new MongoProduct(product).save();
  }

  public static async modifyProduct(id: mongoose.Types.ObjectId, data:IProduct) {
    //https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
    return await MongoProduct.findByIdAndUpdate(id, data, { new:true });
  }

  public static async deleteProduct(id: mongoose.Types.ObjectId) {
    //https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()
    return await MongoProduct.findByIdAndDelete(id);
  }
}