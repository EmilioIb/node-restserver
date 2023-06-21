import { Router } from "express";
import { check } from "express-validator";
import {
  isAdminRole,
  userHasRole,
  validateFields,
  validateJWT,
} from "../middlewares/index.js";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categories.js";

import { categoryExistsById } from "../helpers/db-validators.js";

export const routerCategory = Router();

// Todas las categorias
routerCategory.get("/", getCategories);

// Una categoria
routerCategory.get(
  "/:id",
  [
    check("id", "It is not a valid ID").isMongoId(),
    check("id").custom(categoryExistsById),
    validateFields,
  ],
  getCategory
);

//crear
routerCategory.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    validateFields,
  ],
  createCategory
);

//actualizar
routerCategory.put(
  "/:id",
  [
    validateJWT,
    check("id", "It is not a valid ID").isMongoId(),
    check("id").custom(categoryExistsById),
    check("name", "Name is required").not().isEmpty(),
    validateFields,
  ],
  updateCategory
);

//eliminar
routerCategory.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "It is not a valid ID").isMongoId(),
    check("id").custom(categoryExistsById),
    validateFields,
  ],
  deleteCategory
);
