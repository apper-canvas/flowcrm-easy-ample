import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import activityService from '@/services/api/activityService'
import contactService from '@/services/api/contactService'
import dealService from '@/services/api/dealService'
import ActivityItem from '@/components/molecules/ActivityItem'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const ActivityFeed = ({ relatedId = null, limit = 10 }) => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await activityService.getAll()
      
      // Filter by related ID if provided
      let filteredActivities = relatedId 
        ? data.filter(activity => activity.relatedId === relatedId)
        : data
      
      // Sort by timestamp (newest first)
      filteredActivities = filteredActivities.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
      
      // Limit results
      if (limit > 0) {
        filteredActivities = filteredActivities.slice(0, limit)
      }
      
      // Enhance with related names
      const enhancedActivities = await Promise.all(
        filteredActivities.map(async (activity) => {
          try {
            let relatedName = ''
            if (activity.relatedId) {
              // Try to find related contact or deal
              const contacts = await contactService.getAll()
              const deals = await dealService.getAll()
              
              const contact = contacts.find(c => c.Id === activity.relatedId)
              const deal = deals.find(d => d.Id === activity.relatedId)
              
              if (contact) {
                relatedName = contact.name
              } else if (deal) {
                relatedName = deal.title
              }
            }
            
            return { ...activity, relatedName }
          } catch (err) {
            return activity
          }
        })
      )
      
      setActivities(enhancedActivities)
    } catch (err) {
      setError('Failed to load activities')
      toast.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [relatedId, limit])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadActivities} />
  if (activities.length === 0) return <Empty message="No activities found" />

  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <motion.div
          key={activity.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ActivityItem activity={activity} />
        </motion.div>
      ))}
    </div>
  )
}

export default ActivityFeed