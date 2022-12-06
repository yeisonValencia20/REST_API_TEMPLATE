const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        //Paths
        this.paths = {
            auth:           '/api/auth',
            buscar:         '/api/buscar',
            categoriasPath: '/api/categorias',
            productosPath:   '/api/productos',
            usuariosPath:   '/api/usuarios'
        }

        //version vieja de los paths
        // this.usuariosPath = '/api/usuarios';
        // this.authPath     = ;
        // this.categoriasPath = '/api/categorias'

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

    }

    routes() {
        
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.usuariosPath, require('../routes/usuarios'));
        this.app.use( this.paths.categoriasPath, require('../routes/categorias'));
        this.app.use( this.paths.productosPath, require('../routes/productos'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
