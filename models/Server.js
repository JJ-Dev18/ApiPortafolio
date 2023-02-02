const express = require("express");

//permitir o no paginas (whitelist) (blacklist) CORS 
const cors = require("cors");
const { dbConnection, dbDisconnection } = require("../Db/config");
const fileUpload = require("express-fileupload");

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: "/api/auth",
      usuarios: "/api/usuarios",
      projects: "/api/projects",
      buscar: "/api/buscar",
      uploads: "/api/uploads",
      technology: "/api/technologies"
    };
    this.conectarDb()
    this.middlewares();
    this.routes()

      

  }
  async conectarDb(){
     await dbConnection()
  }
   desconectarDb(){
     dbDisconnection()
  }
  middlewares(){
    //CORS
    this.app.use(cors())
    //Lectura y parseo del body
    this.app.use(express.json())
    //Directorio publico
    this.app.use(express.static('public'))
     this.app.use(
       fileUpload({
         useTempFiles: true,
         tempFileDir: "/tmp/",
         createParentPath: true,
       })
     );
  }

  routes(){
     this.app.use(this.paths.auth, require('../routes/auth'))
     this.app.use(this.paths.usuarios, require('../routes/usuarios'))
     this.app.use(this.paths.projects, require('../routes/projects'))
     this.app.use(this.paths.buscar, require('../routes/buscar'))
     this.app.use(this.paths.uploads, require('../routes/uploads'))
     this.app.use(this.paths.technology, require('../routes/technologies'))
  }

  listen(){
      return  this.app.listen(this.port, ()=> {
       console.log('Servidor corriendo en puerto,', this.port)
    })
  }
}

module.exports = Server