import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  className = '',
  showButton = true 
}) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  const handleChange = (e) => {
    setQuery(e.target.value)
    if (onSearch && !showButton) {
      onSearch(e.target.value)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${className}`}
      onSubmit={handleSubmit}
    >
      <div className="flex-1">
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          icon="Search"
          iconPosition="left"
        />
      </div>
      {showButton && (
        <Button
          type="submit"
          variant="primary"
          icon="Search"
        >
          Search
        </Button>
      )}
    </motion.form>
  )
}

export default SearchBar