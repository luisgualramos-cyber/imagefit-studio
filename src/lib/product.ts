/**
 * Herramientas para fotos de producto: eliminación de fondo real (modelo IS-Net en el navegador
 * vía @imgly/background-removal), detección de los límites del producto y composición sobre lienzo.
 */
import { ctx2d, drawHQ, encodeCanvas, makeCanvas } from './render'
import type { OutputFormat, Rect } from './types'

export type BgProgress = (stage: string, fraction: number) => void

export async function removeBackground(file: Blob, onProgress?: BgProgress): Promise<Blob> {
  const mod = await import('@imgly/background-removal')
  return mod.removeBackground(file, {
    model: 'isnet_fp16',
    output: { format: 'image/png' },
    progress: (key: string, current: number, total: number) => {
      const stage = key.startsWith('fetch') ? 'Descargando modelo de IA (solo la primera vez)' : 'Separando el producto del fondo'
      onProgress?.(stage, total ? current / total : 0)
    },
  })
}

/** Caja que contiene el producto: por transparencia (si hay recorte) o por diferencia con el color del borde. */
export function findSubjectBounds(img: ImageBitmap, useAlpha: boolean): Rect {
  const W = img.width
  const H = img.height
  const k = Math.min(1, 800 / Math.max(W, H))
  const w = Math.max(1, Math.round(W * k))
  const h = Math.max(1, Math.round(H * k))
  const c = makeCanvas(w, h)
  const ctx = ctx2d(c)
  ctx.drawImage(img, 0, 0, w, h)
  const d = ctx.getImageData(0, 0, w, h).data

  let isFg: (i: number) => boolean
  if (useAlpha) {
    isFg = (i) => d[i + 3] > 20
  } else {
    // Color de fondo estimado a partir del perímetro de la imagen.
    let r = 0
    let g = 0
    let b = 0
    let n = 0
    const sample = (x: number, y: number) => {
      const i = (y * w + x) * 4
      r += d[i]
      g += d[i + 1]
      b += d[i + 2]
      n++
    }
    for (let x = 0; x < w; x += 2) {
      sample(x, 0)
      sample(x, h - 1)
    }
    for (let y = 0; y < h; y += 2) {
      sample(0, y)
      sample(w - 1, y)
    }
    r /= n
    g /= n
    b /= n
    isFg = (i) => d[i + 3] > 20 && Math.abs(d[i] - r) + Math.abs(d[i + 1] - g) + Math.abs(d[i + 2] - b) > 60
  }

  const rows = new Uint32Array(h)
  const cols = new Uint32Array(w)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (isFg((y * w + x) * 4)) {
        rows[y]++
        cols[x]++
      }
    }
  }
  const minRow = Math.max(1, Math.round(w * 0.004))
  const minCol = Math.max(1, Math.round(h * 0.004))
  let y1 = 0
  while (y1 < h && rows[y1] < minRow) y1++
  let y2 = h - 1
  while (y2 > y1 && rows[y2] < minRow) y2--
  let x1 = 0
  while (x1 < w && cols[x1] < minCol) x1++
  let x2 = w - 1
  while (x2 > x1 && cols[x2] < minCol) x2--
  if (y1 >= h || x1 >= w || x2 - x1 < 4 || y2 - y1 < 4) return { x: 0, y: 0, w: W, h: H }
  return { x: x1 / k, y: y1 / k, w: (x2 - x1 + 1) / k, h: (y2 - y1 + 1) / k }
}

export interface ComposeOptions {
  width: number
  height: number
  background: string | 'transparent'
  marginPct: number
  autoCenter: boolean
  useAlpha: boolean
  shadow: boolean
  format: OutputFormat
  quality: number
  maxBytes?: number
}

export async function composeProduct(source: Blob, o: ComposeOptions) {
  const img = await createImageBitmap(source)
  try {
    const box = o.autoCenter ? findSubjectBounds(img, o.useAlpha) : { x: 0, y: 0, w: img.width, h: img.height }
    const canvas = makeCanvas(o.width, o.height)
    const ctx = ctx2d(canvas)
    const bg = o.background === 'transparent' && o.format === 'image/jpeg' ? '#ffffff' : o.background
    if (bg !== 'transparent') {
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, o.width, o.height)
    }
    const m = Math.min(0.45, Math.max(0, o.marginPct / 100))
    const availW = o.width * (1 - 2 * m)
    const availH = o.height * (1 - 2 * m)
    const k = Math.min(availW / box.w, availH / box.h)
    const dw = box.w * k
    const dh = box.h * k
    const dx = (o.width - dw) / 2
    const dy = (o.height - dh) / 2
    if (o.shadow && o.useAlpha) {
      // Sombra de contacto suave bajo el producto.
      const g = ctx.createRadialGradient(o.width / 2, dy + dh, 1, o.width / 2, dy + dh, dw * 0.55)
      g.addColorStop(0, 'rgba(0,0,0,0.22)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.save()
      ctx.translate(0, dy + dh)
      ctx.scale(1, 0.12)
      ctx.translate(0, -(dy + dh))
      ctx.fillStyle = g
      ctx.fillRect(0, dy + dh - dw * 0.55, o.width, dw * 1.1)
      ctx.restore()
    }
    drawHQ(ctx, img, box.x, box.y, box.w, box.h, dx, dy, dw, dh)
    const { blob, warning } = await encodeCanvas(canvas, o.format, o.quality, o.maxBytes)
    return { blob, warning, width: o.width, height: o.height }
  } finally {
    img.close()
  }
}
