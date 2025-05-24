const fs = require('fs')
const path = require('path')
const dataPath = path.join(__dirname, 'todos.json')

function load() {
  try {
    return JSON.parse(fs.readFileSync(dataPath))
  } catch (e) {
    return []
  }
}

function save(todos) {
  fs.writeFileSync(dataPath, JSON.stringify(todos, null, 2))
}

exports.handler = async function(event) {
  const todos = load()
  const idMatch = event.path.match(/todos\/(\d+)$/)
  const id = idMatch ? parseInt(idMatch[1], 10) : null

  if (event.httpMethod === 'GET') {
    if (id !== null) {
      const todo = todos.find(t => t.id === id)
      if (!todo) return { statusCode: 404, body: 'Not found' }
      return { statusCode: 200, body: JSON.stringify(todo) }
    }
    return { statusCode: 200, body: JSON.stringify(todos) }
  }

  if (event.httpMethod === 'POST') {
    const data = JSON.parse(event.body || '{}')
    const todo = { id: Date.now(), title: data.title || '', completed: !!data.completed }
    todos.push(todo)
    save(todos)
    return { statusCode: 200, body: JSON.stringify(todo) }
  }

  if (event.httpMethod === 'PUT') {
    if (id === null) return { statusCode: 400, body: 'Missing id' }
    const data = JSON.parse(event.body || '{}')
    const todo = todos.find(t => t.id === id)
    if (!todo) return { statusCode: 404, body: 'Not found' }
    todo.title = data.title
    todo.completed = data.completed
    save(todos)
    return { statusCode: 200, body: JSON.stringify(todo) }
  }

  if (event.httpMethod === 'DELETE') {
    if (id === null) return { statusCode: 400, body: 'Missing id' }
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) return { statusCode: 404, body: 'Not found' }
    todos.splice(index, 1)
    save(todos)
    return { statusCode: 200, body: JSON.stringify({ result: true }) }
  }

  return { statusCode: 405, body: 'Method not allowed' }
}
