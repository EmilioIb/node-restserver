import { response, request } from "express";
import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";

const usuariosGet = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  // const usuarios = await User.find(query)
  //   .skip(Number(from))
  //   .limit(Number(limit));
  // const total = await User.countDocuments(query);

  const [total, usuarios] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res = response) => {
  const { name, mail, password, role } = req.body;
  const user = new User({ name, mail, password, role });

  //Encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  //Guardar en DB
  await user.save();

  res.json({
    user,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuarioDB = await User.findByIdAndUpdate(id, resto, { new: true });

  res.json(usuarioDB);
};

const usuariosPatch = (req, res) => {
  res.json({
    ok: true,
    msg: "patch API - controlador",
  });
};

const usuariosDelete = async (req, res) => {
  const { id } = req.params;

  //Borrar fisicamente
  const usuario = await User.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );

  res.status(500).json({
    usuario,
  });
};

export {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
