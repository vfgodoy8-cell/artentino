'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { saveEmailTemplate, restoreEmailTemplate } from './actions'

type Template = {
  id: string
  key: string
  name: string
  subject: string
  htmlBody: string
  updatedAt: string
}

const TEMPLATE_VARS: Record<string, { variable: string; description: string }[]> = {
  APPOINTMENT_CONFIRMATION: [
    { variable: '{{nombreCliente}}', description: 'Nombre del cliente' },
    { variable: '{{fecha}}', description: 'Fecha del turno — ej: lunes 7 de julio de 2026' },
    { variable: '{{hora}}', description: 'Hora del turno — ej: 15:00' },
    { variable: '{{modalidad}}', description: '"Presencial en showroom" o "WhatsApp por cámara"' },
  ],
  ORDER_PRE_CONFIRMATION: [
    { variable: '{{nombreCliente}}', description: 'Nombre del cliente' },
    { variable: '{{itemsHtml}}', description: 'Filas HTML de los ítems del pedido (generado automáticamente)' },
    { variable: '{{total}}', description: 'Total del pedido — ej: 12.500 (sin $, se agrega en el template)' },
    { variable: '{{envio}}', description: '"Retiro en tienda — Colegiales, CABA" o "Envío a domicilio"' },
  ],
}

export default function EmailEditor({ templates }: { templates: Template[] }) {
  const [editing, setEditing] = useState<Template | null>(null)

  if (editing) {
    return (
      <EditorView
        template={editing}
        onBack={() => setEditing(null)}
        onSaved={(updated) => setEditing(updated)}
      />
    )
  }

  return (
    <div className="space-y-4">
      {templates.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-white p-5"
        >
          <div>
            <p className="font-bold text-[#1E1E1E]">{t.name}</p>
            <p className="mt-0.5 text-xs text-[#9ca3af]">
              <span className="rounded bg-[#f3f4f6] px-1.5 py-0.5 font-mono text-[11px] text-[#6b7280]">
                {t.key}
              </span>
              {' · '}
              Actualizado {new Date(t.updatedAt).toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p className="mt-1 text-sm text-[#6b7280]">
              Asunto: <span className="font-semibold text-[#1E1E1E]">{t.subject}</span>
            </p>
          </div>
          <button
            onClick={() => setEditing(t)}
            className="ml-4 shrink-0 rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm font-bold text-[#1E1E1E] transition-colors hover:border-[#0eb1c3] hover:text-[#0eb1c3]"
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  )
}

function EditorView({
  template,
  onBack,
  onSaved,
}: {
  template: Template
  onBack: () => void
  onSaved: (updated: Template) => void
}) {
  const router = useRouter()
  const [subject, setSubject] = useState(template.subject)
  const [htmlBody, setHtmlBody] = useState(template.htmlBody)
  const [previewHtml, setPreviewHtml] = useState(template.htmlBody)
  const [showPreview, setShowPreview] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isRestoring, startRestoring] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const vars = TEMPLATE_VARS[template.key] ?? []

  function insertVar(v: string) {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const newVal = htmlBody.slice(0, start) + v + htmlBody.slice(end)
    setHtmlBody(newVal)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + v.length, start + v.length)
    }, 0)
  }

  function handleSave() {
    startTransition(async () => {
      await saveEmailTemplate(template.key, subject, htmlBody)
      router.refresh()
      onSaved({ ...template, subject, htmlBody, updatedAt: new Date().toISOString() })
    })
  }

  function handleRestore() {
    if (!confirm('¿Restaurar el template por defecto? Se perderán los cambios guardados.')) return
    startRestoring(async () => {
      await restoreEmailTemplate(template.key)
      router.refresh()
      onBack()
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#9ca3af] transition-colors hover:text-[#1E1E1E]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          Volver
        </button>
        <span className="text-[#d1d5db]">/</span>
        <span className="text-sm font-bold text-[#1E1E1E]">{template.name}</span>
        <span className="rounded bg-[#f3f4f6] px-2 py-0.5 font-mono text-[11px] text-[#6b7280]">
          {template.key}
        </span>
      </div>

      <div className="space-y-5">
        {/* Subject */}
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#6b7280]">
            Asunto del email
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm font-semibold text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#0eb1c3]"
          />
        </div>

        {/* Variables reference */}
        {vars.length > 0 && (
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-[#6b7280]">
              Variables disponibles — clic para insertar en la posición del cursor
            </p>
            <div className="flex flex-wrap gap-2">
              {vars.map((v) => (
                <button
                  key={v.variable}
                  type="button"
                  onClick={() => insertVar(v.variable)}
                  title={v.description}
                  className="flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 font-mono text-xs text-[#0eb1c3] transition-colors hover:border-[#0eb1c3] hover:bg-[#f0fdfc]"
                >
                  {v.variable}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-1">
              {vars.map((v) => (
                <p key={v.variable} className="text-[11px] text-[#9ca3af]">
                  <span className="font-mono text-[#6b7280]">{v.variable}</span>
                  {' → '}
                  {v.description}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* HTML body */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-[#6b7280]">
              Cuerpo HTML
            </label>
            <button
              type="button"
              onClick={() => {
                setPreviewHtml(htmlBody)
                setShowPreview((v) => !v)
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0eb1c3] transition-opacity hover:opacity-70"
            >
              <EyeIcon />
              {showPreview ? 'Ocultar preview' : 'Mostrar preview'}
            </button>
          </div>
          <textarea
            ref={textareaRef}
            value={htmlBody}
            onChange={(e) => setHtmlBody(e.target.value)}
            rows={18}
            spellCheck={false}
            className="w-full resize-y rounded-xl border border-[#e5e7eb] bg-[#1E1E1E] px-4 py-3 font-mono text-xs leading-relaxed text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#0eb1c3]"
          />
          <p className="mt-1 text-right text-[11px] text-[#9ca3af]">
            {htmlBody.length.toLocaleString('es-AR')} caracteres
          </p>
        </div>

        {/* Preview iframe */}
        {showPreview && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-wider text-[#6b7280]">
                Preview — las variables aparecen como placeholders
              </p>
              <button
                type="button"
                onClick={() => setPreviewHtml(htmlBody)}
                className="text-xs font-bold text-[#0eb1c3] transition-opacity hover:opacity-70"
              >
                Actualizar preview
              </button>
            </div>
            <iframe
              srcDoc={previewHtml}
              sandbox="allow-same-origin"
              title="Preview del email"
              className="h-[600px] w-full rounded-xl border border-[#e5e7eb] bg-white"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between border-t border-[#e5e7eb] pt-4">
          <button
            onClick={handleRestore}
            disabled={isRestoring || isPending}
            className="text-sm font-semibold text-[#9ca3af] underline-offset-2 transition-colors hover:text-[#ef4444] disabled:opacity-40"
          >
            {isRestoring ? 'Restaurando...' : 'Restaurar default'}
          </button>
          <button
            onClick={handleSave}
            disabled={isPending || isRestoring || !subject.trim() || !htmlBody.trim()}
            className="rounded-xl bg-[#0eb1c3] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0a8f9e] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
