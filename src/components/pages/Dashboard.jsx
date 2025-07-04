import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import MetricCard from '@/components/molecules/MetricCard'
import ActivityFeed from '@/components/organisms/ActivityFeed'
import QuickAddButton from '@/components/molecules/QuickAddButton'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import contactService from '@/services/api/contactService'
import dealService from '@/services/api/dealService'
import taskService from '@/services/api/taskService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalContacts: 0,
    totalDeals: 0,
    totalValue: 0,
    pendingTasks: 0,
    completedTasks: 0
  })
  const [recentDeals, setRecentDeals] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [contacts, deals, tasks] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll()
      ])

      // Calculate metrics
      const totalContacts = contacts.length
      const totalDeals = deals.length
      const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
      const pendingTasks = tasks.filter(task => task.status === 'pending').length
      const completedTasks = tasks.filter(task => task.status === 'completed').length

      setMetrics({
        totalContacts,
        totalDeals,
        totalValue,
        pendingTasks,
        completedTasks
      })

      // Get recent deals (last 5)
      const sortedDeals = deals.sort((a, b) => new Date(b.expectedClose) - new Date(a.expectedClose))
      setRecentDeals(sortedDeals.slice(0, 5))

      // Get upcoming tasks (next 5)
      const upcomingTasksList = tasks
        .filter(task => task.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)
      setUpcomingTasks(upcomingTasksList)

    } catch (err) {
      setError('Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const quickAddOptions = [
    { label: 'New Contact', value: 'contact', icon: 'User' },
    { label: 'New Deal', value: 'deal', icon: 'DollarSign' },
    { label: 'New Task', value: 'task', icon: 'CheckSquare' }
  ]

  const handleQuickAdd = (option) => {
    toast.info(`Opening ${option.label} form...`)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Dashboard" 
        actions={[
          {
            label: 'Export',
            icon: 'Download',
            variant: 'secondary',
            onClick: () => toast.info('Export functionality coming soon!')
          }
        ]}
      />
      
      <div className="p-6 space-y-6">
        {/* Quick Add Button */}
        <div className="flex justify-end">
          <QuickAddButton 
            options={quickAddOptions}
            onSelect={handleQuickAdd}
          />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Total Contacts"
            value={metrics.totalContacts}
            icon="Users"
            gradient
          />
          <MetricCard
            title="Active Deals"
            value={metrics.totalDeals}
            icon="DollarSign"
            gradient
          />
          <MetricCard
            title="Pipeline Value"
            value={`$${metrics.totalValue.toLocaleString()}`}
            icon="TrendingUp"
            gradient
          />
          <MetricCard
            title="Pending Tasks"
            value={metrics.pendingTasks}
            icon="Clock"
            gradient
          />
          <MetricCard
            title="Completed Tasks"
            value={metrics.completedTasks}
            icon="CheckCircle"
            gradient
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Deals */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Deals</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                {recentDeals.map((deal) => (
                  <motion.div
                    key={deal.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{deal.title}</h4>
                      <p className="text-sm text-gray-600">
                        Expected: {new Date(deal.expectedClose).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="accent">{deal.probability}%</Badge>
                      <span className="font-semibold text-gray-900">
                        ${deal.value.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Upcoming Tasks & Activity Feed */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                      <p className="text-xs text-gray-600">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="warning" size="sm">
                      {task.priority}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <ActivityFeed limit={5} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard