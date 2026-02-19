// tests/blog_api.test.js
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

// test vars
let token1 = null // jderby
let token2 = null // flyapple4
let user1Id = null
let user2Id = null

const initialBlogs = [
  // flyapple4's blogs (Token 2)
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    ownerIndex: 2 // helper to know which user to assign to
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    ownerIndex: 2
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    ownerIndex: 2
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    ownerIndex: 2
  },
  // jderby's blogs (Token 1)
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    ownerIndex: 1
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    ownerIndex: 1
  }
]

describe('Blog API tests with multiple users', () => {
  
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // create User 1: jderby
    const passwordHash1 = await bcrypt.hash('validpassword', 10)
    const user1 = new User({ username: 'jderby', name: 'John Derby', passwordHash: passwordHash1 })
    const savedUser1 = await user1.save()
    user1Id = savedUser1._id

    // create User 2: flyapple4
    const passwordHash2 = await bcrypt.hash('anothervalidpassword', 10)
    const user2 = new User({ username: 'flyapple4', name: 'Louberty Loutry', passwordHash: passwordHash2 })
    const savedUser2 = await user2.save()
    user2Id = savedUser2._id

    // Log in User 1 to get Token 1
    const login1 = await api
      .post('/api/login')
      .send({ username: 'jderby', password: 'validpassword' })
    token1 = `Bearer ${login1.body.token}`

    // Log in User 2 to get Token 2
    const login2 = await api
      .post('/api/login')
      .send({ username: 'flyapple4', password: 'anothervalidpassword' })
    token2 = `Bearer ${login2.body.token}`

    // Save all blogs with the correct owner attached
    const blogObjects = initialBlogs.map(blog => {
      // If ownerIndex is 1, assign to jderby, else flyapple4
      const ownerId = blog.ownerIndex === 1 ? user1Id : user2Id
      
      return new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        user: ownerId
      })
    })

    await Promise.all(blogObjects.map(b => b.save()))
  })

  describe('When existing blogs are fetched', () => {
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('blogs have an "id" property defined', async () => {
      const response = await api.get('/api/blogs')
      assert(response.body[0].id)
      assert.strictEqual(response.body[0]._id, undefined)
    })
  })

  describe('Addition of a new blog', () => {
    test('succeeds with valid data and token (jderby adds a blog)', async () => {
      const newBlog = {
        title: "John writes a Blog",
        author: "John Derby",
        url: "http://johnblog.com",
        likes: 5
      }
  
      await api
        .post('/api/blogs')
        .set('Authorization', token1) // jderby's token
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const response = await api.get('/api/blogs')
      const titles = response.body.map(r => r.title)
      
      assert.strictEqual(response.body.length, initialBlogs.length + 1)
      assert(titles.includes('John writes a Blog'))
    })
  
    test('fails with 401 if token is missing', async () => {
      const newBlog = {
        title: "Another blog",
        url: "http://anotherblog.com"
      }
      
      await api.post('/api/blogs').send(newBlog).expect(401)
    })

    test('defaults likes to 0 if missing', async () => {
      const newBlog = {
        title: "No Likes Blog",
        author: "Unknown",
        url: "http://url.com"
      } 
  
      await api
        .post('/api/blogs')
        .set('Authorization', token1)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const response = await api.get('/api/blogs')
      const uploadedBlog = response.body.find(b => b.title === "No Likes Blog")
      
      assert.strictEqual(uploadedBlog.likes, 0)
    })
  
    test('fails with status 400 if title is missing', async () => {
      const newBlog = {
        author: "Robert C. Martin",
        url: "http://url.com"
      } 
  
      await api
        .post('/api/blogs')
        .set('Authorization', token1)
        .send(newBlog)
        .expect(400)
    })
  
    test('fails with status 400 if url is missing', async () => {
      const newBlog = {
        title: "No URL Blog",
        author: "Robert C. Martin"
      } 
  
      await api
        .post('/api/blogs')
        .set('Authorization', token1)
        .send(newBlog)
        .expect(400)
    })
  })

  describe('Deletion of a blog', () => {
    test('succeeds if user deletes their OWN blog', async () => {
      // 1. Find a blog owned by jderby (User 1)
      const blogsAtStart = await api.get('/api/blogs')
      const blogToDelete = blogsAtStart.body.find(b => b.title === "First class tests")
      
      // 2. jderby deletes it
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', token1)
        .expect(204)

      const blogsAtEnd = await api.get('/api/blogs')
      assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)
    })

    test('FAILS with 401 if user tries to delete SOMEONE ELSE\'S blog', async () => {
      // 1. Find a blog owned by flyapple4 (User 2)
      const blogsAtStart = await api.get('/api/blogs')
      const blogToDelete = blogsAtStart.body.find(b => b.title === "React patterns")
      
      // 2. jderby (Token 1) tries to delete flyapple4's blog
      const result = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', token1)
        .expect(401)

      assert(result.body.error.includes('only the creator can delete a blog'))

      const blogsAtEnd = await api.get('/api/blogs')
      assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length)
    })
  })

  describe('Updates', () => {
    test('succeeds updating likes', async () => {
      const blogsAtStart = await api.get('/api/blogs')
      const blogToUpdate = blogsAtStart.body[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: 999 })
        .expect(200)

      const blogsAtEnd = await api.get('/api/blogs')
      const updatedBlog = blogsAtEnd.body.find(b => b.id === blogToUpdate.id)
      assert.strictEqual(updatedBlog.likes, 999)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})