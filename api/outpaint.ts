/**
 * Función serverless de Vercel: ampliación generativa (outpainting) con Stability AI.
 *
 * DESACTIVADA por defecto. Solo se activa si se definen en Vercel:
 *   STABILITY_API_KEY=sk-...        (clave de https://platform.stability.ai, servicio de pago por créditos)
 *   OUTPAINT_ENABLED=true
 * Opcional:
 *   OUTPAINT_ALLOWED_ORIGIN=https://tu-dominio.vercel.app   (rechaza peticiones de otros orígenes)
 *
 * La imagen se reenvía a Stability AI y la respuesta se devuelve directamente: no se guarda nada.
 */
declare const process: { env: Record<string, string | undefined> }

export const maxDuration = 60

const ENDPOINT = 'https://api.stability.ai/v2beta/stable-image/edit/outpaint'
const MAX_UPLOAD = 4 * 1024 * 1024

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

const enabled = () => process.env.OUTPAINT_ENABLED === 'true' && !!process.env.STABILITY_API_KEY

export function GET() {
  return json({
    enabled: enabled(),
    provider: 'Stability AI',
    reason: enabled() ? undefined : 'not-configured',
  })
}

export async function POST(request: Request) {
  if (!enabled()) {
    return json({ error: 'La ampliación con IA no está activada en este servidor.' }, 503)
  }
  const allowed = process.env.OUTPAINT_ALLOWED_ORIGIN
  if (allowed) {
    const origin = request.headers.get('origin') || ''
    if (origin !== allowed) return json({ error: 'Origen no permitido.' }, 403)
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ error: 'Petición no válida.' }, 400)
  }
  const image = form.get('image')
  if (!(image instanceof Blob) || image.size === 0) return json({ error: 'Falta la imagen.' }, 400)
  if (image.size > MAX_UPLOAD) return json({ error: 'La imagen enviada es demasiado grande (máx. 4 MB).' }, 413)

  const out = new FormData()
  out.append('image', image, 'image.png')
  for (const side of ['left', 'right', 'up', 'down']) {
    const v = Number(form.get(side) ?? 0)
    if (!Number.isFinite(v) || v < 0 || v > 2000) return json({ error: `Valor de ampliación no válido (${side}).` }, 400)
    out.append(side, String(Math.round(v)))
  }
  const prompt = form.get('prompt')
  if (typeof prompt === 'string' && prompt.trim()) out.append('prompt', prompt.trim().slice(0, 500))
  out.append('output_format', 'png')

  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.STABILITY_API_KEY}`, Accept: 'image/*' },
    body: out,
  })
  if (!r.ok) {
    let detail = ''
    try {
      const j = (await r.json()) as { errors?: string[]; message?: string }
      detail = j.errors?.join(' ') || j.message || ''
    } catch {
      /* sin detalle */
    }
    const msg =
      r.status === 402
        ? 'La cuenta de Stability AI no tiene créditos suficientes.'
        : `El proveedor de IA devolvió un error (${r.status}). ${detail}`.trim()
    return json({ error: msg }, 502)
  }
  return new Response(r.body, {
    status: 200,
    headers: { 'content-type': r.headers.get('content-type') || 'image/png', 'cache-control': 'no-store' },
  })
}
