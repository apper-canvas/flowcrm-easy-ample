import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import SearchBar from '@/components/molecules/SearchBar'
import FilterChips from '@/components/molecules/FilterChips'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import customFieldService from '@/services/api/customFieldService'

const CustomFieldForm = ({ isOpen, onClose, field = null, onFieldSaved }) => {
const [formData, setFormData] = useState({
    Name: '',
    label: '',
    type: 'Text',
    visibility: 'Public',
    Tags: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

useEffect(() => {
    if (field) {
      setFormData({
        Name: field.Name || '',
        label: field.label || '',
        type: field.type || 'Text',
        visibility: field.visibility || 'Public',
        Tags: Array.isArray(field.Tags) ? field.Tags.join(', ') : field.Tags || ''
      })
    } else {
setFormData({
        Name: '',
        label: '',
        type: 'Text',
        visibility: 'Public',
        Tags: ''
      })
    }
  }, [field, isOpen])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Field name is required'
    }
    
    if (!formData.label.trim()) {
      newErrors.label = 'Field label is required'
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
      const fieldData = {
        ...formData,
        Tags: formData.Tags.split(',').map(tag => tag.trim()).filter(tag => tag).join(',')
      }
      
      let result
      if (field) {
        result = await customFieldService.update(field.Id, fieldData)
        toast.success('Custom field updated successfully!')
      } else {
        result = await customFieldService.create(fieldData)
        toast.success('Custom field created successfully!')
      }
      
      if (result) {
        onFieldSaved(result)
        onClose()
      }
    } catch (err) {
      toast.error(field ? 'Failed to update custom field' : 'Failed to create custom field')
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
              <h2 className="text-xl font-semibold text-gray-900">
                {field ? 'Edit Custom Field' : 'Add Custom Field'}
              </h2>
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
                  label="Field Name"
                  value={formData.Name}
                  onChange={(e) => handleChange('Name', e.target.value)}
                  placeholder="Enter field name"
                  error={errors.Name}
                  required
                />
              </div>

              <div>
                <Input
                  label="Field Label"
                  value={formData.label}
                  onChange={(e) => handleChange('label', e.target.value)}
                  placeholder="Enter field label"
                  error={errors.label}
                  required
                />
              </div>

              <div>
                <Select
                  label="Field Type"
                  value={formData.type}
                  onChange={(value) => handleChange('type', value)}
                  options={[
                    { value: 'Text', label: 'Text' },
                    { value: 'Number', label: 'Number' },
                    { value: 'Date', label: 'Date' },
                    { value: 'Boolean', label: 'Boolean' }
                  ]}
                />
              </div>

              <div>
                <Select
                  label="Visibility"
                  value={formData.visibility}
                  onChange={(value) => handleChange('visibility', value)}
                  options={[
                    { value: 'Public', label: 'Public' },
                    { value: 'Private', label: 'Private' }
                  ]}
                />
              </div>


              <div>
                <Input
                  label="Tags"
                  value={formData.Tags}
                  onChange={(e) => handleChange('Tags', e.target.value)}
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
                  {loading ? (field ? 'Updating...' : 'Creating...') : (field ? 'Update Field' : 'Create Field')}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const CustomFields = () => {
  const [fields, setFields] = useState([])
  const [selectedFields, setSelectedFields] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingField, setEditingField] = useState(null)

  const filterOptions = [
    { label: 'Text Fields', value: 'Text', icon: 'Type' },
    { label: 'Number Fields', value: 'Number', icon: 'Hash' },
    { label: 'Date Fields', value: 'Date', icon: 'Calendar' },
    { label: 'Boolean Fields', value: 'Boolean', icon: 'ToggleLeft' },
    { label: 'Public', value: 'Public', icon: 'Eye' },
    { label: 'Private', value: 'Private', icon: 'EyeOff' }
  ]

  const loadFields = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await customFieldService.getAll()
      setFields(data)
    } catch (err) {
      setError('Failed to load custom fields')
      toast.error('Failed to load custom fields')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFields()
  }, [])

  const handleAddField = () => {
    setEditingField(null)
    setShowForm(true)
  }

  const handleEditField = (field) => {
    setEditingField(field)
    setShowForm(true)
  }

  const handleDeleteField = async (fieldId) => {
    if (window.confirm('Are you sure you want to delete this custom field?')) {
      try {
        await customFieldService.delete(fieldId)
        setFields(prev => prev.filter(field => field.Id !== fieldId))
        toast.success('Custom field deleted successfully')
      } catch (err) {
        toast.error('Failed to delete custom field')
      }
    }
  }

  const handleFieldSaved = (savedField) => {
    if (editingField) {
      setFields(prev => prev.map(field => 
        field.Id === editingField.Id ? savedField : field
      ))
    } else {
      setFields(prev => [savedField, ...prev])
    }
  }

  const handleSelectField = (fieldId) => {
    setSelectedFields(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(fieldId)) {
        newSelected.delete(fieldId)
      } else {
        newSelected.add(fieldId)
      }
      return newSelected
    })
  }

  const handleSelectAllFields = () => {
    if (selectedFields.size === filteredFields.length) {
      setSelectedFields(new Set())
    } else {
      setSelectedFields(new Set(filteredFields.map(f => f.Id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFields.size === 0) return
    
    const fieldIds = Array.from(selectedFields)
    if (window.confirm(`Are you sure you want to delete ${fieldIds.length} custom field(s)?`)) {
      try {
        await customFieldService.deleteBulk(fieldIds)
        setFields(prev => prev.filter(field => !selectedFields.has(field.Id)))
        setSelectedFields(new Set())
        toast.success(`Deleted ${fieldIds.length} custom field(s) successfully`)
      } catch (err) {
        toast.error('Failed to delete custom fields')
      }
    }
  }

  const filteredFields = fields.filter(field => {
    const matchesSearch = !searchQuery || 
      field.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.type.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilters = activeFilters.length === 0 || 
      activeFilters.some(filter => 
        field.type === filter || 
        field.visibility === filter ||
        (field.Tags && field.Tags.includes(filter))
      )
    
    return matchesSearch && matchesFilters
  })

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadFields} />

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Custom Fields" 
        actions={[
          {
            label: 'Add Custom Field',
            icon: 'Plus',
            variant: 'primary',
            onClick: handleAddField
          }
        ]}
      />
      
      <div className="p-6 space-y-6">
        {/* Search and Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            <SearchBar
              placeholder="Search custom fields by name, label, or type..."
              onSearch={setSearchQuery}
              showButton={false}
            />
            
            <FilterChips
              filters={filterOptions}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
            />
          </div>
        </Card>

        {/* Bulk Action Toolbar */}
        {selectedFields.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedFields.size} field(s) selected
                </span>
                <div className="flex gap-2">
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
                onClick={() => setSelectedFields(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        {/* Custom Fields List */}
        {filteredFields.length === 0 ? (
          <Empty 
            message="No custom fields found" 
            description="Create your first custom field to get started"
            action={{
              label: 'Add Custom Field',
              icon: 'Plus',
              onClick: handleAddField
            }}
          />
        ) : (
          <div className="space-y-4">
            {/* Select All Checkbox */}
            <div className="flex items-center gap-2 p-2">
              <input
                type="checkbox"
                checked={selectedFields.size === filteredFields.length && filteredFields.length > 0}
                onChange={handleSelectAllFields}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <label className="text-sm text-gray-600">
                Select all fields ({filteredFields.length})
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFields.map((field) => (
                <motion.div
                  key={field.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card hover className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedFields.has(field.Id)}
                          onChange={() => handleSelectField(field.Id)}
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {field.label}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Name: {field.Name}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" size="sm">
                              {field.type}
                            </Badge>
                            <Badge variant={field.visibility === 'Public' ? 'success' : 'warning'} size="sm">
                              {field.visibility}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {field.Tags && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {field.Tags.split(',').map((tag, index) => (
                          <Badge key={index} variant="accent" size="sm">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="Edit"
                        onClick={() => handleEditField(field)}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDeleteField(field.Id)}
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

      <CustomFieldForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        field={editingField}
        onFieldSaved={handleFieldSaved}
      />
    </div>
  )
}

export default CustomFields