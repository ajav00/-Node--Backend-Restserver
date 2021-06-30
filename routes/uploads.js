const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary, mostrarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivos, validarCampos } = require('../middlewares');

const router = Router();

router.post('/', validarArchivos, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivos,
    check('id', 'No es un id válido de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
// ], actualizarImagen)
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
    check('id', 'No es un id válido de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
// ], mostrarImagen)
], mostrarImagenCloudinary)




module.exports = router;