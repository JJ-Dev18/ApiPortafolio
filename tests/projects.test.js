const mongoose = require("mongoose");
const supertest = require("supertest");
const { server, app } = require("../app.js");
const path = require("path");
const api = supertest(app.app);
const picture = path.resolve(__dirname, "../uploads/imgs/1.png");
const picture2 = path.resolve(__dirname, "../uploads/imgs/2.jpg");

const user = {
  correo: "test12@test.com",
  password: "123456",
};
const modelProjectTest = {
  nombre: "Testint Create project",
  website: "testing.com",
  codigo: "testing@github",
  descripcion: "testing project",
  complejidad: 2,
  tecnologias: ["6189859f1f836daef1e341a4", "618985af1f836daef1e341a7"],
};
let token;
let newProject ;

beforeAll(async () => {
  const login = await api.post("/api/auth/login").send(user);
  token = login.body.token;
 const projectNew = await api
   .post("/api/projects")
   .set("x-token", token)
   .field("nombre", modelProjectTest.nombre)
   .field("descripcion", modelProjectTest.descripcion)
   .field("codigo", modelProjectTest.codigo)
   .field("website", modelProjectTest.website)
   .field("tecnologias", modelProjectTest.tecnologias[0])
   .field("tecnologias", modelProjectTest.tecnologias[1])
   .field("complejidad", modelProjectTest.complejidad)
   .attach("img", picture)
   .attach("gif", picture)
   .expect(200);

   newProject = projectNew.body.project;
  
},6000);



describe("POST Project", () => {
  let idNew;
  test("Create a project without JWT token", async () => {
    const response = await api
      .post("/api/projects")
      .send(modelProjectTest)
      .expect(401);
    expect(response.body.msg).toMatch("No hay token en la petición");
  });

  test("Create a project with a JWT Token expired", async () => {
    const response = await api
      .post("/api/projects")
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisGs"
      )
      .send(modelProjectTest)
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
    expect(response.body.error.msg).toMatch("jwt expired");
  });

  test("Create a project with a JWT Token invalid", async () => {
    const response = await api
      .post("/api/projects")
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKis"
      )
      .send(modelProjectTest)
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
    expect(response.body.error.msg).toMatch("Invalid Token");
  });

  test("Create project withouth images", async () => {
    const response = await api
      .post("/api/projects")
      .set("x-token", token)
      .send(modelProjectTest)
      .expect(400);

    expect(response.body.msg).toMatch(
      "No hay archivos que subir - validarArchivoSubir2"
    );
  });

  test("Create correctly a project", async () => {
    const resp = await api
      .post("/api/projects")
      .set("x-token", token)
      .field("nombre", modelProjectTest.nombre)
      .field("descripcion", modelProjectTest.descripcion)
      .field("codigo", modelProjectTest.codigo)
      .field("website", modelProjectTest.website)
      .field("tecnologias", modelProjectTest.tecnologias[0])
      .field("tecnologias", modelProjectTest.tecnologias[1])
      .field("complejidad", modelProjectTest.complejidad)
      .attach("img", picture)
      .attach("gif", picture)
      .expect(200);

      idNew = resp.body.project._id
  });

  test("Create a project withouth website SHOULD RETURN STATUS 400", async () => {
    const resp = await api
      .post("/api/projects")
      .set("x-token", token)
      .field("nombre", modelProjectTest.nombre)
      .field("descripcion", modelProjectTest.descripcion)
      .field("codigo", modelProjectTest.codigo)
      .field("complejidad", modelProjectTest.complejidad)
      .field("tecnologias", modelProjectTest.tecnologias[0])
      .field("tecnologias", modelProjectTest.tecnologias[1])
      .attach("img", picture)
      .attach("gif", picture)
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch("website es obligatoria");
    expect(resp.body.errors[0].param).toMatch("website");
  });
  test("Create a project withouth website and name SHOULD RETURN STATUS 400", async () => {
    const resp = await api
      .post("/api/projects")
      .set("x-token", token)
      .field("descripcion", modelProjectTest.descripcion)
      .field("codigo", modelProjectTest.codigo)
      .field("tecnologias", modelProjectTest.tecnologias[0])
      .field("tecnologias", modelProjectTest.tecnologias[1])
      .field("complejidad", modelProjectTest.complejidad)
      .attach("img", picture)
      .attach("gif", picture)
      .expect(400);

    expect(resp.body.errors).toHaveLength(2);
    expect(resp.body.errors[0].msg).toMatch("El nombre es obligatorio");
    expect(resp.body.errors[0].param).toMatch("nombre");
    expect(resp.body.errors[1].msg).toMatch("website es obligatoria");
    expect(resp.body.errors[1].param).toMatch("website");
  });

  afterAll(async ()=>{
     const resp = await api
       .delete(`/api/projects/${idNew}`)
       .set("x-token", token)
       .expect(200);

          expect(resp.body.msg).toMatch(
            "deleted"
          );
  })
});
describe("Get Projects", () => {
  test("Should projects are returned as json", async () => {
    await api
      .get("/api/projects")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return up to 4 projects  ", async () => {
    const response = await api.get("/api/projects?limite=4").expect(200);
    expect(response.body.projects.length).toBeLessThanOrEqual(4);
  });
  describe("Get Project", () => {
    test("request a project without JWT token", async () => {
      const response = await api
        .get(`/api/projects/${newProject._id}`)
        .expect(401);
      expect(response.body.msg).toMatch("No hay token en la petición");
    });

    test("Get a project with a JWT Token expired", async () => {
      const response = await api
        .get(`/api/projects/${newProject._id}`)
        .set(
          "x-token",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisGs"
        )
        .expect(401);
      expect(response.body.msg).toMatch("Token no válido");
      expect(response.body.error.msg).toMatch("jwt expired");
    });

    test("Get a project with a JWT Token invalid", async () => {
      const response = await api
        .get(`/api/projects/${newProject._id}`)
        .set(
          "x-token",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKis"
        )
        .expect(401);
      expect(response.body.msg).toMatch("Token no válido");
      expect(response.body.error.msg).toMatch("Invalid Token");
    });
    test("Get a project with invalid MONGOID ", async () => {
      const resp = await api
        .get("/api/projects/1231231")
        .set("x-token", token)
        .expect(400);

      expect(resp.body.errors[0].msg).toMatch("No es un ID válido");
    });
    test("Get a project that Doesnt exist", async () => {
      const resp = await api
        .get("/api/projects/63cc84f8365a4df80ffa161d")
        .set("x-token", token)
        .expect(400);

      expect(resp.body.errors[0].msg).toMatch(
        "El id no existe 63cc84f8365a4df80ffa161d"
      );
    });

    test("Get a specific project byID success", async () => {
    
      const resp = await api
        .get(`/api/projects/${newProject._id}`)
        .set("x-token", token).expect(200)
      
      expect(resp.body.project).not.toBeNull();
      expect(resp.body.project).toMatchObject(newProject);
    });
  });
});
describe("PUT Project ", () => {
 
  let oldImg, oldGif;
  beforeEach(async () => {
    const response = await api
      .get(`/api/projects/${newProject._id}`)
      .set("x-token", token);

    oldGif = response.body.project.gif;
    oldImg = response.body.project.img;
  });
  test("UPDATED a project with invalid MONGOID ", async () => {
    const resp = await api
      .put("/api/projects/1231231")
      .set("x-token", token)
      .send({ complejidad: 2 })
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch("No es un ID válido");
  });
  test("UPDATED a project that Doesnt exist", async () => {
    const resp = await api
      .put("/api/projects/63cc84f8365a4df80ffa161d")
      .set("x-token", token)
      .send({ complejidad: 2 })
      .expect(400);

    expect(resp.body.errors[0].msg).toMatch(
      "El id no existe 63cc84f8365a4df80ffa161d"
    );
  });

  test("UPDATED a project without JWT token", async () => {
    const response = await api
      .put("/api/projects/63cc84f8365a4df80ffa161c")
      .send({ complejidad: 2 })
      .expect(401);
    expect(response.body.msg).toMatch("No hay token en la petición");
  });

  test("UPDATED a project with a JWT Token expired ", async () => {
    const response = await api
      .put("/api/projects/63cc84f8365a4df80ffa161c")
      .set(
        "x-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisGs"
      )
      .send({ complejidad: 2 })
      .expect(401);
    expect(response.body.msg).toMatch("Token no válido");
    expect(response.body.error.msg).toMatch("jwt expired");

  });

   test("Create a project with a JWT Token invalid", async () => {
     const response = await api
       .put("/api/projects/63cc84f8365a4df80ffa161c")
       .set(
         "x-token",
         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKis"
       )
       .expect(401);
     expect(response.body.msg).toMatch("Token no válido");
     expect(response.body.error.msg).toMatch("Invalid Token");
   });
   test("UPDATED complexity a project", async () => {
     const resp = await api
       .put(`/api/projects/${newProject._id}`)
       .set("x-token", token)
       .field("complejidad", "2")
       .field("oldGif", oldGif)
       .field("oldImg", oldImg)
       .expect(200);
     
     expect(resp.body.msg).toMatch("changed successfully");

   });

  test("UPDATED a project with GIF", async () => {
    const resp = await api
      .put(`/api/projects/${newProject._id}`)
      .set("x-token", token)
      .field("nombre", modelProjectTest.nombre)
      .field("descripcion", modelProjectTest.descripcion)
      .field("codigo", modelProjectTest.codigo)
      .field("website", modelProjectTest.website)
      .field("complejidad", modelProjectTest.complejidad)
      .field("tecnologias", modelProjectTest.tecnologias[0])
      .field("tecnologias", modelProjectTest.tecnologias[1])
      .field("oldGif", oldGif)
      .field("oldImg", oldImg)
      .attach("gif", picture)
      .expect(200);

    expect(resp.body.msg).toMatch("changed successfully");
  });

  test("UPDATED a project with IMG", async () => {
    const resp = await api
      .put(`/api/projects/${newProject._id}`)
      .set("x-token", token)
      .field("nombre", modelProjectTest.nombre)
      .field("descripcion", modelProjectTest.descripcion)
      .field("codigo", modelProjectTest.codigo)
      .field("website", modelProjectTest.website)
      .field("complejidad", modelProjectTest.complejidad)
      .field("tecnologias", modelProjectTest.tecnologias[0])
      .field("tecnologias", modelProjectTest.tecnologias[1])
      .field("oldGif", oldGif)
      .field("oldImg", oldImg)
      .attach("img", picture2)
      .expect(200);

    expect(resp.body.msg).toMatch("changed successfully");
  });

  test("UPDATED a project with GIF and IMG", async () => {
    const resp = await api
      .put(`/api/projects/${newProject._id}`)
      .set("x-token", token)
      .field("nombre", modelProjectTest.nombre)
      .field("descripcion", modelProjectTest.descripcion)
      .field("codigo", modelProjectTest.codigo)
      .field("website", modelProjectTest.website)
      .field("complejidad", modelProjectTest.complejidad)
      .field("tecnologias", modelProjectTest.tecnologias[0])
      .field("tecnologias", modelProjectTest.tecnologias[1])
      .field("oldGif", oldGif)
      .field("oldImg", oldImg)
      .attach("gif", picture2)
      .attach("img", picture)

      .expect(200);

    expect(resp.body.msg).toMatch("changed successfully");
  });
});

describe("Delete Project", ()=> {
  test('Delete a project without JWT', async() => { 
    const response = await api.delete(`/api/projects/${newProject._id}`).expect(401);
    expect(response.body.msg).toMatch("No hay token en la petición");
   })

     test("Delete a project with a expired JWT", async () => {
       const response = await api
         .delete(`/api/projects/${newProject._id}`)
         .set(
           "x-token",
           "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisGs"
         )
         .expect(401);
          expect(response.body.msg).toMatch("Token no válido");
          expect(response.body.error.msg).toMatch("jwt expired");

     });
      test("Delete a project with a invalid JWT", async () => {
        const response = await api
          .delete(`/api/projects/${newProject._id}`)
          .set(
            "x-token",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTY0ZWQzNmU1NGYxZDg1OTE4ZGFiZTEiLCJpYXQiOjE2Njg1NjAyMzUsImV4cCI6MTY2ODU3NDYzNX0.SCMKkd0_VPIXGKdC6cGJXC__d_o0krpt9p5L7FKisG"
          )
          .expect(401);
        expect(response.body.msg).toMatch("Token no válido");
        expect(response.body.error.msg).toMatch("Invalid Token");
      });
      test("Deleted a project with invalid MONGOID ", async () => {
        const resp = await api
          .delete("/api/projects/1231231")
          .set("x-token", token)
          .expect(400);

        expect(resp.body.errors[0].msg).toMatch("No es un ID válido");
      });
      test("Deleted a project that Doesnt exist", async () => {
        const resp = await api
          .delete("/api/projects/63cc84f8365a4df80ffa161d")
          .set("x-token", token)
          .send({ complejidad: 2 })
          .expect(400);

        expect(resp.body.errors[0].msg).toMatch(
          "El id no existe 63cc84f8365a4df80ffa161d"
        );
      });
       test("Deleted a project succeed", async () => {
         const resp = await api
           .delete(`/api/projects/${newProject._id}`)
           .set("x-token", token)
           .expect(200);
       
          expect(resp.body.msg).toMatch(
            "deleted"
          );
       });

      
})

afterAll(async () => {
  server.close();
  await  mongoose.connection.close();
 
});
