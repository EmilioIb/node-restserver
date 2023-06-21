import { Role } from "../models/role.js";
import { User, Category, Product } from "../models/index.js";

const isRoleValid = async (role = "") => {
  const rolExists = await Role.findOne({ role });
  if (!rolExists) {
    throw new Error(`The role ${role} is in not valid`);
  }
};

const emailExists = async (mail = "") => {
  const emailDB = await User.findOne({ mail });
  if (emailDB) {
    throw new Error(`The mail ${mail} is already in use`);
  }
};

const userExistsById = async (id) => {
  const userDB = await User.findById(id);
  if (!userDB) {
    throw new Error(`The id ${id} is not found in the DB`);
  }
};

const categoryExistsById = async (id) => {
  const categoryDB = await Category.findById(id);
  if (!categoryDB) {
    throw new Error(`The id ${id} is not found in the DB`);
  }
};

const productExistsById = async (id) => {
  const productDB = await Product.findById(id);
  if (!productDB) {
    throw new Error(`The id ${id} is not found in the DB`);
  }
};

const coleccionesPermitidas = async (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);

  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no es permitida, use una de las siguientes: ${colecciones}`
    );

    return true;
  }
};

export {
  isRoleValid,
  emailExists,
  userExistsById,
  categoryExistsById,
  productExistsById,
  coleccionesPermitidas,
};
