import type { Metadata } from 'next'
import ArrepentimientoForm from '@/app/ui/arrepentimiento-form'

export const metadata: Metadata = {
  title: 'Botón de Arrepentimiento — Artentino',
  description: 'Pedí la cancelación de tu compra dentro de los 10 días corridos desde la entrega, según la Resolución 424/2020.',
}

export default function ArrepentimientoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: '#0eb1c3' }}>
            Legal
          </p>
          <h1 className="text-3xl font-black text-[#1E1E1E] sm:text-4xl">
            Botón de Arrepentimiento
          </h1>
          <p className="mt-3 text-gray-500">
            Si te arrepentiste de una compra, podés pedir la cancelación enviando este formulario con tu
            número de orden. Tenés como máximo hasta 10 días corridos desde que recibiste el producto.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <ArrepentimientoForm />
      </div>
    </div>
  )
}
