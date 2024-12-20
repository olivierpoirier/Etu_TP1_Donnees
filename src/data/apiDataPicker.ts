import { from } from "rxjs";
import { IProduct } from "../interfaces/product.interface";
import { ProductModel } from "../models/product.model";
import { config } from "../config/config";
import { IUser } from "../interfaces/user.interface";

const fs = require('fs')


function fetchData(url: string) {
  return from(fetch(url).then(response => response.json()));
}

export function getDataFromFile(path: string) {
  const data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
  return data;
}

export function writeDataToFile(path: string, dataTorewrite: string) {
  try {
    fs.writeFileSync(path, dataTorewrite);
  } catch (e) {
    console.error(e);
  }

}


export function getProductsData():IProduct[]  {
  const productDataArray: IProduct[] = Array.from(JSON.parse(getDataFromFile(config.pathDatabaseProducts)));
  return productDataArray;
}

export function getUsersData():IUser[]  {
  const userDataArray: IUser[] = Array.from(JSON.parse(getDataFromFile(config.pathDatabaseUsers)));
  return userDataArray;
}



export function fetchProdData(pathProdData: string) {


  fetchData(config.databaseFetchUrl).subscribe({
    next(data) {
      if (data != null) {
        const jsonArray: IProduct[] = Array.from(data);
        const arrayProd: IProduct[] = [];
        const minStock = 0;
        const maxStock = 300;

        jsonArray.map((product: IProduct) => {
          const stock = Math.floor(Math.random() * (maxStock - minStock) + minStock);
          arrayProd.push(new ProductModel(product.id, product.title, product.price, product.description, product.category, stock))
        });
        //console.log(data);
        let dataChanged = JSON.stringify(arrayProd, null, 4);
        fs.writeFile(pathProdData, dataChanged, function (err: string) {
          //console.log(err)
        }
        );

      }

    },
    error(err) {
      console.error('Erreur:', err);
    },
    complete() {
      console.log('Requête complétée');

    }
  });

}
