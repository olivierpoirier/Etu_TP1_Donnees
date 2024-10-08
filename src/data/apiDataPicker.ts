import { from } from "rxjs";
import { Product } from "../interfaces/product.interface";
import { ProductModel } from "../models/product.model";
import { config } from "../config/config";

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




export function fetchProdData(pathProdData: string) {


  fetchData(config.databaseFetchUrl).subscribe({
    next(data) {
      if (data != null) {
        const jsonArray: Product[] = Array.from(data);
        const arrayProd: Product[] = [];
        const minStock = 0;
        const maxStock = 300;

        jsonArray.map((product: Product) => {
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
