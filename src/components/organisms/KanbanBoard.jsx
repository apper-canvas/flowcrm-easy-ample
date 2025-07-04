import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
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
import taskService from "@/services/api/taskService";
import kanbanViewService from "@/services/api/kanbanViewService";
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
                      label: `${contact.Name} (${contact.company || 'No company'})`
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

const KanbanCard = ({ item, entity, contacts, onDragStart, onDragEnd }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    }
    return colors[priority] || 'default'
  }

  const getContactName = (contactId) => {
    if (!contacts || !contactId) return 'No contact'
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.Name : 'Unknown Contact'
  }

  const renderTaskCard = () => (
    <Card hover className="p-4 mb-3 bg-white">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {item.title}
        </h4>
        <Badge variant={getPriorityColor(item.priority)} size="sm">
          {item.priority}
        </Badge>
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {item.description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <ApperIcon name="Calendar" size={12} />
          {format(new Date(item.dueDate), 'MMM dd')}
        </div>
        {item.relatedTo && (
          <div className="flex items-center gap-1">
            <ApperIcon name="Link" size={12} />
            <span className="truncate max-w-16">{item.relatedTo}</span>
          </div>
        )}
      </div>
    </Card>
  )

  const renderDealCard = () => (
    <Card hover className="p-4 mb-3 bg-white">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {item.title}
        </h4>
        <Badge variant="accent" size="sm">
          {item.probability}%
        </Badge>
      </div>
      
      <p className="text-xs text-gray-600 mb-2">
        {getContactName(item.contactId)}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <ApperIcon name="DollarSign" size={12} />
          ${item.value?.toLocaleString() || '0'}
        </div>
        <div className="flex items-center gap-1">
          <ApperIcon name="Calendar" size={12} />
          {item.expectedClose ? format(new Date(item.expectedClose), 'MMM dd') : 'No date'}
        </div>
      </div>
    </Card>
  )

  return (
    <motion.div
      layout
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, rotate: 5 }}
      className="cursor-move"
    >
      {entity === 'task' ? renderTaskCard() : renderDealCard()}
    </motion.div>
  )
}

const KanbanColumn = ({ status, title, items, entity, contacts, onDrop, onDragOver, color }) => {
  return (
    <div className="flex-1 min-w-80 bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full bg-${color}`}></div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <Badge variant="default" size="sm">{items.length}</Badge>
        </div>
      </div>
      
      <div
        className="min-h-[500px] space-y-2"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
        data-status={status}
      >
        <AnimatePresence>
          {items.map((item) => (
            <KanbanCard
              key={item.Id}
              item={item}
              entity={entity}
              contacts={contacts}
              onDragStart={(e, draggedItem) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(draggedItem))
                e.dataTransfer.effectAllowed = 'move'
              }}
              onDragEnd={() => {}}
            />
          ))}
        </AnimatePresence>
        
        {items.length === 0 && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-sm">Drop {entity}s here</p>
          </div>
        )}
      </div>
    </div>
  )
}

const KanbanBoard = ({ showAddForm, onAddFormClose, entity = 'task' }) => {
  const [items, setItems] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [boardConfig, setBoardConfig] = useState(null)

  // Get the status field name based on entity type
  const getStatusField = () => {
    switch (entity) {
      case 'task':
        return 'status'
      case 'deal':
        return 'stage'
      case 'app_contact':
        return 'status'
      default:
        return 'status'
    }
  }
  const getService = () => entity === 'task' ? taskService : dealService
  
  const getColumns = () => {
    if (entity === 'task') {
      return [
        { id: 'pending', title: 'Pending', color: 'gray-400' },
        { id: 'in-progress', title: 'In Progress', color: 'yellow-400' },
        { id: 'completed', title: 'Completed', color: 'green-400' }
      ]
    } else {
      return [
        { id: 'lead', title: 'Lead', color: 'gray-400' },
        { id: 'qualified', title: 'Qualified', color: 'blue-400' },
        { id: 'proposal', title: 'Proposal', color: 'yellow-400' },
        { id: 'negotiation', title: 'Negotiation', color: 'orange-400' },
        { id: 'closed', title: 'Closed', color: 'green-400' }
      ]
    }
}
    try {
      setLoading(true)
      setError('')
      const service = getService()
      const data = await service.getAll()
      setItems(data)
      
      // Load contacts if entity is deal
      if (entity === 'deal') {
        const contactsData = await contactService.getAll()
        setContacts(contactsData)
      }
    } catch (err) {
      setError(`Failed to load ${entity}s`)
      toast.error(`Failed to load ${entity}s`)
    } finally {
      setLoading(false)
    }
  }

const loadBoardConfig = async () => {
    try {
      const configs = await kanbanViewService.getAll()
      const entityBoard = configs.find(config => config.entity === entity)
      if (entityBoard) {
        setBoardConfig(entityBoard)
      }
    } catch (err) {
      console.error('Failed to load board config:', err)
    }
  }

const saveBoardConfig = async () => {
    try {
      const configData = {
        Name: `${entity.charAt(0).toUpperCase() + entity.slice(1)} Board`,
        entity: entity,
        columnField: getStatusField(),
        uiPreferences: JSON.stringify({
          columns: getColumns(),
          lastModified: new Date().toISOString()
        })
      }

      if (boardConfig) {
        await kanbanViewService.update(boardConfig.Id, configData)
      } else {
        const newConfig = await kanbanViewService.create(configData)
        setBoardConfig(newConfig)
      }
    } catch (err) {
      console.error('Failed to save board config:', err)
    }
  }

useEffect(() => {
    loadItems()
    loadBoardConfig()
  }, [entity])

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    
    try {
      const itemData = JSON.parse(e.dataTransfer.getData('text/plain'))
      const itemId = itemData.Id
      const statusField = getStatusField()
      
      if (itemData[statusField] === newStatus) {
        return // No change needed
      }

      // Update item status/stage
      const service = getService()
      const updateData = { ...itemData, [statusField]: newStatus }
      await service.update(itemId, updateData)
      
      // Update local state
      setItems(prevItems => 
        prevItems.map(item => 
          item.Id === itemId 
            ? { ...item, [statusField]: newStatus }
            : item
        )
      )
      
      toast.success(`${entity.charAt(0).toUpperCase() + entity.slice(1)} moved to ${newStatus.replace('-', ' ')}`)
      saveBoardConfig()
    } catch (err) {
      toast.error(`Failed to update ${entity} ${statusField}`)
      console.error('Drag and drop error:', err)
    }
  }

const getItemsByStatus = (status) => {
    const statusField = getStatusField()
    return items.filter(item => item[statusField] === status)
  }

  const handleItemAdded = (newItem) => {
    setItems(prev => [newItem, ...prev])
  }

if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadItems} />
  
  if (items.length === 0) {
    return <Empty message={`No ${entity}s found. Create your first ${entity} to get started!`} />
  }

return (
    <>
      <div className="h-full">
        <div className="flex gap-6 overflow-x-auto pb-6">
          {getColumns().map((column) => (
            <KanbanColumn
              key={column.id}
              status={column.id}
              title={column.title}
              color={column.color}
              items={getItemsByStatus(column.id)}
              entity={entity}
              contacts={contacts}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      {entity === 'deal' && (
        <AddDealForm
          isOpen={showAddForm}
          onClose={onAddFormClose}
          onDealAdded={handleItemAdded}
          contacts={contacts}
        />
      )}
    </>
  )
}

export default KanbanBoard