const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');


const esRoleValido = async (rol = ' ') =>{
    const existeRol = await Role.findOne({ rol });
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la DB`);
    }
}

const emailExiste = async (correo = '' ) => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya está registrado`);
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id ${id} no existe`);
    }
}

const existeCategoria = async (id) => {
    const exCategoria = await Categoria.findById(id);
    if(!exCategoria){
        throw new Error(`El id ${id} no existe en categoria`);
    }
}

const existeProducto = async (id) => {
    const exProducto = await Producto.findById(id);
    if(!exProducto){
        throw new Error(`El id ${id} no existe en Producto`);
    }
}

/**
 * Validar colecciones permitidas
 */

const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{
    const incluida = colecciones.includes(coleccion);
    if(!incluida) {
        throw new Error(`La colección ${coleccion} no es perimitida`);
    }
    return true;
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas,
}