const { response } = require("express");

const Technology = require("../models/technologies");

const techGet = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const [total, techs] = await Promise.all([
    Technology.countDocuments(),
    Technology.find().skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    techs,
  });
};
const techPost = async (req, res = response) => {
  const { nombre, img, website, tecnologias } = req.body;
  const tech = new Technology({ nombre, img, website, tecnologias });

  await tech.save();

  res.json({
    tech,
  });
};

const techPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...resto } = req.body;

  const tech = await Technology.findByIdAndUpdate(id, resto);

  res.json({
    msg: "changed",
    tech,
  });
};

const techPath = (req, res = response) => {
  res.json({
    msg: "patch API - usuariosPatch",
  });
};

const techDelete = async (req, res = response) => {
  const { id } = req.params;
  await Technology.deleteOne({ id });

  res.json({
    msg: "deteled",
  });
};

module.exports = {
  techDelete,
  techGet,
  techPath,
  techPut,
  techPost,
};
