// app.js
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
//const logger = require('./utils/logger')
//const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

const app = express()

const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app