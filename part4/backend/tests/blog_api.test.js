// tests/blog_api.test.js

const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initBloglist = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  } 
]

beforeEach(async () => {
  await Blog.deleteMany({})

  // keep order the same
  for (const blog of initBloglist) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 5)
})

test('blog post unique identified is named \'id\' and \'_id\' is underfined', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert(response.body[0].id)

  assert.strictEqual(response.body[0]._id, undefined)
})

test('post works successfully and content is saved correctly', async () => {
  const newBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  } 

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')
  const uploadedBlog = response.body[response.body.length - 1]
  
  assert.strictEqual(response.body.length, 6)

  assert.strictEqual(uploadedBlog.title, 'Type wars')
  assert.strictEqual(uploadedBlog.author, 'Robert C. Martin')
  assert.strictEqual(uploadedBlog.url, 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
})

test('default likes value to 0 if missing from the request', async () => {
  const newBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
  } 

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')

  const uploadedBlog = response.body[response.body.length - 1]
  
  assert.strictEqual(uploadedBlog.likes, 0)
})

test('responds 400 Bad Request to POST with no title property', async () => {
  const newBlog = {
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
  } 

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
  const response = await api.get('/api/blogs')
  
  assert.strictEqual(response.body.length, 5)
})

test('responds 400 Bad Request to POST with no url property', async () => {
  const newBlog = {
    title: "Type wars",
    author: "Robert C. Martin"
  } 

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
  const response = await api.get('/api/blogs')
  
  assert.strictEqual(response.body.length, 5)
})

test('responds 204 to successfully deleted blog', async () => {
  await api
    .delete('/api/blogs/5a422a851b54a676234d17f7')
    .expect(204)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 4)
  const ids = response.body.map(blog => blog.id)
  assert(!ids.includes('5a422a851b54a676234d17f7'))
})

test('responds 204 no content to bad id', async () => {
  await api
    .delete('/api/blogs/5a422a851b54a676234d1235')
    .expect(204)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 5)
})

test('updating likes', async () => {
  await api
    .put('/api/blogs/5a422a851b54a676234d17f7')
    .send({ likes: 30 })
    .expect(200)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 5)
  assert.strictEqual(response.body[0].likes, 30)
})


after(async () => {
  await mongoose.connection.close()
})