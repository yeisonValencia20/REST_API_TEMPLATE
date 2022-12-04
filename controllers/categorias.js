const { response, request } = require("express");
const { Categoria } = require('../models')


const getCategorias = async(req = request, res = response) => {
    
    const { desde = 0, hasta = 5 } = req.query;
    
    const [ total, categorias ] = await Promise.all([
        Categoria.count({ estado: true }),
        Categoria.find({ estado: true })
        .populate('usuario','nombre')
        .skip( Number(desde) )
        .limit( Number(hasta) )
    ]);

    res.status(200).json({
        total,
        categorias
    })
}

const getCategoriaId = async(req = request, res = response) => {
    
    const categoriaId = req.params.id;
    const categoria = await Categoria.findById(categoriaId).populate('usuario', 'nombre');

    res.status(200).json({
        categoria
    })
}

const crearCategoria = async(req = request, res = response) => {
    
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB  = await Categoria.findOne({ nombre });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        })
    }
    
    // preparamos la data para guardar en la base de datos
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    // guardar en la base de datos
    const categoria =  new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);
}

const actualizarCategoria = async(req = request, res =  response) => {

    const categoriaId = req.params.id;
    const nombreCategoria =  req.body.nombre.toUpperCase();

    const categoria = await Categoria.findOne({ nombre: nombreCategoria });

    if(categoria) {
        return res.status(400).json({
            msg: `La categoria ${ nombreCategoria } ya existe`
        })
    }

    const categoriaUpdate =  await Categoria.findByIdAndUpdate(categoriaId, { nombre: nombreCategoria, usuario: req.usuario._id }, { new: true });

    res.status(201).json({
        categoriaUpdate
    })

}

const borrarCategoria = async(req = request, res = response) => {

    const categoriaId = req.params.id;
    const categoriaDelete = await Categoria.findByIdAndUpdate(categoriaId, { estado: false }, { new: true });

    res.status(200).json(categoriaDelete);
}

module.exports = {
    getCategorias,
    getCategoriaId,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}