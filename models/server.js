import express from "express";
import cors from "cors";
import { routerUser } from "../routes/users.js";
import { routerAuth } from "../routes/auth.js";
import { routerCategory } from "../routes/categories.js";
import { routerProducts } from "../routes/products.js";
import { routerBuscar } from "../routes/buscar.js";

import { dbConnection } from "../database/config.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      users: "/api/users",
      products: "/api/products",
      buscar: "/api/buscar",
    };

    //Conectar a base de datos
    this.conectarDB();

    //Middelwares
    this.middelwares();

    //Rutas
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middelwares() {
    //CORS
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.auth, routerAuth);
    this.app.use(this.paths.categories, routerCategory);
    this.app.use(this.paths.users, routerUser);
    this.app.use(this.paths.products, routerProducts);
    this.app.use(this.paths.buscar, routerBuscar);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

export { Server };
