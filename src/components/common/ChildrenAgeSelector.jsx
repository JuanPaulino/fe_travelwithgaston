import React, { useCallback, useMemo, memo, useState, useEffect } from 'react'

const ChildrenAgeSelector = memo(({ 
  children, 
  childrenAges = [], 
  onChildrenAgesChange, 
  className = ''
}) => {
  // Estado local para las edades de los niños
  const [localAges, setLocalAges] = useState([])

  // Si no hay niños, no mostrar nada
  if (children === 0) {
    return null
  }

  // Inicializar el estado local cuando cambie el número de niños
  useEffect(() => {
    const newAges = Array.from({ length: children }, (_, index) => {
      // Si ya existe un valor en childrenAges, usarlo; si no, usar 0
      return childrenAges[index] !== undefined ? childrenAges[index] : 0
    })
    setLocalAges(newAges)
  }, [children, childrenAges])

  // Memoizar la función de cambio de edad para evitar re-renders
  const handleAgeChange = useCallback((index, newAge) => {
    const age = parseInt(newAge, 10)
    setLocalAges(prevAges => {
      const newAges = [...prevAges]
      newAges[index] = age
      
      // Emitir cambios inmediatamente al componente padre
      if (onChildrenAgesChange) {
        onChildrenAgesChange(newAges)
      }
      
      return newAges
    })
  }, [onChildrenAgesChange])

  // Memoizar las opciones de edad para evitar recrearlas en cada render
  const ageOptions = useMemo(() => {
    return Array.from({ length: 18 }, (_, age) => (
      <option key={age} value={age}>
        {age} years old
      </option>
    ))
  }, [])

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-900">
        Children's Ages
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: children }, (_, index) => (
          <div key={index} className="space-y-1">
            <label 
              htmlFor={`child-age-${index}`}
              className="text-xs text-gray-600"
            >
              Child {index + 1}
            </label>
            <select
              id={`child-age-${index}`}
              value={localAges[index] || 0}
              onChange={(e) => handleAgeChange(index, e.target.value)}
              className="w-full px-3 py-2 text-sm border text-black outline-0 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              aria-label={`Age for child ${index + 1}`}
            >
              {ageOptions}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
})

ChildrenAgeSelector.displayName = 'ChildrenAgeSelector'

export default ChildrenAgeSelector
