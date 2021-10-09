const { response } = require("express");

const Project = require('../models/projects')
const projectsGet = async (req,res = response) => {

  const { limite = 5, desde = 0 } = req.query;  
  const [total,projects] = await Promise.all([
    Project.countDocuments(),
    Project.find()
    .skip(Number(desde))
    .limit(Number(limite)),
  ]);

  res.json({
    total,
    projects,
  });
}
const projectsPost = async (req, res = response) => {
  const { nombre, img, website , tecnologias } = req.body;
  const project = new Project({ nombre, img, website, tecnologias });

  await project.save();

  res.json({
    project,
  });
};

const projectsPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...resto } = req.body;


  const project = await Project.findByIdAndUpdate(id, resto);

  res.json(project);
};

const projectsPatch = (req, res = response) => {
  res.json({
    msg: "patch API - usuariosPatch",
  });
};

const projectsDelete = async (req, res = response) => {
  const { id } = req.params;
  await Project.deleteOne({id});

  res.json({
    msg : 'deteled'
  });
};

module.exports ={
  projectsGet,
  projectsPost,
  projectsPut,
  projectsDelete,
  projectsPatch
}