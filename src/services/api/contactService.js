import contactsData from '@/services/mockData/contacts.json'

class ContactService {
  constructor() {
    this.contacts = [...contactsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.contacts]
  }

  async getById(id) {
    await this.delay(200)
    const contact = this.contacts.find(c => c.Id === id)
    if (!contact) {
      throw new Error('Contact not found')
    }
    return { ...contact }
  }

  async create(contactData) {
    await this.delay(400)
    const newContact = {
      ...contactData,
      Id: this.getNextId(),
      createdAt: new Date().toISOString()
    }
    this.contacts.push(newContact)
    return { ...newContact }
  }

  async update(id, contactData) {
    await this.delay(300)
    const index = this.contacts.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    this.contacts[index] = { ...this.contacts[index], ...contactData }
    return { ...this.contacts[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.contacts.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    this.contacts.splice(index, 1)
    return true
  }

  getNextId() {
    return Math.max(...this.contacts.map(c => c.Id), 0) + 1
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new ContactService()