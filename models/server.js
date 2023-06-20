import express from "express";
import cors from "cors";
import { routerUser } from "../routes/users.js";
import { routerAuth } from "../routes/auth.js";
import { dbConnection } from "../database/config.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/users";
    this.authPath = "/api/auth";

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
    this.app.use(this.authPath, routerAuth);
    this.app.use(this.usuariosPath, routerUser);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

export { Server };
