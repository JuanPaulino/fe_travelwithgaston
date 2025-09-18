import { useRef, useCallback, useEffect } from 'react'

/**
 * Hook personalizado para manejar debounce de funciones
 * @param {Function} callback - Función a ejecutar con debounce
 * @param {number} delay - Delay en milisegundos (default: 500)
 * @param {Object} options - Opciones adicionales
 * @param {boolean} options.immediate - Si ejecutar inmediatamente en la primera llamada (default: false)
 * @param {Function} options.condition - Función que debe retornar true para ejecutar el callback
 * @returns {Object} - Objeto con funciones para controlar el debounce
 */
export function useDebounce(callback, delay = 500, options = {}) {
  const { immediate = false, condition } = options
  
  const timeoutRef = useRef(null)
  const isExecutingRef = useRef(false)
  const hasExecutedRef = useRef(false)
  const callbackRef = useRef(callback)
  const conditionRef = useRef(condition)

  // Actualizar refs cuando cambien las dependencias
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    conditionRef.current = condition
  }, [condition])

  // Función para limpiar el timeout actual
  const clearCurrentTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Función interna para ejecutar el callback
  const executeCallback = useCallback(async (...args) => {
    if (isExecutingRef.current) {
      console.log('🚫 Callback cancelado: ya hay una ejecución en progreso')
      return
    }

    try {
      isExecutingRef.current = true
      await callbackRef.current(...args)
    } catch (error) {
      console.error('❌ Error en callback con debounce:', error)
    } finally {
      isExecutingRef.current = false
    }
  }, [])

  // Función para ejecutar el callback con debounce
  const debouncedCallback = useCallback((...args) => {
    // Verificar condición si existe
    if (conditionRef.current && !conditionRef.current(...args)) {
      console.log('🚫 Debounce cancelado: condición no cumplida')
      return
    }

    // Limpiar timeout anterior
    clearCurrentTimeout()

    // Si es la primera ejecución y immediate es true, ejecutar inmediatamente
    if (immediate && !hasExecutedRef.current) {
      hasExecutedRef.current = true
      executeCallback(...args)
      return
    }

    // Configurar nuevo timeout
    timeoutRef.current = setTimeout(() => {
      executeCallback(...args)
    }, delay)
  }, [delay, immediate, clearCurrentTimeout, executeCallback])

  // Función para cancelar el debounce actual
  const cancel = useCallback(() => {
    clearCurrentTimeout()
    isExecutingRef.current = false
  }, [clearCurrentTimeout])

  // Función para ejecutar inmediatamente sin debounce
  const flush = useCallback((...args) => {
    clearCurrentTimeout()
    executeCallback(...args)
  }, [clearCurrentTimeout, executeCallback])

  // Función para verificar si hay una ejecución pendiente
  const isPending = useCallback(() => {
    return timeoutRef.current !== null
  }, [])

  // Función para verificar si hay una ejecución en progreso
  const isExecuting = useCallback(() => {
    return isExecutingRef.current
  }, [])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      clearCurrentTimeout()
    }
  }, [clearCurrentTimeout])

  return {
    debouncedCallback,
    cancel,
    flush,
    isPending,
    isExecuting
  }
}

export default useDebounce
