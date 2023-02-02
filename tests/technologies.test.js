const mongoose = require("mongoose");
const supertest = require("supertest");
const { server, app } = require("../app.js");
const path = require("path");
const api = supertest(app.app);
const picture = path.resolve(__dirname, "../uploads/imgs/1.png");

const user = {
  correo: "test12@test.com",
  password: "123456",
};
let newTechnology;
beforeAll(async () => {
  const login = await api.post("/api/auth/login").send(user);
  token = login.body.token;
  const technologyNew = await api
    .post("/api/technologies")
    .set("x-token", token)
    .field("nombre", "Technology test")
    .attach("img", picture)
    .expect(200);
  newTechnology = technologyNew.body.tech;
}, 6000);

describe("POST Technology", () => {
  let idNew;
  test("Create a Technology without JWT token", async () => {
    const response = await api
      .post("/api/technologies")
      .field("nombre", "Technology test")
      .attach("img", picture)
      .expect(401);
    expect(response.body.msg).toMatch("No hay token en la petición");
  });

  test("Create a Technology with a JWT Token expired", async () => {
    const response = await api
      .post("/api/technologies")
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisGs"
      )
      .field("nombre", "Technology test")
      .attach("img", picture)
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
    expect(response.body.error.msg).toMatch("jwt expired");
  });

  test("Create a Technology with a JWT Token invalid", async () => {
    const response = await api
      .post("/api/technologies")
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKis"
      )
      .field("nombre", "Technology test")
      .attach("img", picture)
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
    expect(response.body.error.msg).toMatch("Invalid Token");
  });

  test("Create Technology withouth images", async () => {
    const response = await api
      .post("/api/technologies")
      .set("x-token", token)
      .field("nombre", "Technology test")
      .expect(400);

    expect(response.body.msg).toMatch(
      "No hay archivos que subir - validarArchivoSubir2"
    );
  });

  test("Create correctly a Technology", async () => {
    const resp = await api
      .post("/api/technologies")
      .set("x-token", token)
      .field("nombre", "Technology test")
      .attach("img", picture)
      .expect(200);

    idNew = resp.body.tech._id;
  });

  test("Create a Technology withouth name SHOULD RETURN STATUS 400", async () => {
    const resp = await api
      .post("/api/technologies")
      .set("x-token", token)
      .attach("img", picture)
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch("El nombre es obligatorio");
    expect(resp.body.errors[0].param).toMatch("nombre");
  });
 

  afterAll(async () => {
    const resp = await api
      .delete(`/api/technologies/${idNew}`)
      .set("x-token", token)
      .expect(200);

    expect(resp.body.msg).toMatch("deleted");
  });
});

describe("Get Technologies", () => {
  test("Should Technologies are returned as json", async () => {
    await api
      .get("/api/technologies")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
    test("Should return up to 4 technologies  ", async () => {
      const response = await api.get("/api/technologies?limite=4").expect(200);

      console.log(response.body)
      expect(response.body.techs.length).toBeLessThanOrEqual(4);
    });

     describe("Get Technology", () => {
       test("request a Technology without JWT token", async () => {
         const response = await api
           .get(`/api/technologies/${newTechnology._id}`)
           .expect(401);
         expect(response.body.msg).toMatch("No hay token en la petición");
       });

       test("Get a Technology with a JWT Token expired", async () => {
         const response = await api
           .get(`/api/technologies/${newTechnology._id}`)
           .set(
             "x-token",
             "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisGs"
           )
           .expect(401);
         expect(response.body.msg).toMatch("Token no válido");
         expect(response.body.error.msg).toMatch("jwt expired");
       });

       test("Get a Technology with a JWT Token invalid", async () => {
         const response = await api
           .get(`/api/technologies/${newTechnology._id}`)
           .set(
             "x-token",
             "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKis"
           )
           .expect(401);
         expect(response.body.msg).toMatch("Token no válido");
         expect(response.body.error.msg).toMatch("Invalid Token");
       });
       test("Get a Technology with invalid MONGOID ", async () => {
         const resp = await api
           .get("/api/technologies/1231231")
           .set("x-token", token)
           .expect(400);

         expect(resp.body.errors[0].msg).toMatch("No es un ID válido");
       });
       test("Get a Technology that Doesnt exist", async () => {
         const resp = await api
           .get("/api/technologies/63cc84f8365a4df80ffa161d")
           .set("x-token", token)
           .expect(400);

         expect(resp.body.errors[0].msg).toMatch(
           "El id no existe 63cc84f8365a4df80ffa161d"
         );
       });

       test("Get a specific Technology byID success", async () => {
         const resp = await api
           .get(`/api/technologies/${newTechnology._id}`)
           .set("x-token", token)
           .expect(200);

         expect(resp.body.tech).not.toBeNull();
         expect(resp.body.tech).toMatchObject(newTechnology);
       });
     });
});
describe("PUT Technology ", () => {
  let oldImg;
  beforeEach(async () => {
    const response = await api
      .get(`/api/technologies/${newTechnology._id}`)
      .set("x-token", token);
   
    oldImg = response.body.tech.img;
  });
  test("UPDATED a Technology with invalid MONGOID ", async () => {
    const resp = await api
      .put("/api/technologies/1231231")
      .set("x-token", token)
      .send({ nombre: '3' })
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch("No es un ID válido");
  });
  test("UPDATED a Technology that Doesnt exist", async () => {
    const resp = await api
      .put("/api/technologies/63cc84f8365a4df80ffa161d")
      .set("x-token", token)
      .send({ nombre: "3" })
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch(
      "El id no existe 63cc84f8365a4df80ffa161d"
    );
  });

  test("UPDATED a Technology without JWT token", async () => {
    const response = await api
      .put("/api/technologies/63cc84f8365a4df80ffa161c")
      .send({ nombre: "3" })
      .expect(401);
    expect(response.body.msg).toMatch("No hay token en la petición");
  });

  test("UPDATED a Technology with a JWT Token expired ", async () => {
    const response = await api
      .put("/api/technologies/63cc84f8365a4df80ffa161c")
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisGs"
      )
      .send({ nombre: "3" })
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
    expect(response.body.error.msg).toMatch("jwt expired");
  });

  test("Create a Technology with a JWT Token invalid", async () => {
    const response = await api
      .put("/api/technologies/63cc84f8365a4df80ffa161c")
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKis"
      )
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
    expect(response.body.error.msg).toMatch("Invalid Token");
  });
  test("UPDATED name a Technology", async () => {
    const resp = await api
      .put(`/api/technologies/${newTechnology._id}`)
      .set("x-token", token)
      .field("nombre", 'Technology test2')
      .expect(200);

    expect(resp.body.msg).toMatch("changed successfully");
  });

 

  test("UPDATED a Technology with IMG", async () => {
    const resp = await api
      .put(`/api/technologies/${newTechnology._id}`)
      .set("x-token", token)
      // .field("nombre", "Technology test2")
      .field("oldImg", oldImg)
      .attach("img", picture)
      .expect(200);

    expect(resp.body.msg).toMatch("changed successfully");
  });

 
});
describe("Delete Technology", () => {
  test("Delete a Technology without JWT", async () => {
    const response = await api
      .delete(`/api/technologies/${newTechnology._id}`)
      .expect(401);
    expect(response.body.msg).toMatch("No hay token en la petición");
  });

  test("Delete a Technology with a expired JWT", async () => {
    const response = await api
      .delete(`/api/technologies/${newTechnology._id}`)
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisGs"
      )
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
    expect(response.body.error.msg).toMatch("jwt expired");
  });
  test("Delete a Technology with a invalid JWT", async () => {
    const response = await api
      .delete(`/api/technologies/${newTechnology._id}`)
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisG"
      )
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
    expect(response.body.error.msg).toMatch("Invalid Token");
  });
  test("Deleted a Technology with invalid MONGOID ", async () => {
    const resp = await api
      .delete("/api/technologies/1231231")
      .set("x-token", token)
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch("No es un ID válido");
  });
  test("Deleted a Technology that Doesnt exist", async () => {
    const resp = await api
      .delete("/api/technologies/63cc84f8365a4df80ffa161d")
      .set("x-token", token)
      .send({ complejidad: 2 })
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch(
      "El id no existe 63cc84f8365a4df80ffa161d"
    );
  });
  test("Deleted a Technology succeed", async () => {
    const resp = await api
      .delete(`/api/technologies/${newTechnology._id}`)
      .set("x-token", token)
      .expect(200);
    console.log(resp.body);
    expect(resp.body.msg).toMatch("deleted");
  });
});

afterAll((done) => {
  server.close();
  mongoose.connection.close();
  done();
});
