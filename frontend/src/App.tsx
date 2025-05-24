import React, { useEffect, useState } from 'react'

interface Todo {
  id: number
  title: string
  completed: boolean
}

const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/todos/`)
      .then((res) => res.json())
      .then(setTodos)
  }, [])

  const addTodo = async () => {
    const res = await fetch(`${API_URL}/todos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle })
    })
    const todo = await res.json()
    setTodos([...todos, todo])
    setNewTitle('')
  }

  const toggle = async (todo: Todo) => {
    const res = await fetch(`${API_URL}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: todo.title, completed: !todo.completed })
    })
    const updated = await res.json()
    setTodos(todos.map(t => t.id === updated.id ? updated : t))
  }

  const remove = async (id: number) => {
    await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' })
    setTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div>
      <h1>Todo App</h1>
      <input value={newTitle} onChange={e => setNewTitle(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <span onClick={() => toggle(t)} style={{ textDecoration: t.completed ? 'line-through' : 'none', cursor: 'pointer' }}>{t.title}</span>
            <button onClick={() => remove(t.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
