import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  required = false,
  disabled = false,
  error = '',
  className = '',
  ...props
}) => {
  const selectClasses = `
    w-full px-3 py-2 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    transition-all duration-200 appearance-none
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
    ${error ? 'border-error focus:ring-error' : ''}
    ${className}
  `

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
<motion.select
          whileFocus={{ scale: 1.01 }}
          value={value}
          onChange={(e) => onChange(e.target?.value || e)}
          required={required}
          disabled={disabled}
          className={selectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </motion.select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
        </div>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Select