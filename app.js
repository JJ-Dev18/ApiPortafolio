require("dotenv").config();
const Server = require("./models/Server");

const app = new Server();

const server = app.listen();

module.exports= {
  app,server
}