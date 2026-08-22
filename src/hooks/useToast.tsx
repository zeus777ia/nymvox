import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type ToastKind = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  kind: ToastKind
}

interface ToastContextType {
  addToast: (message: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { id, message, kind }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const getClass = (kind: ToastKind) => {
    const base = 'px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium max-w-sm '
    if (kind === 'success') return base + 'bg-green-600'
    if (kind === 'error') return base + 'bg-red-600'
    return base + 'bg-indigo-600'
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={getClass(t.kind)} role="status">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
