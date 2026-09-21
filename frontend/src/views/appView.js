export function renderApp() {
  document.querySelector('#app').innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div class="brand"><span class="brand-mark">EX</span><span>Execute</span></div>
        <span class="connection" id="connection">Đang kết nối...</span>
      </header>
      <section class="intro">
        <p class="eyebrow">FULL-STACK WORKSPACE</p>
        <h1>Biến ý tưởng thành<br><em>việc đã xong.</em></h1>
        <p class="subtitle">Một ví dụ web app với Vite ở phía trước và ExpressJS ở phía sau.</p>
      </section>
      <section class="board">
        <div class="board-heading"><div><p class="eyebrow">TODAY / 03 TASKS</p><h2>Danh sách công việc</h2></div><span class="api-label">GET /api/tasks</span></div>
        <div id="tasks" class="tasks"><p class="loading">Đang tải dữ liệu từ Express...</p></div>
      </section>
    </main>
  `
}

export function renderTasks(tasks, renderTask) {
  document.querySelector('#tasks').innerHTML = tasks.map(renderTask).join('')
}

export function renderConnection(isOnline) {
  const connection = document.querySelector('#connection')
  connection.textContent = isOnline ? '● API đang hoạt động' : '● API chưa kết nối'
  connection.classList.add(isOnline ? 'online' : 'offline')
}

export function renderError() {
  document.querySelector('#tasks').innerHTML = '<p class="error">Không thể kết nối backend. Hãy chạy <code>npm run dev</code> trong thư mục backend.</p>'
}
