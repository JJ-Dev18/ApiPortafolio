const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");

const { login, comprobarAuth} = require("../controllers/auth");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  "/comprobarToken",
  [check("token", "el token es obligatorio").not().isEmpty(), validarCampos],
  comprobarAuth
);


// router.post(
//   "/google",
//   [
//     check("id_token", "El id_token es necesario").not().isEmpty(),
//     validarCampos,
//   ],
//   googleSignin
// );

module.exports = router;
