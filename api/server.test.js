const request = require("supertest");
const server = require("./server");
const db = require("../data/db-config");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/index");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe("API END POINT TESTLERI", () => {
  describe("[GET] /", () => {
    test("[1] not found mesajını geri dönüyor", async () => {
      const res = await request(server).get("/");
      expect(res.body).toMatchObject({ message: "not found" });
      expect(res.status).toBe(404);
    });
  });
  describe("[POST] /api/auth", () => {
    test("[2] register olunca doğru status kodu dönüyor", async () => {
      const register = {
        name: "Kerem Öner",
        email: "kerem@kerem.com",
        password: "2468",
      };
      const res = await request(server)
        .post("/api/auth/register")
        .send(register);
      expect(res.status).toBe(201);
    });
    test("[3] register olunca user_id ve name dönüyor", async () => {
      const register = {
        name: "Kerem Öner",
        email: "kerem@kerem.com",
        password: "2468",
      };
      const res = await request(server)
        .post("/api/auth/register")
        .send(register);
      expect(res.body).toEqual({
        user_id: 4,
        name: "Kerem Öner",
      });
    });
    test("[4] login olunca doğru status kodu dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      const res = await request(server).post("/api/auth/login").send(login);
      expect(res.status).toBe(200);
    });
    test("[5] login olunca doğru mesajı dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      const res = await request(server).post("/api/auth/login").send(login);
      expect(res.body.message).toMatch(/merhabalar/i);
    });
    test("[6] login olurken name ve password  farklı ise doğru mesajı dönüyor", async () => {
      const login = {
        name: "Kubilay",
        password: "1234",
      };
      const res = await request(server).post("/api/auth/login").send(login);
      expect(res.body.message).toMatch(/geçersiz kriterler/i);
    });
  });
  describe("[GET] /api/users", () => {
    test("[7] token var ve tüm userlar dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .get("/api/users")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[2]).toEqual({
        user_id: 3,
        name: "Mert Gök",
        email: "mert@mert.com",
      });
    });
  });
  describe("[DELETE] /api/users", () => {
    test("[8] istenilen id'li kullanıcı siliniyor ve doğru mesajı dönüyor", async () => {
      const login = {
        name: "İrem Çelebi",
        password: "45678",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .delete("/api/users/1")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/id'li kullanıcı silindi/i);
    });
    test("[9] istenilen id'li kullanıcı yoksa doğru mesajı dönüyor", async () => {
      const login = {
        name: "İrem Çelebi",
        password: "45678",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .delete("/api/users/5")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/id bulunamadı/i);
    });
  });
  describe("[GET] /api/twit", () => {
    test("[10] tüm postlar dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .get("/api/twit")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(200);
      expect(res.body[0]).toMatchObject({
        user_id: 1,
        name: "Kubilay Batuhan Öner",
        post_content: "Bugün pizza yiyeceğim",
      });
      expect(res.body[1]).toMatchObject({
        user_id: 1,
        name: "Kubilay Batuhan Öner",
        post_content: "Merhabalar",
      });
    });
  });
  describe("[GET] /api/twit/:id", () => {
    test("[11] id ye göre posts ve comments dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .get("/api/twit/2")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });
    test("[12] id yoksa hata kodunu ve hata mesajını doğru dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .get("/api/twit/88")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(404);
      expect(res.body.message).toEqual("user id bulunamadı");
    });
  });
  describe("[POST] /api/twit", () => {
    test("[13] id ye göre posts ve comments dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .post("/api/twit")
        .set("Authorization", res.body.token)
        .send({ post_content: "Tenis oynayacağım" });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        post_content: "Tenis oynayacağım",
        user_id: 1,
      });
    });
    test("[14] alanlar doldurulmadıysa hata mesajı doğru dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .post("/api/twit")
        .set("Authorization", res.body.token)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual("Eksik alan var");
    });
  });
  describe("[DELETE] /api/twit/:post_id", () => {
    test("[15] post_id ye göre postu siliyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .delete("/api/twit/3")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(200);
    });
    test("[16] pots_id yoksa hata mesajı doğru dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .delete("/api/twit/9")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("post id bulunamadı");
    });
  });
  describe("[POST] /api/twit/comment", () => {
    test("[17] post id ye göre comment dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .post("/api/twit/comment")
        .set("Authorization", res.body.token)
        .send({ post_id: 3, post_comment: "süper" });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        post_comment: "süper",
        user_id: 1,
      });
    });
    test("[18] alanlar doldurulmadıysa hata mesajı doğru dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .post("/api/twit/comment")
        .set("Authorization", res.body.token)
        .send({ post_comment: "süper" });
      expect(res.status).toBe(400);
      expect(res.body.message).toEqual("Eksik alan var");
    });
  });
  describe("[DELETE] /api/twit/:comment_id", () => {
    test("[19] comment_id ye göre commenti siliyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .delete("/api/twit/comment/3")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(200);
    });
    test("[20] comment_id yoksa hata mesajı doğru dönüyor", async () => {
      const login = {
        name: "Kubilay Batuhan Öner",
        password: "123456",
      };
      let res = await request(server).post("/api/auth/login").send(login);
      res = await request(server)
        .delete("/api/twit/comment/8")
        .set("Authorization", res.body.token);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("comment id bulunamadı");
    });
  });
});
