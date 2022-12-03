const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');

const { getCategorias } = require('../controllers/categorias');


const router = Router();


// obtener todas las categorias -  publico
router.get('/', getCategorias);

// obtener categoria por id - publico
router.get('/:id', (req, res) => {
    res.json('get id')
})

// crear categoria - privado - cualquier persona con un token valido
router.post('/', (req, res) => {
    res.json('crear categoria')
})

// actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', (req, res) => {
    res.json('actualizar categoria')
})


// borrar categoria - privado - Admin
router.delete('/:id', (req, res) => {
    res.json('borrar categoria')
})

module.exports = router;