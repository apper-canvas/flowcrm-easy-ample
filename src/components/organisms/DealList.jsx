import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import dealService from "@/services/api/dealService";

const AddDealForm = ({ isOpen, onClose, onDealAdded, contacts }) => {
  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    value: '',
    probability: 50,
    stage: 'lead',
    status: 'New',
    expectedClose: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required'
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Contact is required'
    }
    
    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Value must be greater than 0'
    }
    
    if (!formData.expectedClose) {
      newErrors.expectedClose = 'Expected close date is required'
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
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        contactId: parseInt(formData.contactId)
      }
      
      const newDeal = await dealService.create(dealData)
      toast.success('Deal created successfully!')
      
      setFormData({
        title: '',
        contactId: '',
        value: '',
        probability: 50,
        stage: 'lead',
        status: 'New',
        expectedClose: ''
      })
      
      onDealAdded(newDeal)
      onClose()
    } catch (err) {
      toast.error('Failed to create deal')
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
              <h2 className="text-xl font-semibold text-gray-900">Add New Deal</h2>
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
                  label="Deal Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter deal title"
                  error={errors.title}
                  required
                />
              </div>

              <div>
                <Select
                  label="Contact"
                  value={formData.contactId}
                  onChange={(value) => handleChange('contactId', value)}
                  options={[
                    { value: '', label: 'Select a contact' },
...contacts.map(contact => ({
                      value: contact.Id.toString(),
                      label: `${contact.Name} (${contact.company})`
                    }))
                  ]}
                  error={errors.contactId}
                  required
                />
              </div>

              <div>
                <Input
                  label="Deal Value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleChange('value', e.target.value)}
                  placeholder="Enter deal value"
                  error={errors.value}
                  required
                />
              </div>

              <div>
                <Select
                  label="Probability"
                  value={formData.probability.toString()}
                  onChange={(value) => handleChange('probability', parseInt(value))}
                  options={[
                    { value: '25', label: '25%' },
                    { value: '50', label: '50%' },
                    { value: '75', label: '75%' },
                    { value: '90', label: '90%' },
                    { value: '100', label: '100%' }
                  ]}
                />
              </div>

              <div>
                <Select
                  label="Stage"
                  value={formData.stage}
                  onChange={(value) => handleChange('stage', value)}
                  options={[
                    { value: 'lead', label: 'Lead' },
                    { value: 'qualified', label: 'Qualified' },
                    { value: 'proposal', label: 'Proposal' },
                    { value: 'negotiation', label: 'Negotiation' },
                    { value: 'closed', label: 'Closed' }
                  ]}
                />
              </div>

              <div>
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(value) => handleChange('status', value)}
                  options={[
                    { value: 'New', label: 'New' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'On Hold', label: 'On Hold' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Cancelled', label: 'Cancelled' }
                  ]}
                />
              </div>

              <div>
                <Input
                  label="Expected Close Date"
                  type="date"
                  value={formData.expectedClose}
                  onChange={(e) => handleChange('expectedClose', e.target.value)}
                  error={errors.expectedClose}
                  required
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
                  {loading ? 'Creating...' : 'Create Deal'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const EditDealForm = ({ isOpen, onClose, onDealUpdated, deal, contacts }) => {
  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    value: '',
    probability: 50,
    stage: 'lead',
    status: 'New',
    expectedClose: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        contactId: deal.contactId?.toString() || '',
        value: deal.value?.toString() || '',
        probability: deal.probability || 50,
        stage: deal.stage || 'lead',
        status: deal.status || 'New',
        expectedClose: deal.expectedClose ? deal.expectedClose.split('T')[0] : ''
      })
    }
  }, [deal])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required'
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Contact is required'
    }
    
    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Value must be greater than 0'
    }
    
    if (!formData.expectedClose) {
      newErrors.expectedClose = 'Expected close date is required'
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
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        contactId: parseInt(formData.contactId)
      }
      
      const updatedDeal = await dealService.update(deal.Id, dealData)
      toast.success('Deal updated successfully!')
      
      onDealUpdated(updatedDeal)
      onClose()
    } catch (err) {
      toast.error('Failed to update deal')
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
              <h2 className="text-xl font-semibold text-gray-900">Edit Deal</h2>
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
                  label="Deal Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter deal title"
                  error={errors.title}
                  required
                />
              </div>

              <div>
                <Select
                  label="Contact"
                  value={formData.contactId}
                  onChange={(value) => handleChange('contactId', value)}
                  options={[
                    { value: '', label: 'Select a contact' },
...contacts.map(contact => ({
                      value: contact.Id.toString(),
                      label: `${contact.Name} (${contact.company})`
                    }))
                  ]}
                  error={errors.contactId}
                  required
                />
              </div>

              <div>
                <Input
                  label="Deal Value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleChange('value', e.target.value)}
                  placeholder="Enter deal value"
                  error={errors.value}
                  required
                />
              </div>

              <div>
                <Select
                  label="Probability"
                  value={formData.probability.toString()}
                  onChange={(value) => handleChange('probability', parseInt(value))}
                  options={[
                    { value: '25', label: '25%' },
                    { value: '50', label: '50%' },
                    { value: '75', label: '75%' },
                    { value: '90', label: '90%' },
                    { value: '100', label: '100%' }
                  ]}
                />
              </div>

              <div>
                <Select
                  label="Stage"
                  value={formData.stage}
                  onChange={(value) => handleChange('stage', value)}
                  options={[
                    { value: 'lead', label: 'Lead' },
                    { value: 'qualified', label: 'Qualified' },
                    { value: 'proposal', label: 'Proposal' },
                    { value: 'negotiation', label: 'Negotiation' },
                    { value: 'closed', label: 'Closed' }
                  ]}
                />
              </div>

              <div>
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(value) => handleChange('status', value)}
                  options={[
                    { value: 'New', label: 'New' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'On Hold', label: 'On Hold' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Cancelled', label: 'Cancelled' }
                  ]}
                />
              </div>

              <div>
                <Input
                  label="Expected Close Date"
                  type="date"
                  value={formData.expectedClose}
                  onChange={(e) => handleChange('expectedClose', e.target.value)}
                  error={errors.expectedClose}
                  required
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
                  {loading ? 'Updating...' : 'Update Deal'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const DealList = ({ searchQuery = '', filters = [], showAddForm = false, onAddFormClose }) => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [selectedDeals, setSelectedDeals] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingDeal, setEditingDeal] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      setDeals(dealsData)
      setContacts(contactsData)
    } catch (err) {
      setError('Failed to load deals')
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await dealService.delete(id)
        setDeals(prev => prev.filter(deal => deal.Id !== id))
        toast.success('Deal deleted successfully')
      } catch (err) {
        toast.error('Failed to delete deal')
      }
    }
  }

  const handleEdit = (deal) => {
    setEditingDeal(deal)
    setShowEditForm(true)
  }

  const handleDealAdded = (newDeal) => {
    setDeals(prev => [newDeal, ...prev])
  }

const handleDealUpdated = (updatedDeal) => {
    setDeals(prev => prev.map(deal => deal.Id === updatedDeal.Id ? updatedDeal : deal))
  }

  const handleSelectDeal = (dealId) => {
    setSelectedDeals(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(dealId)) {
        newSelected.delete(dealId)
      } else {
        newSelected.add(dealId)
      }
      return newSelected
    })
  }

  const handleSelectAllDeals = () => {
    if (selectedDeals.size === filteredDeals.length) {
      setSelectedDeals(new Set())
    } else {
      setSelectedDeals(new Set(filteredDeals.map(d => d.Id)))
    }
  }

  const handleBulkStatusUpdate = async (status) => {
    if (selectedDeals.size === 0) return
    
    const dealIds = Array.from(selectedDeals)
    try {
      await dealService.updateBulk(dealIds, { status })
      setDeals(prev => prev.map(deal => 
        selectedDeals.has(deal.Id) 
          ? { ...deal, status }
          : deal
      ))
      setSelectedDeals(new Set())
      toast.success(`Updated ${dealIds.length} deal(s) status to ${status}`)
    } catch (err) {
      toast.error('Failed to update deal status')
    }
  }

  const handleBulkComplete = async () => {
    if (selectedDeals.size === 0) return
    
    const dealIds = Array.from(selectedDeals)
    try {
      await dealService.updateBulk(dealIds, { status: 'Completed', stage: 'closed' })
      setDeals(prev => prev.map(deal => 
        selectedDeals.has(deal.Id) 
          ? { ...deal, status: 'Completed', stage: 'closed' }
          : deal
      ))
      setSelectedDeals(new Set())
      toast.success(`Marked ${dealIds.length} deal(s) as completed`)
    } catch (err) {
      toast.error('Failed to mark deals as completed')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedDeals.size === 0) return
    
    const dealIds = Array.from(selectedDeals)
    if (window.confirm(`Are you sure you want to delete ${dealIds.length} deal(s)?`)) {
      try {
        await dealService.deleteBulk(dealIds)
        setDeals(prev => prev.filter(deal => !selectedDeals.has(deal.Id)))
        setSelectedDeals(new Set())
        toast.success(`Deleted ${dealIds.length} deal(s) successfully`)
      } catch (err) {
        toast.error('Failed to delete deals')
      }
    }
  }

const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.Name : 'Unknown Contact'
  }

  const getContactCompany = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.company : 'Unknown Company'
  }

  const getStageColor = (stage) => {
    const stageColors = {
      lead: 'default',
      qualified: 'info',
      proposal: 'warning',
      negotiation: 'secondary',
      closed: 'success'
    }
    return stageColors[stage] || 'default'
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'New': 'info',
      'In Progress': 'warning',
      'On Hold': 'secondary',
      'Completed': 'success',
      'Cancelled': 'error'
    }
    return statusColors[status] || 'default'
  }

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = !searchTerm || 
      deal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getContactName(deal.contactId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getContactCompany(deal.contactId).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStage = stageFilter === 'all' || deal.stage === stageFilter
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter
    
    return matchesSearch && matchesStage && matchesStatus
  })

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

return (
    <>
      <div className="space-y-6">
        {/* Bulk Action Toolbar */}
        {selectedDeals.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedDeals.size} deal(s) selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate('In Progress')}
                  >
                    Mark In Progress
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate('On Hold')}
                  >
                    Mark On Hold
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleBulkComplete}
                    icon="CheckCircle"
                  >
                    Mark Completed
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
                onClick={() => setSelectedDeals(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Input
                placeholder="Search deals, contacts, or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="Search"
              />
            </div>
            <div>
              <Select
                value={stageFilter}
                onChange={setStageFilter}
                options={[
                  { value: 'all', label: 'All Stages' },
                  { value: 'lead', label: 'Lead' },
                  { value: 'qualified', label: 'Qualified' },
                  { value: 'proposal', label: 'Proposal' },
                  { value: 'negotiation', label: 'Negotiation' },
                  { value: 'closed', label: 'Closed' }
                ]}
              />
            </div>
            <div>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'New', label: 'New' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'On Hold', label: 'On Hold' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'Cancelled', label: 'Cancelled' }
                ]}
              />
            </div>
          </div>
        </div>
{/* Deals List */}
        {filteredDeals.length === 0 ? (
          <Empty message="No deals found" />
        ) : (
          <div className="space-y-4">
            {/* Select All Checkbox */}
            <div className="flex items-center gap-2 p-2">
              <input
                type="checkbox"
                checked={selectedDeals.size === filteredDeals.length && filteredDeals.length > 0}
                onChange={handleSelectAllDeals}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <label className="text-sm text-gray-600">
                Select all deals ({filteredDeals.length})
              </label>
            </div>

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDeals.map((deal) => (
                <motion.div
                  key={deal.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card hover className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedDeals.has(deal.Id)}
                          onChange={() => handleSelectDeal(deal.Id)}
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
<div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {deal.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {getContactName(deal.contactId)} • {getContactCompany(deal.contactId)}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <ApperIcon name="DollarSign" size={14} />
                            ${deal.value?.toLocaleString() || '0'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <ApperIcon name="Calendar" size={14} />
                            {deal.expectedClose ? new Date(deal.expectedClose).toLocaleDateString() : 'No date set'}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={getStageColor(deal.stage)} size="sm">
                          {deal.stage?.charAt(0).toUpperCase() + deal.stage?.slice(1)}
                        </Badge>
                        <Badge variant="accent" size="sm">
                          {deal.probability || 0}%
                        </Badge>
                      </div>
                    </div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={getStatusColor(deal.status)} size="sm">
                      {deal.status}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(deal)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDelete(deal.Id)}
                      className="text-error hover:text-error hover:bg-red-50"
                    />
                  </div>
                </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddDealForm
        isOpen={showAddForm}
        onClose={onAddFormClose}
        onDealAdded={handleDealAdded}
        contacts={contacts}
      />

      <EditDealForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false)
          setEditingDeal(null)
        }}
        onDealUpdated={handleDealUpdated}
        deal={editingDeal}
        contacts={contacts}
      />
    </>
  )
}

export default DealList