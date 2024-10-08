import { Product } from '../interfaces/product.interface';

export class ProductModel implements Product {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public description: string,
    public category: string,
    public stock: number

  ) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.category = category;
    this.stock = stock;
  }


}