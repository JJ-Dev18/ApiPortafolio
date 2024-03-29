const Role = require('../models/role');
const { Usuario, Project, Producto,Technology } = require('../models');

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Categorias
 */
const existeProjectPorId = async( id ) => {

    // Verificar si el correo existe
    const existeProject = await Project.findById(id);
    if ( !existeProject ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Productos
 */
const existeProductoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(
      `La colección ${coleccion} no es permitida, ${colecciones}`
    );
  }
  return true;
};

// Technologies
const existeTechPorId = async (id) => {
  // Verificar si el correo existe
  const existeTech = await Technology.findById(id);
  if (!existeTech) {
    throw new Error(`El id no existe ${id}`);
  }
};


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeProjectPorId,
    existeProductoPorId,
    coleccionesPermitidas,
    existeTechPorId
}

