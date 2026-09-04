'use client'

import { createContext, useContext, useState } from 'react'
import Toast from './Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = ({ status, action, message }) => {
    setToast({
      status,
      action,
      message,
    })
  }

  const handleCloseToast = () => {
    setToast(null)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <Toast
          status={toast.status}
          action={toast.action}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast는 ToastProvider 내부에서 사용해야 합니다.')
  }

  return context
}
