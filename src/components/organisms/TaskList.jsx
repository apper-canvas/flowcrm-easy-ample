import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import taskService from '@/services/api/taskService'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const TaskList = ({ view = 'list' }) => {
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
  )
}

export default TaskList