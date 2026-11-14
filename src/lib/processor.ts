import { computeCrop, getTarget } from './geometry'
import type { ImageItem, OutputFormat, RenderJob, RenderResult, Settings } from './types'

export const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/bmp']
export const MAX_FILE_BYTES = 60 * 1024 * 1024
export const MAX_PIXELS = 120_000_000
export const MAX_FILES = 100

export const FORMAT_LABEL: Record<OutputFormat, string> = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
  'image/avif': 'AVIF',
}
export const FORMAT_EXT: Record<OutputFormat, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10 * 1024 ? 1 : 0)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

let uid = 0
export const newId = () => `${Date.now().toString(36)}-${(uid++).toString(36)}`

const HEIC_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1']

/** Detecta HEIC/HEIF por la cabecera del archivo (las fotos del iPhone), aunque no tenga extensión o tipo. */
export async function isHeicFile(file: Blob & { name?: string }): Promise<boolean> {
  if (/\.(heic|heif)$/i.test(file.name ?? '') || /heic|heif/i.test(file.type)) return true
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const box = String.fromCharCode(...head.slice(4, 8))
  const brand = String.fromCharCode(...head.slice(8, 12))
  return box === 'ftyp' && HEIC_BRANDS.includes(brand)
}

/**
 * Convierte una foto HEIC/HEIF a PNG (sin pérdida) en el navegador con libheif (WebAssembly).
 * Se usa solo cuando el navegador no sabe abrir HEIC por sí mismo (Chrome, Edge, Firefox).
 */
async function decodeHeic(file: File): Promise<File> {
  const { heicTo } = await import('heic-to')
  const png = await heicTo({ blob: file, type: 'image/png' })
  // Se conserva el nombre original (.HEIC) para que «formato original» se trate como JPG.
  return new File([png], file.name, { type: 'image/png', lastModified: file.lastModified })
}

/**
 * Lee una imagen y obtiene sus dimensiones reales (con la orientación EXIF aplicada).
 * Si es HEIC y el navegador no la abre, la convierte antes; devuelve el archivo listo para procesar.
 */
export async function readImage(file: File): Promise<{ width: number; height: number; file: File }> {
  if (file.size > MAX_FILE_BYTES) throw new Error(`El archivo supera el máximo de ${formatBytes(MAX_FILE_BYTES)}.`)
  let usable = file
  let bmp: ImageBitmap
  try {
    bmp = await createImageBitmap(file)
  } catch {
    if (!(await isHeicFile(file))) {
      throw new Error('No se pudo leer el archivo. ¿Es una imagen válida (JPG, PNG, WEBP, AVIF, HEIC, GIF o BMP)?')
    }
    try {
      usable = await decodeHeic(file)
      bmp = await createImageBitmap(usable)
    } catch (e) {
      console.warn('HEIC no decodificable:', e)
      throw new Error('No se pudo abrir esta foto HEIC. Puede estar dañada o usar una variante no compatible.')
    }
  }
  const { width, height } = bmp
  bmp.close()
  if (width * height > MAX_PIXELS) throw new Error('La imagen es demasiado grande (más de 120 megapíxeles).')
  return { width, height, file: usable }
}

export function sourceFormat(file: File): OutputFormat {
  // Las fotos HEIC se entregan como JPG (el formato equivalente más compatible).
  if (/\.(heic|heif)$/i.test(file.name)) return 'image/jpeg'
  const t = file.type as OutputFormat
  if (t in FORMAT_LABEL) return t
  return 'image/png'
}

export function resolveFormat(item: ImageItem, s: Settings): OutputFormat {
  return s.format === 'original' ? sourceFormat(item.file) : s.format
}

export function buildJob(item: ImageItem, s: Settings): RenderJob {
  const t = getTarget(item, s)
  const format = resolveFormat(item, s)
  let mode: RenderJob['mode'] = 'scale'
  if (t.kind === 'exact') mode = s.fit
  const job: RenderJob = {
    targetW: t.w,
    targetH: t.h,
    mode,
    background: s.background,
    format,
    quality: Math.min(1, Math.max(0.01, s.quality / 100)),
    maxBytes: typeof s.maxKB === 'number' && s.maxKB > 0 ? s.maxKB * 1024 : undefined,
  }
  if (mode === 'cover') {
    job.crop = computeCrop(item.width, item.height, t.w, t.h, item.crop, s.smartCrop ? item.focus : null)
  }
  return job
}

export function outputName(originalName: string, format: OutputFormat, suffix: string) {
  const base = originalName.replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|]+/g, '_') || 'imagen'
  return `${base}${suffix}.${FORMAT_EXT[format]}`
}

/* ---------- Pool de Web Workers ---------- */

const canUseWorkers = () =>
  typeof Worker !== 'undefined' &&
  typeof OffscreenCanvas !== 'undefined' &&
  'convertToBlob' in OffscreenCanvas.prototype &&
  typeof createImageBitmap !== 'undefined'

interface Pending {
  resolve: (r: RenderResult) => void
  reject: (e: Error) => void
}

class WorkerPool {
  private workers: Worker[] = []
  private idle: Worker[] = []
  private queue: { blob: Blob; job: RenderJob; p: Pending }[] = []
  private pending = new Map<number, Pending>()
  private busy = new Map<Worker, number>()
  private seq = 0

  constructor(size: number) {
    for (let i = 0; i < size; i++) {
      const w = new Worker(new URL('./imageWorker.ts', import.meta.url), { type: 'module' })
      w.onmessage = (e) => this.onMessage(w, e.data)
      w.onerror = (e) => {
        const id = this.busy.get(w)
        if (id !== undefined) {
          this.pending.get(id)?.reject(new Error(e.message || 'Error en el procesador de imágenes.'))
          this.pending.delete(id)
          this.busy.delete(w)
        }
        this.idle.push(w)
        this.next()
      }
      this.workers.push(w)
      this.idle.push(w)
    }
  }

  run(blob: Blob, job: RenderJob) {
    return new Promise<RenderResult>((resolve, reject) => {
      this.queue.push({ blob, job, p: { resolve, reject } })
      this.next()
    })
  }

  private next() {
    while (this.idle.length && this.queue.length) {
      const w = this.idle.pop()!
      const task = this.queue.shift()!
      const id = ++this.seq
      this.pending.set(id, task.p)
      this.busy.set(w, id)
      w.postMessage({ id, blob: task.blob, job: task.job })
    }
  }

  private onMessage(w: Worker, data: { id: number; ok: boolean; res?: RenderResult; error?: string }) {
    const p = this.pending.get(data.id)
    this.pending.delete(data.id)
    this.busy.delete(w)
    this.idle.push(w)
    if (p) {
      if (data.ok && data.res) p.resolve(data.res)
      else p.reject(new Error(data.error || 'Error desconocido al procesar.'))
    }
    this.next()
  }
}

let pool: WorkerPool | null = null
const getPool = () => {
  if (!pool) {
    const n = Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 4) - 1))
    pool = new WorkerPool(n)
  }
  return pool
}

async function runMainThread(blob: Blob, job: RenderJob): Promise<RenderResult> {
  const { renderAndEncode } = await import('./render')
  const bmp = await createImageBitmap(blob)
  try {
    return await renderAndEncode(bmp, bmp.width, bmp.height, job)
  } finally {
    bmp.close()
  }
}

/** Procesa una imagen (en un Web Worker si el navegador lo permite). */
export async function processBlob(blob: Blob, job: RenderJob): Promise<RenderResult> {
  if (canUseWorkers()) {
    try {
      return await getPool().run(blob, job)
    } catch (err) {
      // Algunos navegadores fallan con AVIF/OffscreenCanvas en workers: reintento en el hilo principal.
      if (err instanceof Error && /lienzo|OffscreenCanvas|getContext/i.test(err.message)) return runMainThread(blob, job)
      throw err
    }
  }
  return runMainThread(blob, job)
}

export async function makeZip(files: { name: string; blob: Blob }[]): Promise<Blob> {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  const used = new Set<string>()
  for (const f of files) {
    let name = f.name
    let i = 2
    while (used.has(name.toLowerCase())) {
      name = f.name.replace(/(\.[^.]+)$/, `-${i++}$1`)
    }
    used.add(name.toLowerCase())
    zip.file(name, f.blob)
  }
  return zip.generateAsync({ type: 'blob', compression: 'STORE' })
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30_000)
}
