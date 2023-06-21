import { Router } from "express";
import { check } from "express-validator";

import {
  isAdminRole,
  validateFields,
  validateJWT,
} from "../middlewares/index.js";

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products.js";

import {
  categoryExistsById,
  productExistsById,
} from "../helpers/db-validators.js";

export const routerProducts = Router();

// Todas las categorias
routerProducts.get("/", getProducts);

// Una categoria
routerProducts.get(
  "/:id",
  [
    check("id", "It is not a valid ID").isMongoId(),
    check("id").custom(productExistsById),
    validateFields,
  ],
  getProduct
);

//crear
routerProducts.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    check("category", "It is not a valid ID").isMongoId(),
    check("category").custom(categoryExistsById),
    validateFields,
  ],
  createProduct
);

//actualizar
routerProducts.put(
  "/:id",
  [
    validateJWT,
    check("id", "It is not a valid ID").isMongoId(),
    check("id").custom(productExistsById),
    validateFields,
  ],
  updateProduct
);

//eliminar
routerProducts.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "It is not a valid ID").isMongoId(),
    check("id").custom(productExistsById),
    validateFields,
  ],
  deleteProduct
);
