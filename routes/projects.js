const { Router } = require("express");
const { check } = require("express-validator");
const { projectsGet } = require("../controllers/projects");
const { validarCampos } = require("../middlewares");


const router = new Router()

router.get('/', projectsGet )