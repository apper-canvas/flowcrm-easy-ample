import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import ContactList from '@/components/organisms/ContactList'
import SearchBar from '@/components/molecules/SearchBar'
import FilterChips from '@/components/molecules/FilterChips'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState([])

  const filterOptions = [
    { label: 'Active', value: 'active', icon: 'CheckCircle' },
    { label: 'Inactive', value: 'inactive', icon: 'XCircle' },
    { label: 'Lead', value: 'lead', icon: 'Target' },
    { label: 'Customer', value: 'customer', icon: 'Star' },
    { label: 'Partner', value: 'partner', icon: 'Handshake' }
  ]

const [showAddForm, setShowAddForm] = useState(false)

  const handleAddContact = () => {
    setShowAddForm(true)
  }

  const handleImportContacts = () => {
    toast.info('Import contacts functionality coming soon!')
  }

  const handleExportContacts = () => {
    toast.info('Export contacts functionality coming soon!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Contacts" 
        actions={[
          {
            label: 'Import',
            icon: 'Upload',
            variant: 'secondary',
            onClick: handleImportContacts
          },
          {
            label: 'Export',
            icon: 'Download',
            variant: 'secondary',
            onClick: handleExportContacts
          },
          {
            label: 'Add Contact',
            icon: 'Plus',
            variant: 'primary',
            onClick: handleAddContact
          }
        ]}
      />
      
      <div className="p-6 space-y-6">
        {/* Search and Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            <SearchBar
              placeholder="Search contacts by name, email, or company..."
              onSearch={setSearchQuery}
              showButton={false}
            />
            
            <FilterChips
              filters={filterOptions}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
            />
          </div>
        </Card>

        {/* Contact List */}
<ContactList 
          searchQuery={searchQuery}
          filters={activeFilters}
          showAddForm={showAddForm}
          onAddFormClose={() => setShowAddForm(false)}
        />
      </div>
    </div>
  )
}

export default Contacts