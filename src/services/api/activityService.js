import activitiesData from '@/services/mockData/activities.json'

class ActivityService {
  constructor() {
    this.activities = [...activitiesData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.activities]
  }

  async getById(id) {
    await this.delay(200)
    const activity = this.activities.find(a => a.Id === id)
    if (!activity) {
      throw new Error('Activity not found')
    }
    return { ...activity }
  }

  async create(activityData) {
    await this.delay(400)
    const newActivity = {
      ...activityData,
      Id: this.getNextId(),
      timestamp: new Date().toISOString()
    }
    this.activities.push(newActivity)
    return { ...newActivity }
  }

  async update(id, activityData) {
    await this.delay(300)
    const index = this.activities.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    this.activities[index] = { ...this.activities[index], ...activityData }
    return { ...this.activities[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.activities.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    this.activities.splice(index, 1)
    return true
  }

  getNextId() {
    return Math.max(...this.activities.map(a => a.Id), 0) + 1
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new ActivityService()