import request from 'supertest'
import app from '../src/server'

test("fetch users", (done) => {
  request(app)
    .post("/graphql")
    .send({
      query: "{ users{ id, username} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err)
      expect(res.body).toBeInstanceOf(Object)
      //expect(res.body.data.users.length).toEqual(3)
      done()
    })
})

var userid = ""

test("add user", (done) => {
  request(app)
    .post("/graphql")
    .send({
      query: 'mutation { addUser(username: "random-test-user" , password: "test") { id username password } }',
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body.data.addUser).toBeInstanceOf(Object)
      expect(typeof res.body.data.addUser.username).toBe('string')

      userid = res.body.data.addUser.id

      done()
    })
})

test("find user by id", (done) => {
  request(app)
    .post("/graphql")
    .send({
      query: `{ userById(id: "${userid}") { id username password } }`,
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body.data.userById).toBeInstanceOf(Object)
      expect(typeof res.body.data.userById.username).toBe('string')

      done()
    })
})

test("remove user", (done) => {
  request(app)
    .post("/graphql")
    .send({
      query: `mutation { removeUser(id: "${userid}") { id username password } }`,
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body.data.removeUser).toBeInstanceOf(Object)
      expect(typeof res.body.data.removeUser.username).toBe('string')

      done()
    })
})