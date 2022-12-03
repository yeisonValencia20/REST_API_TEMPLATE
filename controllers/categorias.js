const { response, request } = require("express");


const getCategorias = (req = request, res = response) => {
    res.json('todas las categorias')
}

module.exports = {
    getCategorias
}