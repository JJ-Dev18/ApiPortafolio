const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto, Project } = require("../models");

const coleccionesPermitidas = ["usuarios", "projects", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // TRUE

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios,
  });
};


const buscarProjects = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // TRUE

  if (esMongoID) {
    const project = await Project.findById(termino)
    return res.json({
      results: project ? [project] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const projects = await Project.find({
    nombre: regex,
    estado: true,
  })

  res.json({
    results: projects,
  });
};

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "projects":
      buscarProjects(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "Se le olvido hacer esta búsquda",
      });
  }
};

module.exports = {
  buscar,
};
