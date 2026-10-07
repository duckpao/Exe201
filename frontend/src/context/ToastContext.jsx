import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id))
  }, [])

  const showToast = useCallback(({ message, type = 'error', duration = 4500 }) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((items) => [...items, { id, message, type }])
    window.setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  const value = useMemo(() => ({
    showToast,
    success: (message) => showToast({ message, type: 'success' }),
    error: (message) => showToast({ message, type: 'error' }),
    info: (message) => showToast({ message, type: 'info' }),
  }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={`app-toast app-toast-${toast.type}`} role="status">
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : toast.type === 'info' ? <Info size={20} /> : <CircleAlert size={20} />}
            <span>{toast.message}</span>
            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Đóng thông báo"><X size={18} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast phải được dùng trong ToastProvider')
  return context
}