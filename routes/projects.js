const { Router } = require("express");
const { check } = require("express-validator");
const { projectsGet, projectsPut, projectsPost, projectsDelete, projectsPatch, projectGet } = require("../controllers/projects");
const { existeProjectPorId, esRoleValido } = require("../helpers/db-validators");
const { validarCampos, validarJWT, tieneRole, validarArchivoSubir } = require("../middlewares");


const router = new Router()

router.get('/', projectsGet )
router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProjectPorId),
    validarCampos,
  ],
  projectGet
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProjectPorId),
    validarCampos,
  ],
  projectsPut
);

router.post(
  "/",
  [
    validarJWT,
    validarArchivoSubir,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("website", "website es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  projectsPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProjectPorId),
    validarCampos,
  ],
  projectsDelete
);

router.patch("/", projectsPatch);

module.exports = router;