const db = require('./db')

exports.handler = async function(event) {
  const idMatch = event.path.match(/todos\/(\d+)$/)
  const id = idMatch ? parseInt(idMatch[1], 10) : null

  if (event.httpMethod === 'GET') {
    if (id !== null) {
      const stmt = db.prepare('SELECT * FROM todos WHERE id = ?')
      const todo = stmt.get(id)
      if (!todo) return { statusCode: 404, body: 'Not found' }
      return { statusCode: 200, body: JSON.stringify(todo) }
    }
    const stmt = db.prepare('SELECT * FROM todos')
    const todos = stmt.all()
    return { statusCode: 200, body: JSON.stringify(todos) }
  }

  if (event.httpMethod === 'POST') {
    const data = JSON.parse(event.body || '{}')
    const stmt = db.prepare('INSERT INTO todos (title, completed, urgency, created_at) VALUES (?, ?, ?, ?)')
    const createdAt = new Date().toISOString()
    const info = stmt.run(data.title || '', data.completed ? 1 : 0, data.urgency || 1, createdAt)
    const todo = { id: info.lastInsertRowid, title: data.title || '', completed: !!data.completed, urgency: data.urgency || 1, created_at: createdAt }
    return { statusCode: 200, body: JSON.stringify(todo) }
  }

  if (event.httpMethod === 'PUT') {
    if (id === null) return { statusCode: 400, body: 'Missing id' }
    const data = JSON.parse(event.body || '{}')
    const stmt = db.prepare('UPDATE todos SET title = ?, completed = ?, urgency = ? WHERE id = ?')
    const info = stmt.run(data.title, data.completed ? 1 : 0, data.urgency || 1, id)
    if (info.changes === 0) return { statusCode: 404, body: 'Not found' }
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id)
    return { statusCode: 200, body: JSON.stringify(todo) }
  }

  if (event.httpMethod === 'DELETE') {
    if (id === null) return { statusCode: 400, body: 'Missing id' }
    const stmt = db.prepare('DELETE FROM todos WHERE id = ?')
    const info = stmt.run(id)
    if (info.changes === 0) return { statusCode: 404, body: 'Not found' }
    return { statusCode: 200, body: JSON.stringify({ result: true }) }
  }

  return { statusCode: 405, body: 'Method not allowed' }
}
