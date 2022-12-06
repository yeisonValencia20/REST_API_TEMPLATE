const { Router } = require('express');
const { check, oneOf, body } = require('express-validator');


const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { getProductos,
        crearProducto,
        getProductoId,
        actualizarProducto,
        borrarProducto, 
        getProductoCategoria} = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();


// obtener todas las producto -  publico
router.get('/', getProductos);

// obtener producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], getProductoId)

// obtener productos por categoria - publico
router.get('/categoria/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], getProductoCategoria)

// crear producto - privado - cualquier persona con un token valido
router.post('/', [
     validarJWT,
     check('nombre', 'El nombre es obligatorio').notEmpty(),
     check('categoria', 'No es un id de mongo valido').isMongoId(),
     check('categoria').custom( existeCategoriaPorId ),
     validarCampos 
], crearProducto)

// actualizar producto - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    oneOf([
        check('nombre',).exists({ checkFalsy: true }),
        check('categoria').isMongoId().bail()
                          .custom(existeCategoriaPorId),
        check('precio').exists({ checkFalsy: true }),
        check('descripcion').exists({ checkFalsy: true }),
        check('disponible').exists({ checkFalsy: true }),
    ], 'tiene que enviar al menos un parametro valido'),
    validarCampos
], actualizarProducto)


// borrar producto - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto)

module.exports = router;