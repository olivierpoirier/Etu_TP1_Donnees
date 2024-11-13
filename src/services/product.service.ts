import { config } from '../config/config';
import { getDataFromFile, writeDataToFile } from '../data/apiDataPicker';
import { IProduct } from '../interfaces/product.interface';
import { ProductModel } from '../models/product.model';

const pathDataProd = config.pathDatabaseProducts;

export class ProductService {

  public static async getAllProducts(minPrice: number = 0, maxPrice: number = 9999999999999999999999, minStock: number = 0, maxStock: number = 99999999999999999999999999): Promise<IProduct[]> {

    const productDataArray: IProduct[] = Array.from(JSON.parse(getDataFromFile(pathDataProd)));
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


  public static async createProduct(product: IProduct) {
    const productDataArray: IProduct[] = Array.from(JSON.parse(getDataFromFile(pathDataProd)));
    productDataArray.push(product);
    let dataChanged = JSON.stringify(productDataArray, null, 4);
    writeDataToFile(pathDataProd, dataChanged);
    return dataChanged;
  }

  public static async modifyProduct(prodToModify: IProduct) {
    const productDataArray: IProduct[] = Array.from(JSON.parse(getDataFromFile(pathDataProd)));
    let index = productDataArray.findIndex(prod => prod.id === prodToModify.id);
    productDataArray[index] = prodToModify;
    writeDataToFile(pathDataProd, JSON.stringify(productDataArray, null, 4));
    return productDataArray;
  }

  public static async deleteProduct(prodToDelete: IProduct) {
    const productDataArray: IProduct[] = Array.from(JSON.parse(getDataFromFile(pathDataProd)));
    let index = productDataArray.findIndex(prod => prod.id === prodToDelete.id);
    console.log(index);
    productDataArray.splice(index, 1);
    writeDataToFile(pathDataProd, JSON.stringify(productDataArray, null, 4));
    return productDataArray;
  }
}