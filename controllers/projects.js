const { response } = require("express");

const Project = require('../models/projects')
const projectsGet = (req,resp = response) => {

  const { limite = 5, desde = 0 } = req.query;  
  const [total, projects] = await Promise.all([
    Project.countDocuments(query),
    Project.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);
}

module.exports ={
  projectsGet
}