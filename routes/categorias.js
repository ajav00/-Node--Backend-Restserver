const { genSalt } = require('bcryptjs');
const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategoria, obtenerCategoriaPorId, actualizarCategoria, borrarCategoria } = require('../controllers/categoria');
const { existeCategoria } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//Obtener todas las categorias - publico
router.get('/', obtenerCategoria)

//Obtener todas las categorias por id - publico
router.get('/:id', [
    check('id', 'No es un id válido de Mongo').isMongoId(),
    check('id').custom( existeCategoria),
    validarCampos
], obtenerCategoriaPorId)

//Crear categoria - privado - cualquier persona con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar- privado - cualquier persona con token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido de Mongo').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarCategoria)

//Borrar un categoría Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido de Mongo').isMongoId(),
    check('id').custom( existeCategoria),
    validarCampos
], borrarCategoria)


module.exports = router;