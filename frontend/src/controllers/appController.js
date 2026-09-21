import { getHealth, getTasks } from '../services/apiService'
import { renderTask } from '../models/taskModel'
import { renderApp, renderConnection, renderError, renderTasks } from '../views/appView'

export async function startApp() {
  renderApp()

  try {
    const [health, tasks] = await Promise.all([getHealth(), getTasks()])
    if (health.status !== 'ok') throw new Error('API is unhealthy')
    renderConnection(true)
    renderTasks(tasks, renderTask)
  } catch (error) {
    renderConnection(false)
    renderError()
  }
}
