import { response } from "express";
import { Types } from "mongoose";

import { User, Product, Category } from "../models/index.js";

const coleccionesPermitidas = ["users", "categories", "products", "roles"];

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res
      .status(400)
      .json({ msg: `Las colecciones permitidas son ${coleccionesPermitidas}` });
  }

  const buscarUsuarios = async (termino = "", res = response) => {
    const esMongoID = Types.ObjectId.isValid(termino);

    if (esMongoID) {
      const user = await User.findById(termino);
      return res.json({ results: user ? [user] : [] });
    }

    const regex = new RegExp(termino, "i");
    const users = await User.find({
      $or: [{ name: regex }, { mail: regex }],
      $and: [{ state: true }],
    });
    res.json({ results: users });
  };

  const buscarCategorias = async (termino = "", res = response) => {
    const esMongoID = Types.ObjectId.isValid(termino);

    if (esMongoID) {
      const category = await Category.findById(termino).populate(
        "user",
        "name"
      );
      return res.json({ results: category ? [category] : [] });
    }

    const regex = new RegExp(termino, "i");
    const categories = await Category.find({
      state: true,
      name: regex,
    }).populate("user", "name");
    res.json({ results: categories });
  };

  const buscarProductos = async (termino = "", res = response) => {
    const esMongoID = Types.ObjectId.isValid(termino);

    if (esMongoID) {
      const product = await Product.findById(termino)
        .populate("category", "name")
        .populate("user", "name");
      return res.json({ results: product ? [product] : [] });
    }

    const regex = new RegExp(termino, "i");
    const products = await Product.find({ state: true, name: regex })
      .populate("category", "name")
      .populate("user", "name");
    res.json({ results: products });
  };

  switch (coleccion) {
    case "users":
      buscarUsuarios(termino, res);
      break;
    case "categories":
      buscarCategorias(termino, res);
      break;
    case "products":
      buscarProductos(termino, res);

      break;
    default:
      res.status(500).json({
        msg: "Se me olvido hacer la busqueda de roles",
      });
  }
};

export { buscar };
