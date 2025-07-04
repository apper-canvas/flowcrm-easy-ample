import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const ActivityItem = ({ 
  activity, 
  showDate = true,
  className = '' 
}) => {
  const getActivityIcon = (type) => {
    const icons = {
      email: 'Mail',
      call: 'Phone',
      meeting: 'Calendar',
      note: 'FileText',
      deal: 'DollarSign',
      contact: 'User',
      task: 'CheckSquare'
    }
    return icons[type] || 'Activity'
  }

  const getActivityColor = (type) => {
    const colors = {
      email: 'info',
      call: 'success',
      meeting: 'warning',
      note: 'default',
      deal: 'accent',
      contact: 'primary',
      task: 'secondary'
    }
    return colors[type] || 'default'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
    >
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon 
            name={getActivityIcon(activity.type)} 
            size={14} 
            className="text-gray-600" 
          />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge 
            variant={getActivityColor(activity.type)} 
            size="sm"
          >
            {activity.type}
          </Badge>
          {showDate && (
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-900 mb-1">{activity.description}</p>
        {activity.relatedName && (
          <p className="text-xs text-gray-500">
            Related to: {activity.relatedName}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default ActivityItem