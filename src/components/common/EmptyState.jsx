import React from 'react'

const EmptyState = ({ icon = '📭', title, message, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 p-8 text-center ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {message && (
          <p className="text-gray-600">{message}</p>
        )}
      </div>
    </div>
  )
}

export default EmptyState
