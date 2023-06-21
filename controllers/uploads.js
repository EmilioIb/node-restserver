import fs from "fs";
import { response } from "express";
import cloudinary from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL);

import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { subirArchivo } from "../helpers/index.js";
import { User, Product } from "../models/index.js";

const cargarArchivo = async (req, res = response) => {
  try {
    // const nombre = await subirArchivo(req.files,);
    // const nombre = await subirArchivo(req.files, ["txt", "md"], "textos");
    const nombre = await subirArchivo(req.files, undefined, "img");
    res.json({ nombre });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;
  switch (coleccion) {
    case "users":
      modelo = await User.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case "products":
      modelo = await Product.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvido validar eso" });
  }

  //Limpiar imagenes previas
  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );

    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  modelo.img = await subirArchivo(req.files, undefined, coleccion);
  await modelo.save();

  res.json({ modelo });
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;
  switch (coleccion) {
    case "users":
      modelo = await User.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case "products":
      modelo = await Product.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvido validar eso" });
  }

  //Limpiar imagenes previas
  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );

    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const pathNotFound = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(pathNotFound);
};

const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;
  switch (coleccion) {
    case "users":
      modelo = await User.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case "products":
      modelo = await Product.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "Se me olvido validar eso" });
  }

  //Limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;

  await modelo.save();

  res.json({ modelo });
};

export {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
