import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import ActivityFeed from '@/components/organisms/ActivityFeed'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import contactService from '@/services/api/contactService'
import dealService from '@/services/api/dealService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const ContactDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('info')

  const loadContactData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [contactData, allDeals] = await Promise.all([
        contactService.getById(parseInt(id)),
        dealService.getAll()
      ])
      
      setContact(contactData)
      setDeals(allDeals.filter(deal => deal.contactId === parseInt(id)))
    } catch (err) {
      setError('Failed to load contact data')
      toast.error('Failed to load contact data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContactData()
  }, [id])

  const handleEdit = () => {
    toast.info('Edit contact form coming soon!')
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.delete(parseInt(id))
        toast.success('Contact deleted successfully')
        navigate('/contacts')
      } catch (err) {
        toast.error('Failed to delete contact')
      }
    }
  }

  const handleAddDeal = () => {
    toast.info('Add deal form coming soon!')
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadContactData} />
  if (!contact) return <Error message="Contact not found" />

  const tabs = [
    { id: 'info', label: 'Contact Info', icon: 'User' },
    { id: 'deals', label: 'Deals', icon: 'DollarSign' },
    { id: 'activities', label: 'Activities', icon: 'Activity' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={contact.name}
        actions={[
          {
            label: 'Edit',
            icon: 'Edit',
            variant: 'secondary',
            onClick: handleEdit
          },
          {
            label: 'Delete',
            icon: 'Trash2',
            variant: 'danger',
            onClick: handleDelete
          }
        ]}
      />
      
      <div className="p-6 space-y-6">
        {/* Contact Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
                <p className="text-lg text-gray-600">{contact.company}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={contact.status === 'active' ? 'success' : 'default'}>
                    {contact.status}
                  </Badge>
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <ApperIcon name="Mail" size={16} />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ApperIcon name="Phone" size={16} />
                <span>{contact.phone}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Card className="p-6">
          <div className="flex border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{contact.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{contact.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{contact.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <p className="mt-1 text-sm text-gray-900">{contact.company}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1 text-sm text-gray-900">{contact.status}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'deals' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Associated Deals ({deals.length})
                  </h3>
                  <Button
                    variant="primary"
                    icon="Plus"
                    onClick={handleAddDeal}
                  >
                    Add Deal
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {deals.map((deal) => (
                    <Card key={deal.Id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{deal.title}</h4>
                          <p className="text-sm text-gray-600">
                            Stage: {deal.stage} | Expected: {new Date(deal.expectedClose).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="accent">{deal.probability}%</Badge>
                          <span className="font-semibold text-gray-900">
                            ${deal.value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity History</h3>
                <ActivityFeed relatedId={contact.Id} />
              </div>
            )}
          </motion.div>
        </Card>
      </div>
    </div>
  )
}

export default ContactDetail