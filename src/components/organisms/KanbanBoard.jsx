import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import taskService from '@/services/api/taskService'
import kanbanViewService from '@/services/api/kanbanViewService'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const KanbanCard = ({ task, onDragStart, onDragEnd }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    }
    return colors[priority] || 'default'
  }

  return (
    <motion.div
      layout
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, rotate: 5 }}
      className="cursor-move"
    >
      <Card hover className="p-4 mb-3 bg-white">
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {task.title}
          </h4>
          <Badge variant={getPriorityColor(task.priority)} size="sm">
            {task.priority}
          </Badge>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <ApperIcon name="Calendar" size={12} />
            {format(new Date(task.dueDate), 'MMM dd')}
          </div>
          {task.relatedTo && (
            <div className="flex items-center gap-1">
              <ApperIcon name="Link" size={12} />
              <span className="truncate max-w-16">{task.relatedTo}</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

const KanbanColumn = ({ status, title, tasks, onDrop, onDragOver, color }) => {
  return (
    <div className="flex-1 min-w-80 bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full bg-${color}`}></div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <Badge variant="default" size="sm">{tasks.length}</Badge>
        </div>
      </div>
      
      <div
        className="min-h-[500px] space-y-2"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
        data-status={status}
      >
        <AnimatePresence>
          {tasks.map((task) => (
            <KanbanCard
              key={task.Id}
              task={task}
              onDragStart={(e, draggedTask) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(draggedTask))
                e.dataTransfer.effectAllowed = 'move'
              }}
              onDragEnd={() => {}}
            />
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-sm">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  )
}

const KanbanBoard = ({ showAddForm, onAddFormClose }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [boardConfig, setBoardConfig] = useState(null)

  const columns = [
    { id: 'pending', title: 'Pending', color: 'gray-400' },
    { id: 'in-progress', title: 'In Progress', color: 'yellow-400' },
    { id: 'completed', title: 'Completed', color: 'green-400' }
  ]

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

  const loadBoardConfig = async () => {
    try {
      const configs = await kanbanViewService.getAll()
      const taskBoard = configs.find(config => config.entity === 'task')
      if (taskBoard) {
        setBoardConfig(taskBoard)
      }
    } catch (err) {
      console.error('Failed to load board config:', err)
    }
  }

  const saveBoardConfig = async () => {
    try {
      const configData = {
        Name: 'Task Board',
        entity: 'task',
        columnField: 'status',
        uiPreferences: JSON.stringify({
          columns: columns,
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
    loadTasks()
    loadBoardConfig()
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    
    try {
      const taskData = JSON.parse(e.dataTransfer.getData('text/plain'))
      const taskId = taskData.Id
      
      if (taskData.status === newStatus) {
        return // No change needed
      }

      // Update task status
      await taskService.update(taskId, { ...taskData, status: newStatus })
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.Id === taskId 
            ? { ...task, status: newStatus }
            : task
        )
      )
      
      toast.success(`Task moved to ${newStatus.replace('-', ' ')}`)
      saveBoardConfig()
    } catch (err) {
      toast.error('Failed to update task status')
      console.error('Drag and drop error:', err)
    }
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTasks} />
  
  if (tasks.length === 0) {
    return <Empty message="No tasks found. Create your first task to get started!" />
  }

  return (
    <div className="h-full">
      <div className="flex gap-6 overflow-x-auto pb-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            status={column.id}
            title={column.title}
            color={column.color}
            tasks={getTasksByStatus(column.id)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  )
}

export default KanbanBoard