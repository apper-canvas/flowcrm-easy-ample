import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200'
  
  const variants = {
    default: 'hover:shadow-md',
    elevated: 'shadow-lg hover:shadow-xl',
    flat: 'shadow-none border-2',
    gradient: 'bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100'
  }
  
  const hoverClasses = hover ? 'hover:scale-[1.02] cursor-pointer' : ''
  
  const combinedClasses = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`
  
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={combinedClasses}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card