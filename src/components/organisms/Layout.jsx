import { useState, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import { AuthContext } from '@/App'
import Button from '@/components/atoms/Button'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useContext(AuthContext)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onLogout={logout}
      />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout