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

  public static async modifyProduct(prodToModify: IProduct) {
    //https://mongoosejs.com/docs/api/model.html#Model.updateOne()
    return await MongoProduct.updateOne({id:prodToModify.id}, prodToModify);
  }

  public static async deleteProduct(id: Number) {
    //https://mongoosejs.com/docs/api/model.html#Model.deleteOne()
    return await MongoProduct.deleteOne({id:id});
  }
}