
const mongoose = require("mongoose");
const supertest = require("supertest");
const { server, app } = require("../app.js");
const api = supertest(app.app);

describe("create Test", () => {
  
});

afterAll(async () => {
  server.close();
  await mongoose.connection.close();
});
