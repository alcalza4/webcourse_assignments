// app.js
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
//const config = require('./utils/config')
//const logger = require('./utils/logger')
//const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

const app = express()

const mongoUrl = process.env.MONGODB_URL

mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app