const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuario = async( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ){
        const usuario = await Usuario.findById(termino);
        return res.json({
            resulst: usuario ? [ usuario ] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    res.json(usuarios)
}

const buscarCategoria = async( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ){
        const categoria = await Categoria.findById(termino);
        return res.json({
            resulst: categoria ? [ categoria ] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const categorias = await Categoria.find({ nombre: regex, estado: true });
    res.json(categorias)
}

const buscarProducto = async( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid( termino );

    if( esMongoId ){
        const producto = await Producto.findById(termino)
                                .populate('categoria', 'nombre');
        return res.json({
            resulst: producto ? [ producto ] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const productos = await Producto.find({ nombre: regex, estado: true })
                            .populate('categoria', 'nombre');;
    res.json(productos)
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;


    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino,res)
        break;
        case 'categorias':
            buscarCategoria(termino,res)
        break;
        case 'productos':
            buscarProducto(termino, res)
        break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }
}

module.exports = {
    buscar
}