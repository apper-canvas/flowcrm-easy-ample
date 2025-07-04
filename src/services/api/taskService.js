import tasksData from '@/services/mockData/tasks.json'

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay(200)
    const task = this.tasks.find(t => t.Id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  }

  async create(taskData) {
    await this.delay(400)
    const newTask = {
      ...taskData,
      Id: this.getNextId(),
      createdAt: new Date().toISOString()
    }
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, taskData) {
    await this.delay(300)
    const index = this.tasks.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    this.tasks[index] = { ...this.tasks[index], ...taskData }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.tasks.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    this.tasks.splice(index, 1)
    return true
  }

  getNextId() {
    return Math.max(...this.tasks.map(t => t.Id), 0) + 1
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new TaskService()