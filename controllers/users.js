import { response, request } from "express";

const usuariosGet = (req = request, res = response) => {
  const { q, nombre = "No name", apikey, page = 1, limit = 10 } = req.query;

  res.json({
    msg: "get API - controlador",
    q,
    nombre,
    apikey,
    page,
    limit,
  });
};

const usuariosPost = (req, res = response) => {
  const { nombre, edad } = req.body;
  res.status(201).json({
    msg: "post API - controlador",
    nombre,
    edad,
  });
};

const usuariosPut = (req, res = response) => {
  const { id } = req.params;
  res.status(400).json({
    msg: "put API - controlador",
    id,
  });
};

const usuariosPatch = (req, res) => {
  res.json({
    ok: true,
    msg: "patch API - controlador",
  });
};

const usuariosDelete = (req, res) => {
  res.status(500).json({
    msg: "delete API - controlador",
  });
};

export {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
