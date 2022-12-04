const { Router } = require('express');
const { check } = require('express-validator');


const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { getCategorias,
        crearCategoria,
        getCategoriaId,
        actualizarCategoria,
        borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();


// obtener todas las categorias -  publico
router.get('/', getCategorias);

// obtener categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], getCategoriaId)

// crear categoria - privado - cualquier persona con un token valido
router.post('/', [
     validarJWT,
     check('nombre', 'El nombre es obligatorio').notEmpty(),
     validarCampos 
], crearCategoria)

// actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria)


// borrar categoria - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria)

module.exports = router;