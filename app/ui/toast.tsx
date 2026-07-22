'use client'

import { useState } from 'react'

export type ToastVariant = 'success' | 'error'
type Toast = { id: number; message: string; variant: ToastVariant }

let toastIdCounter = 0

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  function pushToast(message: string, variant: ToastVariant) {
    const id = ++toastIdCounter
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, pushToast, dismissToast }
}

export function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[10000] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="animate-toast-corner-in pointer-events-auto flex max-w-sm items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg"
          style={{ backgroundColor: t.variant === 'success' ? '#1E1E1E' : '#ef4444' }}
          onClick={() => onDismiss(t.id)}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
