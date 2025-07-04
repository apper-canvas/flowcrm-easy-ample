import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import MetricCard from '@/components/molecules/MetricCard'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import contactService from '@/services/api/contactService'
import dealService from '@/services/api/dealService'
import taskService from '@/services/api/taskService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const Reports = () => {
  const [reportData, setReportData] = useState({
    totalContacts: 0,
    activeContacts: 0,
    totalDeals: 0,
    closedDeals: 0,
    totalValue: 0,
    averageDealValue: 0,
    totalTasks: 0,
    completedTasks: 0,
    dealsByStage: {},
    tasksByStatus: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadReportData = async () => {
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
      const activeContacts = contacts.filter(c => c.status === 'active').length
      const totalDeals = deals.length
      const closedDeals = deals.filter(d => d.stage === 'closed').length
      const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
      const averageDealValue = totalDeals > 0 ? totalValue / totalDeals : 0
      const totalTasks = tasks.length
      const completedTasks = tasks.filter(t => t.status === 'completed').length

      // Group deals by stage
      const dealsByStage = deals.reduce((acc, deal) => {
        acc[deal.stage] = (acc[deal.stage] || 0) + 1
        return acc
      }, {})

      // Group tasks by status
      const tasksByStatus = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      }, {})

      setReportData({
        totalContacts,
        activeContacts,
        totalDeals,
        closedDeals,
        totalValue,
        averageDealValue,
        totalTasks,
        completedTasks,
        dealsByStage,
        tasksByStatus
      })
    } catch (err) {
      setError('Failed to load report data')
      toast.error('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportData()
  }, [])

  const handleExportReport = () => {
    toast.info('Export report functionality coming soon!')
  }

  const handleScheduleReport = () => {
    toast.info('Schedule report functionality coming soon!')
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadReportData} />

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Reports" 
        actions={[
          {
            label: 'Schedule Report',
            icon: 'Calendar',
            variant: 'secondary',
            onClick: handleScheduleReport
          },
          {
            label: 'Export Report',
            icon: 'Download',
            variant: 'primary',
            onClick: handleExportReport
          }
        ]}
      />
      
      <div className="p-6 space-y-6">
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Contacts"
            value={reportData.totalContacts}
            change={`${reportData.activeContacts} active`}
            changeType="positive"
            icon="Users"
            gradient
          />
          <MetricCard
            title="Total Deals"
            value={reportData.totalDeals}
            change={`${reportData.closedDeals} closed`}
            changeType="positive"
            icon="DollarSign"
            gradient
          />
          <MetricCard
            title="Pipeline Value"
            value={`$${reportData.totalValue.toLocaleString()}`}
            change={`Avg: $${Math.round(reportData.averageDealValue).toLocaleString()}`}
            changeType="neutral"
            icon="TrendingUp"
            gradient
          />
          <MetricCard
            title="Total Tasks"
            value={reportData.totalTasks}
            change={`${reportData.completedTasks} completed`}
            changeType="positive"
            icon="CheckCircle"
            gradient
          />
        </div>

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deals by Stage */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deals by Stage</h3>
            <div className="space-y-3">
              {Object.entries(reportData.dealsByStage).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{stage}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Tasks by Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Status</h3>
            <div className="space-y-3">
              {Object.entries(reportData.tasksByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{status}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Conversion Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {reportData.totalDeals > 0 ? Math.round((reportData.closedDeals / reportData.totalDeals) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Deal Close Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-2">
                {reportData.totalTasks > 0 ? Math.round((reportData.completedTasks / reportData.totalTasks) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Task Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-2">
                {reportData.totalContacts > 0 ? Math.round((reportData.activeContacts / reportData.totalContacts) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Active Contact Rate</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Reports