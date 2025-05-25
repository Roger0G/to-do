import React, { useEffect, useState } from 'react'

interface Todo {
  id: number
  title: string
  completed: boolean
  urgency: number
  created_at: string
}

const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newUrgency, setNewUrgency] = useState(1)
  const [sortBy, setSortBy] = useState<'date' | 'urgency'>('date')

  const sort = (items: Todo[]): Todo[] => {
    if (sortBy === 'urgency') {
      return [...items].sort((a, b) => b.urgency - a.urgency)
    }
    return [...items].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  useEffect(() => {
    fetch(`${API_URL}/todos/`)
      .then((res) => res.json())
      .then((data) => setTodos(sort(data)))
  }, [])

  useEffect(() => {
    setTodos(prev => sort([...prev]))
  }, [sortBy])

  const addTodo = async () => {
    const res = await fetch(`${API_URL}/todos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, urgency: newUrgency })
    })
    const todo = await res.json()
    setTodos(sort([...todos, todo]))
    setNewTitle('')
    setNewUrgency(1)
  }

  const toggle = async (todo: Todo) => {
    const res = await fetch(`${API_URL}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: todo.title, completed: !todo.completed, urgency: todo.urgency })
    })
    const updated = await res.json()
    setTodos(sort(todos.map(t => t.id === updated.id ? updated : t)))
  }

  const remove = async (id: number) => {
    await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' })
    setTodos(sort(todos.filter(t => t.id !== id)))
  }

  return (
    <div>
      <h1>Todo App</h1>
      <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title" />
      <select value={newUrgency} onChange={e => setNewUrgency(parseInt(e.target.value))}>
        <option value={1}>Low</option>
        <option value={2}>Medium</option>
        <option value={3}>High</option>
      </select>
      <button onClick={addTodo}>Add</button>
      <div>
        Sort by:{' '}
        <select value={sortBy} onChange={e => setSortBy(e.target.value as 'date' | 'urgency')}>
          <option value="date">Creation Date</option>
          <option value="urgency">Urgency</option>
        </select>
      </div>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <span onClick={() => toggle(t)} style={{ textDecoration: t.completed ? 'line-through' : 'none', cursor: 'pointer' }}>{t.title}</span>
            {' '}({t.urgency})
            <button onClick={() => remove(t.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
