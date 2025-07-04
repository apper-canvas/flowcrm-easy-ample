import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const QuickAddButton = ({ 
  options = [], 
  onSelect,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option) => {
    if (onSelect) {
      onSelect(option)
    }
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="accent"
        icon="Plus"
        onClick={() => setIsOpen(!isOpen)}
        className="shadow-lg hover:shadow-xl"
      >
        Quick Add
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            <div className="py-2">
              {options.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  {option.icon && <ApperIcon name={option.icon} size={16} />}
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default QuickAddButton