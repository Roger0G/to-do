const Database = require('better-sqlite3')
const path = require('path')
const dbPath = path.join(__dirname, 'todos.db')

const db = new Database(dbPath)

// ensure table exists
const init = `CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  urgency INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
)`
db.exec(init)

module.exports = db
