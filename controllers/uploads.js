const { response } = require("express");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require("../models");

const cargarArchivos = async(req, res = response) => {
    try {
        const nombre = await subirArchivo( req.files );

        res.json({
            nombre
        });
    }
    catch(msg) {
        res.status(400).json({ msg });

    }
}

const actualizarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;
    
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Esta coleccion no existe'});
    }

    // Limpiar imagenes previas
    if( modelo.img ) {
        // Borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if( fs.existsSync( pathImagen) ) {
            fs.unlinkSync( pathImagen ); 
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion);
    modelo.img = nombre

    await modelo.save();
    
    res.json({ 
        modelo,
     });
}

const actualizarImagenCloudinary = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;
    
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Esta coleccion no existe'});
    }

    // Limpiar imagenes previas
    if( modelo.img ) {
        // Borrar la imagen del servidor
        const idImagen = modelo.img.split('/').pop().split('.')[0];

        cloudinary.uploader.destroy( idImagen, { folder: 'curso_node'} );
    }

    const { tempFilePath } = req.files.archivo;
    const resp = await cloudinary.uploader.upload(tempFilePath, { folder: 'curso_node' });

    modelo.img = resp.secure_url;

    await modelo.save();
    
    res.json({ 
        modelo,
     });
}

const mostrarImagen = async( req, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;
    
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Esta coleccion no existe'});
    }

    // Limpiar imagenes previas
    if( modelo.img ) {
        // Borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if( fs.existsSync( pathImagen) ) {
            return res.sendFile( pathImagen );
        }
    }
    
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen );
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}