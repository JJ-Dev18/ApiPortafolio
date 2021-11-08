const { Router } = require("express");
const { check } = require("express-validator");
const {
  techDelete,
  techGet,
  techPath,
  techPost,
  techPut
} = require("../controllers/technology");
const {
  
  esRoleValido,
  existeTechPorId,
} = require("../helpers/db-validators");
const { validarCampos, validarJWT, tieneRole } = require("../middlewares");

const router = new Router();

router.get("/", techGet);
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
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("website", "website es obligatoria").not().isEmpty(),
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
