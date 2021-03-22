const supertest = require("supertest")
const server = require("./server")

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})


describe("Signup integration tests", () => {
  let username, password
  beforeEach(() => {
    username = "Alex"
    password = "test"
  })
  it("responds back with an 422 error when req.body is malformed", async () => {
    const res = await supertest(server).post("/api/auth/signup")
    .send({banana: "BANANAAAAA!!!"})
    expect(res.statusCode).toBe(422)
  })
  it("registers a new user", async () => {
    const res = await supertest(server).post("/api/auth/signup")
      .send({username: "Test_User", password: "password"})
      .expect(res.statusCode).toBe(201)
      .expect(res.body.username).toBe("Test_User")
  })
})

describe("login integration tests", () => {
  let username, password
  beforeEach(async () => {
    username = "Jack Black"
    password = "shadoosh"
    await supertest(server).post("/api/auth/signup").send({username, password})
    return
  })
  it("logs into the server successfully", async () => {
    const res = await supertest(server).post("/api/auth/login")
      .send({username, password})
      .expect(res.statusCode).toBe(200)
  })
  it("verifies the `cookie` was set", async () => {
    const res = await supertest(server).post("/api/auth/login")
    .send({username, password})
    .expect(res.headers.cookie).toExist()
  })
    
})