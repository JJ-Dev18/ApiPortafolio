const mongoose = require("mongoose");
const supertest = require("supertest");
const { server, app } = require("../app.js");
var randomEmail = require("random-email");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const api = supertest(app.app);

let idNew;
// console.log(process.env.PORT)
describe("Post users", () => {
  let user = {
    nombre: "juan",
    correo: "test1@test1.com",
    password: "123456",
    rol: "USER_ROLE",
  };
  test("create withouth name", async () => {
    const response = await api
      .post("/api/usuarios")
      .send({
        correo: "test1@test1.com",
        password: "123456",
        rol: "ADMIN_ROLE",
      })
      .expect(400);

    expect(response.body.errors[0].msg).toMatch("El nombre es obligatorio");
  });
  test("create withouth email", async () => {
    const response = await api
      .post("/api/usuarios")
      .send({
        nombre: "Juan",
        password: "123456",
        rol: "ADMIN_ROLE",
      })
      .expect(400);

    expect(response.body.errors[0].msg).toMatch("El correo no es válido");
  });
  test("create withouth password", async () => {
    const response = await api
      .post("/api/usuarios")
      .send({
        nombre: "juan",
        correo: "test1@test.com",
        rol: "ADMIN_ROLE",
      })
      .expect(400);

    expect(response.body.errors[0].msg).toMatch(
      "El password debe de ser más de 6 letras"
    );
  });

  test("create withouth rol", async () => {
    const response = await api
      .post("/api/usuarios")
      .send({
        nombre: "juan",
        correo: "test1@test1.com",
        password: "123456",
      })
      .expect(400);
    expect(response.body.errors[0].msg).toMatch(
      "El rol  no está registrado en la BD"
    );
  });
  test("create with incorrect rol", async () => {
    const response = await api
      .post("/api/usuarios")
      .send({
        nombre: "juan",
        correo: "test1@test1.com",
        password: "123456",
        rol: "DOCTOR_ROLE",
      })
      .expect(400);
    expect(response.body.errors[0].msg).toMatch(
      "El rol DOCTOR_ROLE no está registrado en la BD"
    );
  });

  test("create with existing mail ", async () => {
    const response = await api
      .post("/api/usuarios")
      .send({
        nombre: "juan",
        correo: "test18@test.com",
        password: "123456",
        rol: "ADMIN_ROLE",
      })
      .expect(400);
    expect(response.body.errors[0].msg).toMatch(
      "El correo: test18@test.com, ya está registrado"
    );
  });
  test("create user success ", async () => {
    const response = await api
      .post("/api/usuarios")
      .send({
        nombre: "juan",
        correo: randomEmail({ domain: "test.com" }),
        password: "123456",
        rol: "ADMIN_ROLE",
      })
      .expect(200);
    idNew = response.body.usuario.uid;
  });
});
describe("Get users", () => {
  test("Should users are returned as json", async () => {
    await api
      .get("/api/usuarios")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return up to 4 users  ", async () => {
    const response = await api.get("/api/usuarios?limite=4").expect(200);
    expect(response.body.usuarios.length).toBeLessThanOrEqual(4);
  });

  test("get users estado= true", async () => {
    const response = await api.get("/api/usuarios").expect(200);
    response.body.usuarios.forEach((element) => {
      expect(element.estado).toBe(true);
    });
  });

  test("Get a user  with invalid MONGOID ", async () => {
    const resp = await api.get("/api/usuarios/1231231").expect(400);

    expect(resp.body.errors[0].msg).toMatch("No es un ID válido");
  });
  test("Get a user  that Doesnt exist", async () => {
    const resp = await api
      .get("/api/usuarios/63cc84f8365a4df80ffa161d")
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch(
      "El id no existe 63cc84f8365a4df80ffa161d"
    );
  });

  test("Get a specific user byID success", async () => {
    const resp = await api.get(`/api/usuarios/${idNew}`).expect(200);

    expect(resp.body.usuario).not.toBeNull();
  });
});
describe("Delete user", () => {
  let token;

  beforeAll(async () => {
    const response = await api
      .post("/api/auth/login")
      .send({ correo: "test12@test.com", password: "123456" })
      .expect(200);
    token = response.body.token;
  });
  test("Delete an user without JWT", async () => {
    const response = await api.delete(`/api/usuarios/${idNew}`).expect(401);
    expect(response.body.msg).toMatch("No hay token en la petición");
  });

  test("Delete an user  with a expired JWT", async () => {
    const response = await api
      .delete(`/api/usuarios/${idNew}`)
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisGs"
      )
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
    expect(response.body.error.msg).toMatch("jwt expired");
  });
  test("Delete an user  with a invalid JWT", async () => {
    const response = await api
      .delete(`/api/usuarios/${idNew}`)
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisG"
      )
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
    expect(response.body.error.msg).toMatch("Invalid Token");
  });
  test("Delete an user  with invalid MONGOID ", async () => {
    const resp = await api
      .delete("/api/usuarios/1231231")
      .set("x-token", token)
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch("No es un ID válido");
  });
  test("delete an user  that Doesnt exist", async () => {
    const resp = await api
      .delete("/api/usuarios/63cc84f8365a4df80ffa161d")
      .set("x-token", token)
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch(
      "El id no existe 63cc84f8365a4df80ffa161d"
    );
  });
  test("Deleted a Technology succeed", async () => {
    const resp = await api
      .delete(`/api/usuarios/${idNew}`)
      .set("x-token", token)
      .expect(200);

    expect(resp.body.estado).toBe(false);
  });
});

describe("Put user", () => {
  test("Put an user  with invalid MONGOID ", async () => {
    const resp = await api.put("/api/usuarios/1231231").expect(400);

    expect(resp.body.errors[0].msg).toMatch("No es un ID válido");
  });
  test("put an user  that Doesnt exist", async () => {
    const resp = await api
      .put("/api/usuarios/63cc84f8365a4df80ffa161d")
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch(
      "El id no existe 63cc84f8365a4df80ffa161d"
    );
  });
  test("put an user with incorrect role", async () => {
    const resp = await api
      .put(`/api/usuarios/${idNew}`)
      .send({ rol: "DOCTOR_ROLE" })
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch(
      "El rol DOCTOR_ROLE no está registrado en la BD"
    );
  });
  test("put an user succed", async () => {
    const resp = await api
      .put(`/api/usuarios/${idNew}`)
      .send({
        nombre: "Juan test 2 changed",
        password: "12345678",
        rol: "ADMIN_ROLE",
      })
      .expect(200);
    const correo = resp.body.correo;
    const usuario = await Usuario.findOne({ correo });
    const validPassword = bcryptjs.compareSync("12345678", usuario.password);
    expect(validPassword).toBe(true);
  });
});

afterAll(async () => {
  const resp =  await api
  .delete(`/api/usuarios/test/${idNew}`)
  .expect(200);
  expect(resp.body.msg).toMatch("deleted")
  await mongoose.connection.close();
  server.close();
});
