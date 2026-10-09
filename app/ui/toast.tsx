'use client'

import { useSyncExternalStore } from 'react'

export type ToastVariant = 'success' | 'error'
type Toast = { id: number; message: string; variant: ToastVariant }

// El estado vive a nivel de módulo, no en useState: router.refresh() puede re-montar el
// componente que disparó el toast (pasa en /admin/productos al archivar), y con estado
// local el aviso se perdía a media vida sin que el usuario llegara a leerlo.
let toastIdCounter = 0
let toasts: Toast[] = []
const listeners = new Set<() => void>()

function emit() {
  toasts = [...toasts]
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return toasts
}

const EMPTY: Toast[] = []

export function pushToast(message: string, variant: ToastVariant) {
  const id = ++toastIdCounter
  toasts.push({ id, message, variant })
  emit()
  setTimeout(() => dismissToast(id), 3000)
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

export function useToasts() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)
  return { toasts: current, pushToast, dismissToast }
}

/**
 * Se monta una sola vez en el layout del admin. Vivir fuera del subárbol de cada página
 * es lo que permite que un aviso disparado justo antes de un router.refresh() siga visible:
 * si el container se renderiza dentro de la página, el refresh lo desmonta a media vida.
 */
export function ToastHost() {
  const { toasts, dismissToast } = useToasts()
  return <ToastContainer toasts={toasts} onDismiss={dismissToast} />
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
