import { config } from '../config/config';
import { getProductsData, writeDataToFile } from '../data/apiDataPicker';
import { IProduct } from '../interfaces/product.interface';
import { ProductModel } from '../models/product.model';


export class ProductService {

  public static async getAllProducts(minPrice: number = 0, maxPrice: number = 9999999999999999999999, minStock: number = 0, maxStock: number = 99999999999999999999999999): Promise<IProduct[]> {

    const productDataArray =  getProductsData();
    const arrayProd: IProduct[] | PromiseLike<IProduct[]> = [];
    productDataArray.map((product: IProduct) => {

      if (product.price >= minPrice
        && product.price <= maxPrice
        && product.stock >= minStock
        && product.stock <= maxStock
      ) {
        arrayProd.push(new ProductModel(product.id, product.title, product.price, product.description, product.category, product.stock))
      }

      return product;
    });

    return arrayProd;
  }


  public static async createProduct(productDataArray:IProduct[], product: IProduct) {
    productDataArray.push(product);
    const dataChanged = JSON.stringify(productDataArray, null, 4);
    writeDataToFile(config.pathDatabaseProducts, dataChanged);
    return dataChanged;
  }

  public static async modifyProduct(productDataArray:IProduct[], prodToModify: IProduct) {
    const index = productDataArray.findIndex(prod => prod.id === prodToModify.id);
    productDataArray[index] = prodToModify;
    writeDataToFile(config.pathDatabaseProducts, JSON.stringify(productDataArray, null, 4));
    return productDataArray;
  }

  public static async deleteProduct(productDataArray:IProduct[], prodToDelete: IProduct) {
    const index = productDataArray.findIndex(prod => prod.id === prodToDelete.id);
    productDataArray.splice(index, 1);
    writeDataToFile(config.pathDatabaseProducts, JSON.stringify(productDataArray, null, 4));
    return productDataArray;
  }
}