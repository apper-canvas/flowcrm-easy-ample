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

const DealPipeline = ({ showAddForm = false, onAddFormClose }) => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const stages = [
    { id: 'lead', name: 'Lead', color: 'default' },
    { id: 'qualified', name: 'Qualified', color: 'info' },
    { id: 'proposal', name: 'Proposal', color: 'warning' },
    { id: 'negotiation', name: 'Negotiation', color: 'secondary' },
    { id: 'closed', name: 'Closed', color: 'success' }
  ]

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
      setError('Failed to load pipeline data')
      toast.error('Failed to load pipeline data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStageChange = async (dealId, newStage) => {
    try {
      const deal = deals.find(d => d.Id === dealId)
      const updatedDeal = { ...deal, stage: newStage }
      await dealService.update(dealId, updatedDeal)
      setDeals(prev => prev.map(d => d.Id === dealId ? updatedDeal : d))
      toast.success('Deal stage updated successfully')
    } catch (err) {
      toast.error('Failed to update deal stage')
    }
  }

  const handleDealAdded = (newDeal) => {
    setDeals(prev => [newDeal, ...prev])
  }

const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.Name : 'Unknown Contact'
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-max pb-4">
          {stages.map((stage) => {
            const stageDeals = deals.filter(deal => deal.stage === stage.id)
            const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)
            
            return (
              <div key={stage.id} className="flex-shrink-0 w-80">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {stage.name}
                    </h3>
                    <Badge variant={stage.color}>
                      {stageDeals.length}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Total: ${stageValue.toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-3">
                  {stageDeals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ApperIcon name="Inbox" size={48} className="mx-auto mb-2 text-gray-300" />
                      <p>No deals in this stage</p>
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <motion.div
                        key={deal.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        layout
                      >
                        <Card hover className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {deal.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {getContactName(deal.contactId)}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <ApperIcon name="DollarSign" size={14} />
                                ${deal.value.toLocaleString()}
                              </div>
                            </div>
                            <Badge variant="accent" size="sm">
                              {deal.probability}%
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Calendar" size={12} />
                              {new Date(deal.expectedClose).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            {stages.map((s) => (
                              <Button
                                key={s.id}
                                variant={s.id === deal.stage ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => handleStageChange(deal.Id, s.id)}
                                className="flex-1 text-xs"
                              >
                                {s.name}
                              </Button>
                            ))}
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <AddDealForm
        isOpen={showAddForm}
        onClose={onAddFormClose}
        onDealAdded={handleDealAdded}
        contacts={contacts}
      />
    </>
  )
}

export default DealPipeline