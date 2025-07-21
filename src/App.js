import { useEffect, useState } from 'react';
import './App.css';

const API = 'https://todo-api-9966.onrender.com';

function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    completed: false,
  });
  const [filter, setFilter] = useState('all'); // all | completed | pending

  const fetchTodos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ title: '', description: '', completed: false });
      fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await fetch(`${API}/${todo._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Completed: !todo.completed }),
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>Todo List</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={form.completed}
            onChange={(e) =>
              setForm({ ...form, completed: e.target.checked })
            }
          />
          Completed
        </label>
        <button type="submit">Add Todo</button>
      </form>
      
      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
      </div>
      
      <h2>Todos</h2>

      <ul>
        {Array.isArray(filteredTodos) && filteredTodos.length > 0 ? (
        filteredTodos.map((todo) => (
            <li key={todo._id}>
              <span
                onClick={() => toggleComplete(todo)}
                className={todo.completed ? 'completed' : ''}
              >
                {todo.title} {todo.completed ? '✅' : '🕒'}
              </span>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li>No todos found.</li>
        )}
      </ul>
    </div>
  );
}

export default App;
