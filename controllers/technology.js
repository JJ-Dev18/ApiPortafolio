const { response } = require("express");
const { updateImage } = require("../helpers/subir-archivo");

const Technology = require("../models/technologies");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const techGet = async (req, res = response) => {
  const { limite = 20, desde = 0 } = req.query;
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
  const { nombre } = req.body;
  
    const { tempFilePath } = req.files.img;

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
      folder: "Technologies IMG",
    });
    // const img = secure_url;
  const tech = new Technology({ nombre, img:secure_url });
   
  await tech.save();

  res.json({
    tech,
  });
};

const techPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, nombre, oldImg } = req.body;
  if(req.files){
    const urlImagen = await updateImage(req.files.img,"Technologies IMG",oldImg);
    const tech = await Technology.findByIdAndUpdate(id, {nombre, img :  urlImagen });
     res.json({
       msg: "changed successfully",
       tech,
     });
  }else{
    const tech = await Technology.findByIdAndUpdate(id, {
      nombre,
    });
     res.json({
       msg: "changed successfully",
       tech,
     });
  }
 
};

const techPath = (req, res = response) => {
  res.json({
    msg: "patch API - usuariosPatch",
  });
};

const techDelete = async (req, res = response) => {
  const { id } = req.params;
  const modelo = await Technology.findById(id);

   const nombreArr = modelo.img.split("/");
   const nombre = nombreArr[nombreArr.length - 1];
   const [public_id] = nombre.split(".");

   cloudinary.uploader.destroy(`Technologies IMG/${public_id}`);

  await Technology.deleteOne({ _id: id });

  res.json({
    msg:"deleted",
  });
};

module.exports = {
  techDelete,
  techGet,
  techPath,
  techPut,
  techPost,
};
