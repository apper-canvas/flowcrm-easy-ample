import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import contactService from '@/services/api/contactService'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const ContactList = ({ searchQuery = '', filters = [] }) => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await contactService.getAll()
      setContacts(data)
    } catch (err) {
      setError('Failed to load contacts')
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.delete(id)
        setContacts(prev => prev.filter(contact => contact.Id !== id))
        toast.success('Contact deleted successfully')
      } catch (err) {
        toast.error('Failed to delete contact')
      }
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchQuery || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilters = filters.length === 0 || 
      filters.some(filter => 
        contact.status === filter || 
        contact.tags.includes(filter)
      )
    
    return matchesSearch && matchesFilters
  })

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadContacts} />
  if (filteredContacts.length === 0) return <Empty message="No contacts found" />

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredContacts.map((contact) => (
        <motion.div
          key={contact.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {contact.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{contact.company}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <ApperIcon name="Mail" size={14} />
                  {contact.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ApperIcon name="Phone" size={14} />
                  {contact.phone}
                </div>
              </div>
              <Badge variant={contact.status === 'active' ? 'success' : 'default'}>
                {contact.status}
              </Badge>
            </div>
            
            {contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {contact.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/contacts/${contact.Id}`)}
                className="flex-1"
              >
                View Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                onClick={() => handleDelete(contact.Id)}
                className="text-error hover:text-error hover:bg-red-50"
              />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default ContactList