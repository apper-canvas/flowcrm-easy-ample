import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: 'Dashboard', href: '/', icon: 'BarChart3' },
    { name: 'Contacts', href: '/contacts', icon: 'Users' },
    { name: 'Deals', href: '/deals', icon: 'DollarSign' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Custom Fields', href: '/custom-fields', icon: 'Sliders' },
    { name: 'Reports', href: '/reports', icon: 'FileText' },
  ]

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 px-6 bg-gradient-to-r from-primary to-secondary">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-primary" />
            </div>
            <span className="text-xl font-bold text-white">FlowCRM</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <ApperIcon name={item.icon} size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-primary to-secondary">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={20} className="text-primary" />
              </div>
              <span className="text-xl font-bold text-white">FlowCRM</span>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <ApperIcon name={item.icon} size={20} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar