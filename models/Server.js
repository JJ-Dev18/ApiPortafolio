const express = require("express");

//permitir o no paginas (whitelist) (blacklist) CORS 
const cors = require("cors");
const { dbConnection } = require("../Db/config");

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths ={
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      projects: '/api/projects'
    }
    this.conectarDb()
    this.middlewares();

    this.routes()
  }
  async conectarDb(){
     await dbConnection()
  }
  middlewares(){
    //CORS
    this.app.use(cors())
    //Lectura y parseo del body
    this.app.use(express.json())
    //Directorio publico
    this.app.use(express.static('public'))
  }

  routes(){
     this.app.use(this.paths.auth, require('../routes/auth'))
     this.app.use(this.paths.usuarios, require('../routes/usuarios'))
     this.app.use(this.paths.projects, require('../routes/projects'))
  }

  listen(){
    this.app.listen(this.port, ()=> {
       console.log('Servidor corriendo en puerto,', this.port)
    })
  }
}

module.exports = Server