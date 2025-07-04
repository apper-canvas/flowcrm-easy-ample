import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import dealService from '@/services/api/dealService'
import contactService from '@/services/api/contactService'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const DealPipeline = () => {
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

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
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
  )
}

export default DealPipeline