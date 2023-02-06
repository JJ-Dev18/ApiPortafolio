const mongoose = require("mongoose");
const supertest = require("supertest");
const { server, app } = require("../app.js");
const {  comprobarJWT } = require("../helpers/generar-jwt");

const api = supertest(app.app);



describe("Login Test", () => {
  test("email format incorrect", async () => {
    const response = await api
      .post("/api/auth/login")
      .send({ correo: "incorrect", password: "1234" })
      .expect(400);

    expect(response.body.errors[0].msg).toMatch("No es un correo valido");
    expect(response.body.errors[0].param).toMatch("correo");

    console.log(response.body);
  });

  test("withouth email", async () => {
    const response = await api
      .post("/api/auth/login")
      .send({ password: "1234" })
      .expect(400);

    expect(response.body.errors[0].msg).toMatch("El correo es obligatorio");
    expect(response.body.errors[0].param).toMatch("correo");
    expect(response.body.errors[1].msg).toMatch("No es un correo valido");
    expect(response.body.errors[1].param).toMatch("correo");
    console.log(response.body);
  });

  test("without password", async () => {
    const response = await api
      .post("/api/auth/login")
      .send({ correo: "test123@test.com" })
      .expect(400);

    expect(response.body.errors[0].msg).toMatch("La contraseña es obligatoria");
    expect(response.body.errors[0].param).toMatch("password");
  });

  test("with correo incorrect", async () => {
    const response = await api
      .post("/api/auth/login")
      .send({ correo: "test1223@test.com", password: "123" })
      .expect(400);

    expect(response.body.msg).toMatch(
      "Usuario / Password no son correctos - correo"
    );
  });
  test("with password incorrect", async () => {
    const response = await api
      .post("/api/auth/login")
      .send({ correo: "test12@test.com", password: "123" })
      .expect(400);

    expect(response.body.msg).toMatch(
      "Usuario / Password no son correctos - password"
    );
  });
   test("user with state false", async () => {
     const response = await api
       .post("/api/auth/login")
       .send({ correo: "test18@test.com", password: "123456" })
       .expect(400);

     expect(response.body.msg).toMatch(
       "Usuario / Password no son correctos - estado: false"
     );
   });

   test('Login success', async () => { 
     const response = await api
       .post("/api/auth/login")
       .send({ correo: "test12@test.com", password: "123456" })
       .expect(200);

       console.log(response.body.token)
       expect(response.body.usuario.estado).toBe(true)
       
       expect(comprobarJWT(response.body.token)).not.toBeNull();
    })
});

afterAll(async () => {
  server.close();
  await mongoose.connection.close();
});
