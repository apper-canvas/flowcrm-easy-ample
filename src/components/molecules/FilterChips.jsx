import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const FilterChips = ({ 
  filters = [], 
  activeFilters = [], 
  onFilterChange,
  className = '' 
}) => {
  const handleFilterClick = (filter) => {
    const isActive = activeFilters.includes(filter.value)
    const newFilters = isActive
      ? activeFilters.filter(f => f !== filter.value)
      : [...activeFilters, filter.value]
    
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.value)
        return (
          <motion.button
            key={filter.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFilterClick(filter)}
            className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
          >
            <Badge
              variant={isActive ? 'primary' : 'default'}
              className="cursor-pointer hover:shadow-md"
            >
              <div className="flex items-center gap-1">
                {filter.icon && <ApperIcon name={filter.icon} size={14} />}
                {filter.label}
                {isActive && <ApperIcon name="X" size={12} />}
              </div>
            </Badge>
          </motion.button>
        )
      })}
    </div>
  )
}

export default FilterChips