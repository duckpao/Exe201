export function renderTask(task) {
  return `
    <article class="task ${task.done ? 'done' : ''}">
      <span class="status">${task.done ? '✓' : ''}</span>
      <span>${task.title}</span>
      <span class="task-id">#${String(task.id).padStart(2, '0')}</span>
    </article>
  `
}
