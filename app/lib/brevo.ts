// Alta/actualización de contacto en Brevo (ex-Sendinblue) — una sola lista para todo
// (newsletter + compradores), ver BREVO_LIST_ID. Nunca debe romper el flujo que la llama
// (submit del form de newsletter, ni la confirmación de un pedido) — por eso el try/catch
// interno nunca re-lanza, solo loguea.
export async function addContactToBrevo(email: string, attributes?: Record<string, unknown>) {
  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY ?? '',
      },
      body: JSON.stringify({
        email,
        listIds: [Number(process.env.BREVO_LIST_ID)],
        // Evita el error "contact already exists" — si el contacto ya existe, lo actualiza
        // (y lo agrega a la lista) en vez de fallar.
        updateEnabled: true,
        ...(attributes ? { attributes } : {}),
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[brevo] addContactToBrevo falló:', res.status, body)
    }
  } catch (err) {
    console.error('[brevo] addContactToBrevo error:', err)
  }
}
