import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200'
  
  const variants = {
    default: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800',
    primary: 'bg-gradient-to-r from-primary to-secondary text-white',
    secondary: 'bg-gradient-to-r from-secondary to-violet-600 text-white',
    accent: 'bg-gradient-to-r from-accent to-pink-500 text-white',
    success: 'bg-gradient-to-r from-success to-emerald-500 text-white',
    warning: 'bg-gradient-to-r from-warning to-amber-500 text-white',
    error: 'bg-gradient-to-r from-error to-red-500 text-white',
    info: 'bg-gradient-to-r from-info to-blue-500 text-white'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }
  
  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={combinedClasses}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export default Badge