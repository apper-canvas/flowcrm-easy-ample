import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import TaskList from '@/components/organisms/TaskList'
import Button from '@/components/atoms/Button'

const Tasks = () => {
  const [view, setView] = useState('list')

const [showAddForm, setShowAddForm] = useState(false)

  const handleAddTask = () => {
    setShowAddForm(true)
  }

  const handleImportTasks = () => {
    toast.info('Import tasks functionality coming soon!')
  }

  const handleExportTasks = () => {
    toast.info('Export tasks functionality coming soon!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Tasks" 
        actions={[
          {
            label: 'Import',
            icon: 'Upload',
            variant: 'secondary',
            onClick: handleImportTasks
          },
          {
            label: 'Export',
            icon: 'Download',
            variant: 'secondary',
            onClick: handleExportTasks
          },
          {
            label: 'Add Task',
            icon: 'Plus',
            variant: 'primary',
            onClick: handleAddTask
          }
        ]}
      />
      
      <div className="p-6 space-y-6">
        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={view === 'list' ? 'primary' : 'ghost'}
              icon="List"
              onClick={() => setView('list')}
            >
              List View
            </Button>
            <Button
              variant={view === 'calendar' ? 'primary' : 'ghost'}
              icon="Calendar"
              onClick={() => setView('calendar')}
            >
              Calendar View
            </Button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
{view === 'list' ? (
            <TaskList 
              showAddForm={showAddForm}
              onAddFormClose={() => setShowAddForm(false)}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-center">
                Calendar view coming soon!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Tasks