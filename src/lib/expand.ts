/**
 * Ampliación de imágenes a un formato distinto.
 *  - Relleno local (sin IA, en el navegador): desenfoque, espejo suavizado o color.
 *  - Relleno generativo (IA): Stability AI "Outpaint" a través de la función /api/outpaint (servidor).
 */
import { ctx2d, drawBlurBackground, drawHQ, makeCanvas } from './render'

export type LocalFill = 'blur' | 'mirror' | 'color'

export interface Placement {
  /** Tamaño final */
  W: number
  H: number
  /** Rectángulo donde va la imagen original dentro del lienzo final */
  x: number
  y: number
  w: number
  h: number
}

/** Coloca la imagen original dentro del lienzo final. scale 1 = lo más grande posible sin recortar. */
export function computePlacement(sw: number, sh: number, W: number, H: number, scale: number, ax: number, ay: number): Placement {
  const k = Math.min(W / sw, H / sh) * Math.min(1, Math.max(0.2, scale))
  const w = Math.round(sw * k)
  const h = Math.round(sh * k)
  return { W, H, w, h, x: Math.round((W - w) * ax), y: Math.round((H - h) * ay) }
}

type AnyCanvas = ReturnType<typeof makeCanvas>

export function localExpand(img: ImageBitmap, p: Placement, fill: LocalFill, color: string): AnyCanvas {
  const canvas = makeCanvas(p.W, p.H)
  const ctx = ctx2d(canvas)
  if (fill === 'color') {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, p.W, p.H)
  } else if (fill === 'blur') {
    drawBlurBackground(ctx, img, img.width, img.height, p.W, p.H)
  } else {
    // Espejo: copias reflejadas alrededor del original y difuminado de la zona añadida.
    const tmp = makeCanvas(p.W, p.H)
    const t = ctx2d(tmp)
    for (let ix = -2; ix <= 2; ix++) {
      for (let iy = -2; iy <= 2; iy++) {
        const fx = ix % 2 !== 0
        const fy = iy % 2 !== 0
        t.save()
        t.translate(p.x + ix * p.w + (fx ? p.w : 0), p.y + iy * p.h + (fy ? p.h : 0))
        t.scale(fx ? -1 : 1, fy ? -1 : 1)
        drawHQ(t, img, 0, 0, img.width, img.height, 0, 0, p.w, p.h)
        t.restore()
      }
    }
    // Difuminado: se reduce y amplía la versión reflejada para suavizarla.
    const small = makeCanvas(Math.max(4, Math.round(p.W / 12)), Math.max(4, Math.round(p.H / 12)))
    const s = ctx2d(small)
    s.imageSmoothingQuality = 'high'
    drawHQ(s, tmp as CanvasImageSource, 0, 0, p.W, p.H, 0, 0, small.width, small.height)
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(small as CanvasImageSource, 0, 0, p.W, p.H)
    ctx.globalAlpha = 0.22
    ctx.drawImage(tmp as CanvasImageSource, 0, 0)
    ctx.globalAlpha = 1
  }
  // El original, nítido, encima del relleno.
  drawHQ(ctx, img, 0, 0, img.width, img.height, p.x, p.y, p.w, p.h)
  return canvas
}

export interface AiStatus {
  enabled: boolean
  provider?: string
  reason?: string
}

export async function getAiStatus(): Promise<AiStatus> {
  try {
    const r = await fetch('/api/outpaint', { method: 'GET', headers: { Accept: 'application/json' } })
    const ct = r.headers.get('content-type') || ''
    if (!r.ok || !ct.includes('application/json')) return { enabled: false, reason: 'not-deployed' }
    return (await r.json()) as AiStatus
  } catch {
    return { enabled: false, reason: 'offline' }
  }
}

/** Límite de píxeles de trabajo para la API (controla coste y tiempo). */
const AI_MAX_PIXELS = 4_000_000

/**
 * Amplía con IA generativa. Envía al servidor la imagen reducida y los píxeles a añadir por cada lado.
 * Devuelve un lienzo con las dimensiones finales exactas.
 */
export async function aiExpand(img: ImageBitmap, p: Placement, prompt: string): Promise<AnyCanvas> {
  const s = Math.min(1, Math.sqrt(AI_MAX_PIXELS / (p.W * p.H)))
  const w = Math.max(64, Math.round(p.w * s))
  const h = Math.max(64, Math.round(p.h * s))
  const left = Math.round(p.x * s)
  const up = Math.round(p.y * s)
  const right = Math.max(0, Math.round(p.W * s) - w - left)
  const down = Math.max(0, Math.round(p.H * s) - h - up)
  if (left + right + up + down === 0) throw new Error('No hay zona que ampliar: el formato final coincide con el original.')
  if ([left, right, up, down].some((v) => v > 2000)) throw new Error('La ampliación es demasiado grande para la IA (máx. 2000 px por lado). Reduce el tamaño final.')

  const src = makeCanvas(w, h)
  drawHQ(ctx2d(src), img, 0, 0, img.width, img.height, 0, 0, w, h)
  const blob = 'convertToBlob' in src ? await src.convertToBlob({ type: 'image/png' }) : await new Promise<Blob>((res, rej) => (src as HTMLCanvasElement).toBlob((b) => (b ? res(b) : rej(new Error('PNG'))), 'image/png'))

  const fd = new FormData()
  fd.append('image', blob, 'image.png')
  fd.append('left', String(left))
  fd.append('right', String(right))
  fd.append('up', String(up))
  fd.append('down', String(down))
  if (prompt.trim()) fd.append('prompt', prompt.trim().slice(0, 500))

  const r = await fetch('/api/outpaint', { method: 'POST', body: fd })
  if (!r.ok) {
    let msg = `El servicio de IA respondió con un error (${r.status}).`
    try {
      const j = await r.json()
      if (j?.error) msg = j.error
    } catch {
      /* respuesta no JSON */
    }
    throw new Error(msg)
  }
  const out = await createImageBitmap(await r.blob())
  const canvas = makeCanvas(p.W, p.H)
  const ctx = ctx2d(canvas)
  drawHQ(ctx, out, 0, 0, out.width, out.height, 0, 0, p.W, p.H)
  out.close()
  return canvas
}
