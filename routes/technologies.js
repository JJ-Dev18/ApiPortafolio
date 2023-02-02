const { Router } = require("express");
const { check } = require("express-validator");
const {
  techDelete,
  techGet,
  techPath,
  techPost,
  techPut,
  TechGetOne
} = require("../controllers/technology");
const {
  
  esRoleValido,
  existeTechPorId,
} = require("../helpers/db-validators");
const {
  validarCampos,
  validarJWT,
  tieneRole,
  validarArchivosTechnology,
} = require("../middlewares");

const router = new Router();

router.get("/", techGet);
router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeTechPorId),
    validarCampos,
  ],
  TechGetOne
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeTechPorId),
    validarCampos,
  ],
  techPut
);

router.post(
  "/",
  [
    validarJWT,
    validarArchivosTechnology,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  techPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeTechPorId),
    validarCampos,
  ],
  techDelete
);

router.patch("/", techPath);

module.exports = router;
