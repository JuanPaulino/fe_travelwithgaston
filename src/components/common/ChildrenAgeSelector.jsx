import React from 'react'

const ChildrenAgeSelector = ({ 
  children, 
  childrenAges = [], 
  onChildrenAgesChange, 
  className = '' 
}) => {
  // Si no hay niños, no mostrar nada
  if (children === 0) {
    return null
  }

  // Inicializar edades si no existen
  React.useEffect(() => {
    if (children > 0 && childrenAges.length === 0) {
      debugger
      const defaultAges = Array(children).fill(8) // Edad por defecto: 8 años
      onChildrenAgesChange(defaultAges)
    }
  }, [children, childrenAges.length, onChildrenAgesChange])

  const handleAgeChange = (index, newAge) => {
    const newAges = [...childrenAges]
    newAges[index] = parseInt(newAge)
    onChildrenAgesChange(newAges)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-900">
        Children's Ages
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: children }, (_, index) => (
          <div key={index} className="space-y-1">
            <label className="text-xs text-gray-600">
              Child {index + 1}
            </label>
            <select
              value={childrenAges[index] !== undefined ? childrenAges[index] : 8}
              onChange={(e) => handleAgeChange(index, e.target.value)}
              className="w-full px-3 py-2 text-sm border text-black outline-0 border-gray-300 rounded-md focus:ring-2"
            >
              {Array.from({ length: 18 }, (_, age) => (
                <option key={age} value={age}>
                  {age} years old
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChildrenAgeSelector
