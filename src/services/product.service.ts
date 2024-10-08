import { config } from '../config/config';
import { getDataFromFile, writeDataToFile } from '../data/apiDataPicker';
import { Product } from '../interfaces/product.interface';
import { ProductModel } from '../models/product.model';

const pathDataProd = config.pathDatabaseProducts;

export class ProductService {

  public static async getAllProducts(minPrice: number = 0, maxPrice: number = 9999999999999999999999, minStock: number = 0, maxStock: number = 99999999999999999999999999): Promise<Product[]> {

    const productDataArray: Product[] = Array.from(JSON.parse(getDataFromFile(pathDataProd)));
    const arrayProd: Product[] | PromiseLike<Product[]> = [];
    productDataArray.map((product: Product) => {

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


  public static async createProduct(product: Product) {
    const productDataArray: Product[] = Array.from(JSON.parse(getDataFromFile(pathDataProd)));
    productDataArray.push(product);
    let dataChanged = JSON.stringify(productDataArray, null, 4);
    writeDataToFile(pathDataProd, dataChanged);
    return dataChanged;
  }

  public static async modifyProduct(prodToModify: Product) {
    const productDataArray: Product[] = Array.from(JSON.parse(getDataFromFile(pathDataProd)));
    let index = productDataArray.findIndex(prod => prod.id === prodToModify.id);
    productDataArray[index] = prodToModify;
    writeDataToFile(pathDataProd, JSON.stringify(productDataArray, null, 4));
    return productDataArray;
  }

  public static async deleteProduct(prodToDelete: Product) {
    const productDataArray: Product[] = Array.from(JSON.parse(getDataFromFile(pathDataProd)));
    let index = productDataArray.findIndex(prod => prod.id === prodToDelete.id);
    console.log(index);
    productDataArray.splice(index, 1);
    writeDataToFile(pathDataProd, JSON.stringify(productDataArray, null, 4));
    return productDataArray;
  }
}