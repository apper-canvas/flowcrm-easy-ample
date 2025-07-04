import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import DealPipeline from '@/components/organisms/DealPipeline'
import DealList from '@/components/organisms/DealList'
import KanbanBoard from '@/components/organisms/KanbanBoard'
import Button from '@/components/atoms/Button'

const Deals = () => {
  const [view, setView] = useState('pipeline')

const [showAddForm, setShowAddForm] = useState(false)

  const handleAddDeal = () => {
    setShowAddForm(true)
  }

  const handleImportDeals = () => {
    toast.info('Import deals functionality coming soon!')
  }

  const handleExportDeals = () => {
    toast.info('Export deals functionality coming soon!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Deals" 
        actions={[
          {
            label: 'Import',
            icon: 'Upload',
            variant: 'secondary',
            onClick: handleImportDeals
          },
          {
            label: 'Export',
            icon: 'Download',
            variant: 'secondary',
            onClick: handleExportDeals
          },
          {
            label: 'Add Deal',
            icon: 'Plus',
            variant: 'primary',
            onClick: handleAddDeal
          }
        ]}
      />
      
      <div className="p-6 space-y-6">
        {/* View Toggle */}
        <div className="flex justify-between items-center">
<div className="flex gap-2">
          <Button
            variant={view === 'pipeline' ? 'primary' : 'ghost'}
            icon="BarChart3"
            onClick={() => setView('pipeline')}
          >
            Pipeline View
          </Button>
          <Button
            variant={view === 'list' ? 'primary' : 'ghost'}
            icon="List"
            onClick={() => setView('list')}
          >
            List View
          </Button>
          <Button
            variant={view === 'kanban' ? 'primary' : 'ghost'}
            icon="Columns"
            onClick={() => setView('kanban')}
          >
            Kanban View
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
{view === 'pipeline' ? (
          <DealPipeline 
            showAddForm={showAddForm}
            onAddFormClose={() => setShowAddForm(false)}
          />
        ) : view === 'list' ? (
          <DealList 
            showAddForm={showAddForm}
            onAddFormClose={() => setShowAddForm(false)}
          />
        ) : (
          <KanbanBoard 
            showAddForm={showAddForm}
            onAddFormClose={() => setShowAddForm(false)}
          />
        )}
        </motion.div>
      </div>
    </div>
  )
}

export default Deals