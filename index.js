const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :response-time[4] :body'))
app.use(cors())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
  

app.get('/', (request, response) => {
  response.send('<h1>Fucking Hello World!</h1>')
})


app.get('/info', (request, response) => {

    const content = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
    response.send(content)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(n => n.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(n => n.id !== id)
    response.status(204).end()
  })

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/persons/', (request, response) => {
    const body = request.body
    const notunique = persons.find(n => n.name.toLowerCase() === body.name.toLowerCase())
    console.log(notunique)
    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'content missing' 
        })
    } else if (notunique) {
        return response.status(400).json({ 
        error: 'name must be unique' 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: `${Math.floor(Math.random() * 100000)}`
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})