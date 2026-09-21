import { useEffect, useState } from 'react'
import { getHealth, getTasks } from '../services/apiService'

function Task({ task }) {
  return (
    <article className={`task ${task.done ? 'done' : ''}`}>
      <span className="status">{task.done ? '✓' : ''}</span>
      <span>{task.title}</span>
      <span className="task-id">#{String(task.id).padStart(2, '0')}</span>
    </article>
  )
}

export default function HomePage() {
  const [connection, setConnection] = useState(null)
  const [tasks, setTasks] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const [health, taskList] = await Promise.all([getHealth(), getTasks()])
        if (!isMounted) return
        if (health.status !== 'ok') throw new Error('API is unhealthy')
        setConnection(true)
        setTasks(taskList)
      } catch {
        if (!isMounted) return
        setConnection(false)
        setError(true)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">EX</span>
          <span>Execute</span>
        </div>
        <span className={`connection ${connection === null ? '' : connection ? 'online' : 'offline'}`}>
          {connection === null ? 'Đang kết nối...' : connection ? '● API đang hoạt động' : '● API chưa kết nối'}
        </span>
      </header>
      <section className="intro">
        <p className="eyebrow">FULL-STACK WORKSPACE</p>
        <h1>
          Biến ý tưởng thành
          <br />
          <em>việc đã xong.</em>
        </h1>
        <p className="subtitle">Một ví dụ web app với Vite ở phía trước và ExpressJS ở phía sau.</p>
      </section>
      <section className="board">
        <div className="board-heading">
          <div>
            <p className="eyebrow">TODAY / 03 TASKS</p>
            <h2>Danh sách công việc</h2>
          </div>
          <span className="api-label">GET /api/tasks</span>
        </div>
        <div id="tasks" className="tasks">
          {error && (
            <p className="error">
              Không thể kết nối backend. Hãy chạy <code>npm run dev</code> trong thư mục backend.
            </p>
          )}
          {!error && tasks === null && <p className="loading">Đang tải dữ liệu từ Express...</p>}
          {!error && tasks !== null && tasks.map((task) => <Task key={task.id} task={task} />)}
        </div>
      </section>
    </main>
  )
}
