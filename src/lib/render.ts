/**
 * Núcleo de renderizado y codificación. Funciona tanto en un Web Worker (OffscreenCanvas)
 * como en el hilo principal (HTMLCanvasElement) como alternativa.
 */
import type { OutputFormat, RenderJob, RenderResult } from './types'

type AnyCanvas = OffscreenCanvas | HTMLCanvasElement
type AnyCtx = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D

export function makeCanvas(w: number, h: number): AnyCanvas {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h)
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

export function ctx2d(c: AnyCanvas): AnyCtx {
  const ctx = c.getContext('2d') as AnyCtx | null
  if (!ctx) throw new Error('El navegador no permite crear un lienzo 2D.')
  return ctx
}

export function canvasToBlob(c: AnyCanvas, type: string, quality?: number): Promise<Blob> {
  if ('convertToBlob' in c) return c.convertToBlob({ type, quality })
  return new Promise((resolve, reject) =>
    (c as HTMLCanvasElement).toBlob(
      (b) => (b ? resolve(b) : reject(new Error('No se pudo generar el archivo.'))),
      type,
      quality,
    ),
  )
}

/** Dibuja con reducción progresiva (mitades sucesivas) para evitar dientes de sierra al reducir mucho. */
export function drawHQ(
  ctx: AnyCtx,
  src: CanvasImageSource,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  let cur: CanvasImageSource = src
  let cx = sx
  let cy = sy
  let cw = sw
  let ch = sh
  while (cw / 2 >= dw && ch / 2 >= dh && cw > 4 && ch > 4) {
    const nw = Math.max(1, Math.round(cw / 2))
    const nh = Math.max(1, Math.round(ch / 2))
    const tmp = makeCanvas(nw, nh)
    const t = ctx2d(tmp)
    t.imageSmoothingEnabled = true
    t.imageSmoothingQuality = 'high'
    t.drawImage(cur, cx, cy, cw, ch, 0, 0, nw, nh)
    cur = tmp as CanvasImageSource
    cx = 0
    cy = 0
    cw = nw
    ch = nh
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(cur, cx, cy, cw, ch, dx, dy, dw, dh)
}

/** Fondo desenfocado: reduce la imagen a muy pocos píxeles y la amplía con suavizado (funciona en todos los navegadores). */
export function drawBlurBackground(ctx: AnyCtx, src: CanvasImageSource, sw: number, sh: number, tw: number, th: number) {
  const k = Math.max(tw / sw, th / sh)
  const dw = sw * k
  const dh = sh * k
  const small = makeCanvas(Math.max(2, Math.round(tw / 40)), Math.max(2, Math.round(th / 40)))
  const s = ctx2d(small)
  s.imageSmoothingEnabled = true
  s.imageSmoothingQuality = 'high'
  const r = small.width / tw
  drawHQ(s, src, 0, 0, sw, sh, ((tw - dw) / 2) * r, ((th - dh) / 2) * r, dw * r, dh * r)
  const mid = makeCanvas(Math.max(4, Math.round(tw / 10)), Math.max(4, Math.round(th / 10)))
  const m = ctx2d(mid)
  m.imageSmoothingEnabled = true
  m.imageSmoothingQuality = 'high'
  m.drawImage(small as CanvasImageSource, 0, 0, mid.width, mid.height)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(mid as CanvasImageSource, 0, 0, tw, th)
  ctx.fillStyle = 'rgba(0,0,0,0.12)'
  ctx.fillRect(0, 0, tw, th)
}

export function renderToCanvas(src: CanvasImageSource, sw: number, sh: number, job: RenderJob): AnyCanvas {
  const { targetW: tw, targetH: th } = job
  const canvas = makeCanvas(tw, th)
  const ctx = ctx2d(canvas)
  const opaque = job.format === 'image/jpeg'
  if (opaque) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, tw, th)
  }
  if (job.mode === 'scale' || job.mode === 'stretch') {
    drawHQ(ctx, src, 0, 0, sw, sh, 0, 0, tw, th)
  } else if (job.mode === 'cover') {
    const c = job.crop ?? { x: 0, y: 0, w: sw, h: sh }
    drawHQ(ctx, src, c.x, c.y, c.w, c.h, 0, 0, tw, th)
  } else {
    const bg = job.background
    if (bg.type === 'color') {
      ctx.fillStyle = bg.color
      ctx.fillRect(0, 0, tw, th)
    } else if (bg.type === 'blur') {
      drawBlurBackground(ctx, src, sw, sh, tw, th)
    }
    const k = Math.min(tw / sw, th / sh)
    const dw = sw * k
    const dh = sh * k
    drawHQ(ctx, src, 0, 0, sw, sh, (tw - dw) / 2, (th - dh) / 2, dw, dh)
  }
  return canvas
}

let nativeAvif: boolean | null = null

async function encodeAvif(canvas: AnyCanvas, quality: number): Promise<Blob> {
  if (nativeAvif !== false) {
    try {
      const b = await canvasToBlob(canvas, 'image/avif', quality)
      if (b.type === 'image/avif') {
        nativeAvif = true
        return b
      }
    } catch {
      /* sin soporte nativo */
    }
    nativeAvif = false
  }
  // Codificador AVIF real en WebAssembly (libavif vía @jsquash/avif).
  const { default: encode } = await import('@jsquash/avif/encode.js')
  const data = ctx2d(canvas).getImageData(0, 0, canvas.width, canvas.height)
  const buf = await encode(data, { quality: Math.round(quality * 100), speed: 7 })
  return new Blob([buf], { type: 'image/avif' })
}

/**
 * PNG optimizado con UPNG: sin pérdida (deflate optimizado) o, con calidad < 95,
 * cuantización a paleta (256 colores o menos), la misma técnica que usan los compresores PNG populares.
 */
async function encodePng(canvas: AnyCanvas, quality: number): Promise<Blob> {
  const native = await canvasToBlob(canvas, 'image/png')
  try {
    const { default: UPNG } = await import('upng-js')
    const data = ctx2d(canvas).getImageData(0, 0, canvas.width, canvas.height).data
    const colors = quality >= 0.95 ? 0 : quality >= 0.6 ? 256 : quality >= 0.35 ? 128 : 64
    const buf = UPNG.encode([data.buffer as ArrayBuffer], canvas.width, canvas.height, colors)
    const opt = new Blob([buf], { type: 'image/png' })
    return opt.size < native.size ? opt : native
  } catch {
    return native
  }
}

async function encodeOnce(canvas: AnyCanvas, format: OutputFormat, quality: number): Promise<Blob> {
  if (format === 'image/avif') return encodeAvif(canvas, quality)
  if (format === 'image/png') return encodePng(canvas, quality)
  const b = await canvasToBlob(canvas, format, quality)
  if (b.type !== format) {
    throw new Error(`Tu navegador no puede generar ${format.split('/')[1].toUpperCase()}. Prueba con otro formato.`)
  }
  return b
}

const kb = (n: number) => `${Math.round(n / 1024)} KB`

/** Codifica y, si hay tamaño máximo, busca por bisección la mayor calidad que cumple el límite. */
export async function encodeCanvas(
  canvas: AnyCanvas,
  format: OutputFormat,
  quality: number,
  maxBytes?: number,
): Promise<{ blob: Blob; warning?: string }> {
  const first = await encodeOnce(canvas, format, quality)
  if (!maxBytes || first.size <= maxBytes) return { blob: first }
  if (format === 'image/png') {
    // Paletas cada vez más reducidas hasta cumplir el límite.
    let best = first
    for (const q of [0.9, 0.5, 0.3]) {
      const b = await encodePng(canvas, q)
      if (b.size < best.size) best = b
      if (b.size <= maxBytes) return { blob: b }
    }
    return {
      blob: best,
      warning: `Este PNG ocupa como mínimo ${kb(best.size)} con estas dimensiones (límite: ${kb(maxBytes)}). Reduce el tamaño en píxeles o usa WEBP o JPG.`,
    }
  }
  let lo = 0.02
  let hi = quality
  let best: Blob | null = null
  let smallest = first
  for (let i = 0; i < 7; i++) {
    const q = (lo + hi) / 2
    const b = await encodeOnce(canvas, format, q)
    if (b.size < smallest.size) smallest = b
    if (b.size <= maxBytes) {
      best = b
      lo = q
    } else {
      hi = q
    }
  }
  if (!best) {
    const low = await encodeOnce(canvas, format, 0.02)
    if (low.size <= maxBytes) return { blob: low }
    if (low.size < smallest.size) smallest = low
    return {
      blob: smallest,
      warning: `Con estas dimensiones no se alcanza ${kb(maxBytes)} (mínimo posible: ${kb(smallest.size)}). Reduce el tamaño en píxeles.`,
    }
  }
  return { blob: best }
}

export async function renderAndEncode(src: CanvasImageSource, sw: number, sh: number, job: RenderJob): Promise<RenderResult> {
  const canvas = renderToCanvas(src, sw, sh, job)
  const { blob, warning } = await encodeCanvas(canvas, job.format, job.quality, job.maxBytes)
  return { blob, width: canvas.width, height: canvas.height, format: job.format, warning }
}
