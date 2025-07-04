import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import contactService from "@/services/api/contactService";

const AddContactForm = ({ isOpen, onClose, onContactAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'active',
    tags: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const contactData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }
      
      const newContact = await contactService.create(contactData)
      toast.success('Contact created successfully!')
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        status: 'active',
        tags: ''
      })
      
      onContactAdded(newContact)
      onClose()
    } catch (err) {
      toast.error('Failed to create contact')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Contact</h2>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter contact name"
                  error={errors.name}
                  required
                />
              </div>

              <div>
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter email address"
                  error={errors.email}
                  required
                />
              </div>

              <div>
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  error={errors.phone}
                  required
                />
              </div>

              <div>
                <Input
                  label="Company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Enter company name"
                  error={errors.company}
                  required
                />
              </div>

              <div>
                <Input
                  label="Position"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  placeholder="Enter job position"
                />
              </div>

              <div>
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(value) => handleChange('status', value)}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                />
              </div>

              <div>
                <Input
                  label="Tags"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create Contact'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const ContactList = ({ searchQuery = '', filters = [], showAddForm = false, onAddFormClose }) => {
  const [contacts, setContacts] = useState([])
  const [selectedContacts, setSelectedContacts] = useState(new Set())
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

const handleContactAdded = (newContact) => {
    setContacts(prev => [newContact, ...prev])
  }

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(contactId)) {
        newSelected.delete(contactId)
      } else {
        newSelected.add(contactId)
      }
      return newSelected
    })
  }

  const handleSelectAllContacts = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set())
    } else {
      setSelectedContacts(new Set(filteredContacts.map(c => c.Id)))
    }
  }

  const handleBulkStatusUpdate = async (status) => {
    if (selectedContacts.size === 0) return
    
    const contactIds = Array.from(selectedContacts)
    try {
      await contactService.updateBulk(contactIds, { status })
      setContacts(prev => prev.map(contact => 
        selectedContacts.has(contact.Id) 
          ? { ...contact, status }
          : contact
      ))
      setSelectedContacts(new Set())
      toast.success(`Updated ${contactIds.length} contact(s) status to ${status}`)
    } catch (err) {
      toast.error('Failed to update contact status')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedContacts.size === 0) return
    
    const contactIds = Array.from(selectedContacts)
    if (window.confirm(`Are you sure you want to delete ${contactIds.length} contact(s)?`)) {
      try {
        await contactService.deleteBulk(contactIds)
        setContacts(prev => prev.filter(contact => !selectedContacts.has(contact.Id)))
        setSelectedContacts(new Set())
        toast.success(`Deleted ${contactIds.length} contact(s) successfully`)
      } catch (err) {
        toast.error('Failed to delete contacts')
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
        (contact.tags || []).includes(filter)
      )
    
    return matchesSearch && matchesFilters
  })

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadContacts} />
  if (filteredContacts.length === 0) return <Empty message="No contacts found" />

return (
    <>
      {/* Bulk Action Toolbar */}
      {selectedContacts.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedContacts.size} contact(s) selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('active')}
                >
                  Mark Active
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('inactive')}
                >
                  Mark Inactive
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                  icon="Trash2"
                >
                  Delete Selected
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedContacts(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Select All Checkbox */}
        {filteredContacts.length > 0 && (
          <div className="flex items-center gap-2 p-2">
            <input
              type="checkbox"
              checked={selectedContacts.size === filteredContacts.length && filteredContacts.length > 0}
              onChange={handleSelectAllContacts}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <label className="text-sm text-gray-600">
              Select all contacts ({filteredContacts.length})
            </label>
          </div>
        )}

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
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedContacts.has(contact.Id)}
                      onChange={() => handleSelectContact(contact.Id)}
className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
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
                  </div>
                  <Badge variant={contact.status === 'active' ? 'success' : 'default'}>
                    {contact.status}
                  </Badge>
                </div>
                {contact.tags?.length > 0 && (
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
      </div>

      <AddContactForm
        isOpen={showAddForm}
        onClose={onAddFormClose}
        onContactAdded={handleContactAdded}
      />
    </>
  )
}

export default ContactList