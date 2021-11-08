const { response } = require("express");

const Project = require('../models/projects')

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

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
  const { nombre, website , tecnologias } = req.body;
     const { tempFilePath } = req.files.img;
   const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
     folder: "Projects IMG",
   });
   // const img = secure_url;
  
  const project = new Project({ nombre, img:secure_url, website, tecnologias });

  await project.save();

  res.json({
    project,
  });
};

const projectsPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...resto } = req.body;


  const project = await Project.findByIdAndUpdate(id, resto);

  res.json({
    msg:'changed',
    project
  });
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