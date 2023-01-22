const { response } = require("express");
const { updateImage } = require("../helpers/subir-archivo");

const Project = require("../models/projects");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const projectsGet = async (req, res = response) => {
  const { limite = 20, desde = 0 } = req.query ;
  const [total, projects] = await Promise.all([
    Project.countDocuments(),
    Project.find()
      .populate("tecnologias")
      .skip(Number(desde))
      .limit(Number(limite))
      .sort({complejidad: 'desc' })
      ,
  ]);

  res.json({
    total,
    projects,
  });
};
const projectsPost = async (req, res = response) => {
  const { nombre, website,complejidad, codigo, descripcion, tecnologias } = req.body;

  const { tempFilePath: temFileImg } = req.files.img;
  const { tempFilePath: temFileGif } = req.files.gif;
  console.log(req.files)
  const { secure_url: urlImg } = await cloudinary.uploader.upload(temFileImg, {
    folder: "Projects IMG",
  });
  const { secure_url: urlGif } = await cloudinary.uploader.upload(temFileGif, {
    folder: "Projects Gif",
  });
  const img = urlImg;
  const gif = urlGif;

  const project = new Project({
    nombre,
    img,
    gif,
    complejidad,
    website,
    codigo,
    descripcion,
    tecnologias,
  });

  await project.save();

  res.json({
    project,
  });
};

const projectsPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, oldImg, oldGif, ...resto } = req.body;
  console.log(req.files, "files");
  console.log(req.body, "body");
  if (req.files) {
    if (req.files.img && !req.files.gif) {
      const urlImagen = await updateImage(
        req.files.img,
        "Projects IMG",
        oldImg
      );
      const project = await Project.findByIdAndUpdate(id, {
        ...resto,
        img: urlImagen,
      });
      res.json({
        msg: "changed successfully",
        project: { ...project._doc, img: urlImagen },
      });
    }
    if (req.files.gif && !req.files.img) {
      const urlGif = await updateImage(req.files.gif, "Projects Gif", oldGif);
      const project = await Project.findByIdAndUpdate(id, {
        ...resto,
        gif: urlGif,
      });
      res.json({
        msg: "changed successfully",
        project: { ...project._doc, gif: urlGif },
      });
    }
    if(req.files.img && req.files.gif){
      const urlImg = await updateImage(req.files.img, "Projects IMG", oldImg);
      const urlGif = await updateImage(req.files.gif, "Projects Gif", oldGif);
      const project = await Project.findByIdAndUpdate(id, {
        ...resto,
        img: urlImg,
        gif: urlGif,
      });
      res.json({
        msg: "changed successfully",
        project: { ...project._doc, img: urlImg, gif: urlGif },
      });
    }
  } else {
    const project = await Project.findByIdAndUpdate(id, resto);
    res.json({
      msg: "changed successfully",
      project,
    });
  }
};

const projectsPatch = (req, res = response) => {
  res.json({
    msg: "patch API - usuariosPatch",
  });
};

const projectsDelete = async (req, res = response) => {
  const { id } = req.params;

  const modelo = await Project.findById(id);
  const nombreImgSplit = modelo.img.split("/");
  const nombreImg = nombreImgSplit[nombreImgSplit.length - 1];
  const [idImg] = nombreImg.split(".");

  const nombreGifSplit = modelo.gif.split("/");
  const nombreGif = nombreGifSplit[nombreGifSplit.length - 1];
  const [idGif] = nombreGif.split(".");

  cloudinary.uploader.destroy(`Projects IMG/${idImg}`);
  cloudinary.uploader.destroy(`Projects Gif/${idGif}`);

  await Project.deleteOne({ _id: id });

  res.json({
    msg: "deteled",
  });
};

module.exports = {
  projectsGet,
  projectsPost,
  projectsPut,
  projectsDelete,
  projectsPatch,
};
