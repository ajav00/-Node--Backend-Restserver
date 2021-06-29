
const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProducto, obtenerProductoPorId, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/producto');

const { existeProducto, existeCategoria } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

/**
 * {{url}}/api/productos
 */

//Obtener todas las Productos - publico
router.get('/', obtenerProducto)

//Obtener todas las Productos por id - publico
router.get('/:id', [
    check('id', 'No es un id válido de Mongo').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProductoPorId)

//Crear Producto - privado - cualquier persona con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos
], crearProducto);

//Actualizar- privado - cualquier persona con token válido
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProducto),
    validarCampos,
], actualizarProducto)

//Borrar un categoría Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido de Mongo').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], borrarProducto)


module.exports = router;