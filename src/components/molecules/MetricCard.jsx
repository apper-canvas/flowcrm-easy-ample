import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  gradient = false,
  className = '' 
}) => {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-gray-600'
  }

  const changeIcons = {
    positive: 'TrendingUp',
    negative: 'TrendingDown',
    neutral: 'Minus'
  }

  return (
    <Card 
      variant={gradient ? 'gradient' : 'elevated'} 
      className={`p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <motion.p 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            {value}
          </motion.p>
          {change && (
            <div className={`flex items-center text-sm ${changeColors[changeType]}`}>
              <ApperIcon name={changeIcons[changeType]} size={16} className="mr-1" />
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name={icon} size={24} className="text-white" />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default MetricCard