import React from 'react'

const ErrorMessage = ({ message, className = '', icon = '⚠️' }) => {
  return (
    <div className={`flex items-center justify-center gap-3 p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{message}</span>
    </div>
  )
}

export default ErrorMessage
