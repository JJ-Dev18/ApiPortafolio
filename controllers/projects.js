const { response } = require("express");

const Project = require('../models/projects')

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const projectsGet = async (req,res = response) => {

  const { limite = 10, desde = 0 } = req.query;  
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
  const { nombre, website ,codigo,descripcion, tecnologias } = req.body;
  
  const { tempFilePath : temFileImg } = req.files.img;
  const { tempFilePath: temFileGif } = req.files.gif;

   const { secure_url: urlImg } = await cloudinary.uploader.upload(temFileImg, {
     folder: "Projects IMG",
   });
    const { secure_url: urlGif } = await cloudinary.uploader.upload(
      temFileGif,
      {
        folder: "Projects Gif",
      }
    );
   const img = urlImg;
   const gif = urlGif
  
  const project = new Project({ nombre, img,gif, website ,codigo,descripcion,tecnologias});

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

  const modelo = await Project.findById(id);
  const nombreArr = modelo.img.split("/");
  const nombre = nombreArr[nombreArr.length - 1];
  const [public_id] = nombre.split(".");
  cloudinary.uploader.destroy(`Projects IMG/${public_id}`);

  await Project.deleteOne({_id:id});

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