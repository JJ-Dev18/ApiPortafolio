const mongoose = require("mongoose");
const supertest = require("supertest");
const { server, app } = require("../app.js");
const path = require("path");
const api = supertest(app.app);
const picture = path.resolve(__dirname,'../uploads/imgs/e.png')

console.log(picture)
describe("Get Projects", () => {
  test("Should projects are returned as json", async () => {
    await api
      .get("/api/projects")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return up to 4 projects  ", async () => {
    const response = await api
      .get("/api/projects?limite=4")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.projects.length).toBeLessThanOrEqual(4);
  });
});

describe("POST Project", () => {
  const user = {
    correo: "test12@test.com",
    password: "123456",
  };

  const newProject = {
    nombre: "Testint Create project",
    website: "testing.com",
    codigo: "testing@github",
    descripcion: "testing project",
    complejidad : 2,
    tecnologias: [],
  };

  test("Create a project without JWT token", async () => {
    const response = await api
      .post("/api/projects")
      .send(newProject)
      .expect(401);
    expect(response.body.msg).toMatch("No hay token en la petición");
  });

  test("Create a project with a JWT Token expired or invalid", async () => {
    const response = await api
      .post("/api/projects")
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisGs"
      )
      .send(newProject)
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
  });

  test("Create project withouth images", async () => {
    const login = await api.post("/api/auth/login").send(user);
    const token = login.body.token;
    const response = await api
      .post("/api/projects")
      .set("x-token", token)
      .send(newProject)
      .expect(400);

    expect(response.body.msg).toMatch(
      "No hay archivos que subir - validarArchivoSubir2"
    );
  });

  test("Create correctly a project", async () => {
    const login = await api.post("/api/auth/login").send(user);
    const token = login.body.token;
    const response = await api
      .post("/api/projects")
      .set("x-token", token)
      .field("nombre", newProject.nombre)
      .field("descripcion", newProject.descripcion)
      .field("codigo", newProject.codigo)
      .field("website", newProject.website)
      .field("complejidad", newProject.complejidad)
      .field("tecnologias", "6189859f1f836daef1e341a4")
      .field("tecnologias", "618985af1f836daef1e341a7")
      .attach("img", picture)
      .attach("gif", picture)
      .expect(200);
  });
});

afterAll((done) => {
  server.close();
  mongoose.connection.close();
  done();
});
