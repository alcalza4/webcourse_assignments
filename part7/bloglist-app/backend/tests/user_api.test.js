// tests/user_api.test.js
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('GET /api/users succeeds and returns users with blogs array', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 1)
    assert(Array.isArray(response.body[0].blogs))
    assert.strictEqual(response.body[0].username, 'root')
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'new_user',
      name: 'Test User',
      password: 'validpassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'root', // distinct username exists in beforeEach
      name: 'Super User',
      password: 'validpassword',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400) // Expect Bad Request
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode if password is too short', async () => {
    const newUser = {
      username: 'new_user_2',
      name: 'Test User',
      password: '12', // Too short
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    assert(
      result.body.error.includes('password must be at least 3 characters long'),
    )
  })

  test('creation fails with proper statuscode if username is too short', async () => {
    const newUser = {
      username: 'no', // Too short
      name: 'Test User',
      password: 'validpassword',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    assert(result.body.error.includes('User validation failed'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
