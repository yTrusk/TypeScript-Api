import { sql } from "./db";

// sql`DROP TABLE IF EXISTS Products;`.then(() => {
//   console.log("Table deleted");
// });

sql`
CREATE TABLE Products (
    id TEXT PRIMARY KEY,
    ProductName TEXT,
    ProductDescription TEXT,
    ProductPrice FLOAT,
    ProductCategory TEXT,
    ProductStock INTEGER,
    ProductImage TEXT,
    ProductCreation TIMESTAMP,
    ProductUpdate TIMESTAMP
);`.then(() => {
  console.log("Created Table.");
});
