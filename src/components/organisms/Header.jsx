import { motion } from 'framer-motion'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { AuthContext } from '@/App'
const Header = ({ onMenuClick, title, actions = [] }) => {
  const { logout } = useContext(AuthContext)
  const { user, isAuthenticated } = useSelector((state) => state.user)

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'primary'}
              icon={action.icon}
              onClick={action.onClick}
              className={action.className}
            >
              {action.label}
            </Button>
          ))}
          
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  {user.firstName?.charAt(0) || user.emailAddress?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.emailAddress}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.emailAddress}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                icon="LogOut"
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
                title="Logout"
              />
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Header