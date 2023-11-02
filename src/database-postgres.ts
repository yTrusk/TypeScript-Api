import { randomUUID } from "crypto";
import { sql } from "./db";
export class DatabasePostgres {
  async list(search: any) {
    let videos;
    if (search && search !== null) {
      videos = await sql`select * from Products where id ilike ${
        "%" + search + "%"
      }`;
    } else {
      videos = await sql`select * from Products`;
    }
    return videos;
  }

  async create(video: any) {
    const id = randomUUID();
    console.log(id);
    const { name, description, price, category, stock, image } = video;
    await sql`INSERT INTO Products(id, ProductName, ProductDescription, ProductPrice, ProductCategory, ProductStock, ProductImage, ProductCreation, ProductUpdate)
    VALUES (${id}, ${name}, ${description}, ${price}, ${category}, ${stock}, ${image}, NOW(), NOW())`;
  }

  async update(id: string, product: any) {
    const {
      ProductName,
      ProductDescription,
      ProductPrice,
      ProductCategory,
      ProductStock,
      ProductImage,
    } = product;
    if (
      product.name !== undefined &&
      product.description !== undefined &&
      product.price !== undefined &&
      product.category !== undefined &&
      product.stock !== undefined &&
      product.image !== undefined &&
      product.now !== undefined
    ) {
      await sql`UPDATE Products
        SET ProductName = ${product.name},
            ProductDescription = ${product.description},
            ProductPrice = ${product.price}, 
            ProductCategory = ${product.category}, 
            ProductStock = ${product.stock}, 
            ProductImage = ${product.image},
            ProductUpdate = ${product.now}
        WHERE id = ${id}`;
    } else {
      console.log("Uma ou mais variáveis são indefinidas:");
      console.log("ProductName:", product.name);
      console.log("ProductDescription:", product.description);
      console.log("ProductPrice:", product.price);
      console.log("ProductCategory:", product.category);
      console.log("ProductStock:", product.stock);
      console.log("ProductImage:", product.image);
      console.log("ProductUpdate:", product.now);
    }
  }

  async delete(id: string) {
    try {
      await sql`DELETE FROM Products WHERE id = ${id}`;
    } catch (error) {
      console.error("Erro ao excluir vídeo:", error);
      throw error;
    }
  }
}
