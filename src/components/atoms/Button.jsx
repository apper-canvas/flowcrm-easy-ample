import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon = null, 
  iconPosition = 'left',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 focus:ring-primary shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-300 border border-gray-300',
    accent: 'bg-gradient-to-r from-accent to-pink-500 text-white hover:from-accent/90 hover:to-pink-500/90 focus:ring-accent shadow-lg hover:shadow-xl',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
    success: 'bg-gradient-to-r from-success to-emerald-500 text-white hover:from-success/90 hover:to-emerald-500/90 focus:ring-success shadow-lg',
    danger: 'bg-gradient-to-r from-error to-red-500 text-white hover:from-error/90 hover:to-red-500/90 focus:ring-error shadow-lg'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'hover:scale-105 active:scale-95'
  
  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`
  
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {icon && iconPosition === 'left' && <ApperIcon name={icon} size={16} />}
      {children}
      {icon && iconPosition === 'right' && <ApperIcon name={icon} size={16} />}
    </motion.button>
  )
}

export default Button