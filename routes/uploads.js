import { Router } from "express";
import { check } from "express-validator";
import { validateFields, validateFileUpload } from "../middlewares/index.js";
import {
  actualizarImagen,
  actualizarImagenCloudinary,
  cargarArchivo,
  mostrarImagen,
} from "../controllers/uploads.js";
import { coleccionesPermitidas } from "../helpers/index.js";

export const routerUpload = Router();

routerUpload.post("/", validateFileUpload, cargarArchivo);

routerUpload.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser de mngo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["users", "products"])
    ),
    validateFields,
  ],
  mostrarImagen
);

routerUpload.put(
  "/:coleccion/:id",
  [
    validateFileUpload,
    check("id", "El id debe ser de mngo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["users", "products"])
    ),
    validateFields,
  ],
  actualizarImagenCloudinary
);
