import React from 'react'

const LoadingSpinner = ({ text = 'Cargando...', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`}>
      <img 
        src="/spinner.gif" 
        alt="Loading..." 
        className={`${sizeClasses[size]} object-contain`}
      />
      {text && (
        <p className="text-sm text-gray-600 text-center">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner
