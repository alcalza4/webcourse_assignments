require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Contact = require('./models/contact')

const app = express()
app.use(express.static('dist'))

morgan.token('body', (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return ' '
  }
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response) => {
	const currentDate = new Date()

	Contact.countDocuments({}).then(count => {
		response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${currentDate}</p>
    `)
	})
})

app.get('/api/contacts', (request, response, next) => {
  Contact.find({}).then(contacts =>
		response.json(contacts)
	)
	.catch(error => next(error))
})

app.get('/api/contacts/:id', (request, response, next) => {
	Contact.findById(request.params.id)
	.then(contact => {
		if (contact) {
			response.json(contact)
		} else {
			response.status(404).end()
		}
	})
	.catch(error => next(error))
})

app.delete('/api/contacts/:id', (request, response, next) => {
	Contact.findByIdAndDelete(request.params.id)
	.then(result => {
		response.status(204).end()
	})
	.catch(error => next(error))
})


app.post('/api/contacts', (request, response, next) => {
	const body = request.body
	
  Contact.findOne({ name: body.name }).then(existingContact => {
    if (existingContact) {
      return response.status(400).json({ error: 'name must be unique' })
    }

    const contact = new Contact({
      name: body.name,
      number: body.number,
    })

    contact.save().then(savedContact => {
      response.json(savedContact)
    })
		.catch(error => next(error))
  })
	.catch(error => next(error))
})

app.put('/api/contacts/:id', (request, response, next) => {
  const { name, number} = request.body
  Contact.findById(request.params.id)
    .then(contact => {
			if (!contact) {
				return response.status(404).end()
			}

			contact.name = name
			contact.number = number

			return contact.save().then((updatedContact) => {
				response.json(updatedContact)
			})
		})
		.catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})