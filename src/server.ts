import { fastify } from "fastify";
import { DatabasePostgres } from "./database-postgres";
import postgres from "postgres";
import axios from "axios";
import { catcherror, embedcreator } from "./functions/functions";
import { inspect } from "util";

const webhookSucessUrl: string =
  "";
const server = fastify();

const database = new DatabasePostgres();

interface Product {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  image: string;
}
interface RouteParams {
  id: string;
}

server.get("/list/:id?", async (req, rep) => {
  const { id } = req.params as RouteParams;
  let products: postgres.RowList<postgres.Row[]> | string[];
  if (id) {
    products = await database.list(id);
    if (!products || products.length === 0) {
      products = ["Nothing here."];
    }
    try {
      const payload = await embedcreator({
        title: `**Product Searched** ⚫`,
        description: `Product: ${inspect(products)}`,
      });
      await axios.post(webhookSucessUrl, payload);
    } catch (error) {
      return rep
        .code(500)
        .send("Ocorreu um erro ao enviar o log para o Discord.");
    }
  } else {
    products = await database.list(null);
    if (!products || products.length === 0) {
      products = ["Nothing here."];
    }
  }
  console.log(products);
  return "Hello, things on console.";
});

server.post("/createproduct", async (req, rep) => {
  const { name, description, price, category, stock, image } =
    req.body as Product;
  await database
    .create({
      name,
      description,
      price,
      category,
      stock,
      image,
    })
    .catch((err) => {
      catcherror({ name: "create product", error: err });
    });

  try {
    const payload = await embedcreator({
      title: `**Product Created** 🟢`,
      description: `Name: ${name}\nDescription: ${description}\nPrice: ${price}\nCategory: ${category}\nStock: ${stock}\nImage: ${image}`,
    });
    await axios.post(webhookSucessUrl, payload);
  } catch (error) {
    return rep
      .code(500)
      .send("Ocorreu um erro ao enviar o log para o Discord.");
  }
  return rep.status(201).send();
});

server.put("/updateproducts/:id", async (req, rep) => {
  const { id } = req.params as RouteParams;
  const { name, description, price, category, stock, image } =
    req.body as Product;
  const now = Date.now();
  const a = await database.list(id);
  if (a.length < 1) {
    return rep.status(500).send("Ocorreu um erro ao procurar id.");
  }
  await database
    .update(id, {
      name,
      description,
      price,
      category,
      stock,
      image,
      now,
    })
    .catch((err) => {
      catcherror({ name: "update product", error: err });
    });
  try {
    const payload = await embedcreator({
      title: `**Product Updated** 🔵`,
      description: `Id: ${id}\nName: ${name}\nDescription: ${description}\nPrice: ${price}\nCategory: ${category}\nStock: ${stock}\nImage: ${image}`,
    });
    await axios.post(webhookSucessUrl, payload);
  } catch (error) {
    return rep
      .code(500)
      .send("Ocorreu um erro ao enviar o log para o Discord.");
  }
  return rep.status(204).send();
});

server.delete("/deleteproduct/:id", async (req, rep) => {
  const { id } = req.params as RouteParams;
  const a = await database.list(id);
  if (a.length < 1) {
    return rep.status(500).send("Ocorreu um erro ao procurar id.");
  }
  await database
    .delete(id)
    .then(async () => {
      console.log("Product Deleted:", id);
      try {
        const payload = await embedcreator({
          title: `**Product Deleted** 🔴`,
          description: `Id: ${id}`,
        });
        await axios.post(webhookSucessUrl, payload);

        return rep.code(200).send("Log enviado com sucesso para o Discord.");
      } catch (error) {
        return rep
          .code(500)
          .send("Ocorreu um erro ao enviar o log para o Discord.");
      }
    })
    .catch((err) => {
      catcherror({ name: "create product", error: err });
      return rep.status(500).send();
    });
});

server
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3333,
  })

  .then(() => {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
    console.log(`Openned in port: ${port}`);
  });
