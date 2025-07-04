import { motion } from 'framer-motion'

const Loading = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-4"
      />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  )
}

export default Loading