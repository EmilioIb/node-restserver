import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fileds.js";
import {
  emailExists,
  isRoleValid,
  userExistsById,
} from "../helpers/db-validators.js";

import {
  usuariosDelete,
  usuariosGet,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
} from "../controllers/users.js";

export const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "It is not a valid ID").isMongoId(),
    check("id").custom(userExistsById),
    check("role").custom(isRoleValid),
    validateFields,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password must have more than 6 letters").isLength({
      min: 6,
    }),
    check("mail", "Invalid mail").isEmail(),
    check("mail").custom(emailExists),
    check("role").custom(isRoleValid),
    validateFields,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    check("id", "It is not a valid ID").isMongoId(),
    check("id").custom(userExistsById),
    validateFields,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);
