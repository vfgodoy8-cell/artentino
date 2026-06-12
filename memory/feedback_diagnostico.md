---
name: feedback-diagnostico
description: Protocolo de diagnóstico y verificación que usa Valentín — pasos ordenados, parar entre fases, no marcar como resuelto sin confirmación del browser
metadata:
  type: feedback
---

Cuando hay un bug, diagnosticar EN EL ORDEN INDICADO y reportar los hallazgos de cada paso ANTES de tocar nada.

**Why:** Valentín establece explícitamente el orden de diagnóstico (pasos 1–4) y quiere ver qué se encontró en cada paso antes de cualquier modificación. "Mostrame qué encontrás en cada paso ANTES de modificar nada" y "No marques ningún bug como resuelto hasta que yo lo confirme en el navegador."

**How to apply:**
- Al recibir un bug con pasos numerados: ejecutar todos, reportar hallazgos por paso, indicar en cuál estaba el problema, esperar OK antes de implementar el fix.
- Al terminar cada fase de implementación: parar y avisar para que Valentín verifique en el navegador antes de avanzar.
- Nunca declarar un bug como resuelto basándose solo en análisis de código — esperar confirmación visual del browser.
