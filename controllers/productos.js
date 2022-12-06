const { response, request } = require("express");
const { Producto } = require('../models')


const getProductos = async(req = request, res = response) => {
    
    const { desde = 0, hasta = 5 } = req.query;
    
    const [ total, productos ] = await Promise.all([
        Producto.count({ estado: true }),
        Producto.find({ estado: true })
        .populate('usuario')
        .populate('categoria')
        .skip( Number(desde) )
        .limit( Number(hasta) )
    ]);

    res.status(200).json({
        total,
        productos
    })
}

const getProductoId = async(req = request, res = response) => {
    
    const productoID = req.params.id;
    const producto = await Producto.findById(productoID)
                    .populate('usuario', 'nombre')
                    .populate('categoria','nombre');

    res.status(200).json({
        producto
    })
}

const getProductoCategoria = async(req = request, res = response) => {
    
    const categoriaID = req.params.id;
    const producto = await Producto.find({ categoria: categoriaID })
                    .populate('categoria','nombre');

    res.status(200).json({
        producto
    })
}

const crearProducto = async(req = request, res = response) => {
    
    const { estado, disponible, usuario, ...producto } = req.body;
    producto.nombre = producto.nombre.toUpperCase();

    const productoDB  = await Producto.findOne({ nombre: producto.nombre });

    if( productoDB ) {
        return res.status(400).json({
            msg: `el producto ${ productoDB.nombre }, ya existe`
        })
    }
    
    // preparamos la data para guardar en la base de datos
    const data = {
        ...producto,
        usuario: req.usuario._id
    }

    // guardar en la base de datos
    const createdProducto =  new Producto(data);
    await createdProducto.save();

    res.status(201).json(createdProducto);
}

const actualizarProducto = async(req = request, res =  response) => {

    const productoID = req.params.id;
    const { estado, usuario, ...producto } = req.body;

    const productoUpdate =  await Producto.findByIdAndUpdate(productoID, { ...producto, usuario: req.usuario._id }, { new: true });

    res.status(201).json({
        productoUpdate
    })

}

const borrarProducto = async(req = request, res = response) => {

    const productoID = req.params.id;
    const categoriaDelete = await Producto.findByIdAndUpdate(productoID, { estado: false }, { new: true });

    res.status(200).json(categoriaDelete);
}

module.exports = {
    getProductos,
    crearProducto,
    getProductoId,
    getProductoCategoria,
    actualizarProducto,
    borrarProducto
}