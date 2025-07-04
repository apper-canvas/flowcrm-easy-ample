import dealsData from '@/services/mockData/deals.json'

class DealService {
  constructor() {
    this.deals = [...dealsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.deals]
  }

  async getById(id) {
    await this.delay(200)
    const deal = this.deals.find(d => d.Id === id)
    if (!deal) {
      throw new Error('Deal not found')
    }
    return { ...deal }
  }

  async create(dealData) {
    await this.delay(400)
    const newDeal = {
      ...dealData,
      Id: this.getNextId(),
      createdAt: new Date().toISOString()
    }
    this.deals.push(newDeal)
    return { ...newDeal }
  }

  async update(id, dealData) {
    await this.delay(300)
    const index = this.deals.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    this.deals[index] = { ...this.deals[index], ...dealData }
    return { ...this.deals[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.deals.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    this.deals.splice(index, 1)
    return true
  }

  getNextId() {
    return Math.max(...this.deals.map(d => d.Id), 0) + 1
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new DealService()