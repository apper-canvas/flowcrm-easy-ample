import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import taskService from '@/services/api/taskService'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const AddTaskForm = ({ isOpen, onClose, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    relatedTo: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required'
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    } else {
      const today = new Date()
      const selectedDate = new Date(formData.dueDate)
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        newErrors.dueDate = 'Due date cannot be in the past'
      }
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
      const newTask = await taskService.create(formData)
      toast.success('Task created successfully!')
      
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        relatedTo: ''
      })
      
      onTaskAdded(newTask)
      onClose()
    } catch (err) {
      toast.error('Failed to create task')
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
              <h2 className="text-xl font-semibold text-gray-900">Add New Task</h2>
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
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter task title"
                  error={errors.title}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter task description"
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.description ? 'border-error' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.description && (
                  <p className="text-sm text-error mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <Select
                  label="Priority"
                  value={formData.priority}
                  onChange={(value) => handleChange('priority', value)}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' }
                  ]}
                />
              </div>

              <div>
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(value) => handleChange('status', value)}
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' }
                  ]}
                />
              </div>

              <div>
                <Input
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  error={errors.dueDate}
                  required
                />
              </div>

              <div>
                <Input
                  label="Related To"
                  value={formData.relatedTo}
                  onChange={(e) => handleChange('relatedTo', e.target.value)}
                  placeholder="Related contact, deal, or project"
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
                  {loading ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const TaskList = ({ view = 'list', showAddForm = false, onAddFormClose }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await taskService.getAll()
      setTasks(data)
    } catch (err) {
      setError('Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.Id === taskId)
      const updatedTask = { ...task, status: newStatus }
      await taskService.update(taskId, updatedTask)
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t))
      toast.success('Task status updated successfully')
    } catch (err) {
      toast.error('Failed to update task status')
    }
  }

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev])
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    }
    return colors[priority] || 'default'
  }

  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      'in-progress': 'warning',
      pending: 'default'
    }
    return colors[status] || 'default'
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTasks} />
  if (tasks.length === 0) return <Empty message="No tasks found" />

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    <Badge variant={getPriorityColor(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                    <Badge variant={getStatusColor(task.status)} size="sm">
                      {task.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Calendar" size={14} />
                      Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </div>
                    {task.relatedTo && (
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Link" size={14} />
                        Related to: {task.relatedTo}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant={task.status === 'pending' ? 'warning' : 'ghost'}
                    size="sm"
                    onClick={() => handleStatusChange(task.Id, 'pending')}
                    className="text-xs"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={task.status === 'in-progress' ? 'warning' : 'ghost'}
                    size="sm"
                    onClick={() => handleStatusChange(task.Id, 'in-progress')}
                    className="text-xs"
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={task.status === 'completed' ? 'success' : 'ghost'}
                    size="sm"
                    onClick={() => handleStatusChange(task.Id, 'completed')}
                    className="text-xs"
                  >
                    Completed
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    className="text-gray-500 hover:text-gray-700"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    className="text-error hover:text-error hover:bg-red-50"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AddTaskForm
        isOpen={showAddForm}
        onClose={onAddFormClose}
        onTaskAdded={handleTaskAdded}
      />
    </>
  )
}

export default TaskList