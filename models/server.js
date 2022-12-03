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
            categoriasPath: '/api/categorias',
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
        this.app.use( this.paths.usuariosPath, require('../routes/usuarios'));
        this.app.use( this.paths.categoriasPath, require('../routes/categorias'))
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
