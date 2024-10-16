const express =  require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  //valida la respues del servidor
  if (note) {
    response.json(note)
  } else {
    response.status(404).end
  }
})

app.delete('/api/notes/:id', (request, response) => { 
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

//genera un id (mala practica)
const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) =>{
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId()
  }

  notes = notes.concat(note)
  response.json(note)
})


const PORT = process.env.PORT || 3001  // Usa el puerto asignado por Fly.io
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})