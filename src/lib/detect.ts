/**
 * Detección del elemento principal de una foto, 100 % en el navegador:
 *  1. MediaPipe Face Detector (BlazeFace) para rostros.
 *  2. MediaPipe Object Detector (EfficientDet-Lite0, 80 categorías COCO) para personas y objetos.
 *  3. Si no hay detecciones fiables: análisis de prominencia visual con smartcrop.js
 *     (bordes, saturación y tonos de piel), que no es IA pero sí un análisis real del contenido.
 * Las fotos nunca salen del dispositivo: solo se descargan los modelos (una vez, quedan en caché).
 */
import type { Focus, Rect } from './types'

const OBJECT_MODEL =
  'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite'
const FACE_MODEL =
  'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'

type Detectors = {
  object: import('@mediapipe/tasks-vision').ObjectDetector
  face: import('@mediapipe/tasks-vision').FaceDetector
}

let detectorsPromise: Promise<Detectors> | null = null

/** MediaPipe escribe mensajes informativos del runtime WASM por console.error; se silencian solo esos. */
let consoleFiltered = false
function filterMediapipeLogs() {
  if (consoleFiltered) return
  consoleFiltered = true
  const orig = console.error.bind(console)
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && /^(INFO:|W\d{4} |I\d{4} )/.test(args[0])) return
    orig(...args)
  }
}

function loadDetectors(): Promise<Detectors> {
  if (!detectorsPromise) {
    filterMediapipeLogs()
    detectorsPromise = (async () => {
      const vision = await import('@mediapipe/tasks-vision')
      const fileset = await vision.FilesetResolver.forVisionTasks('/mediapipe')
      const [object, face] = await Promise.all([
        vision.ObjectDetector.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: OBJECT_MODEL, delegate: 'CPU' },
          runningMode: 'IMAGE',
          scoreThreshold: 0.3,
          maxResults: 8,
        }),
        vision.FaceDetector.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: FACE_MODEL, delegate: 'CPU' },
          runningMode: 'IMAGE',
          minDetectionConfidence: 0.55,
        }),
      ])
      return { object, face }
    })().catch((e) => {
      detectorsPromise = null
      throw e
    })
  }
  return detectorsPromise
}

const LABELS_ES: Record<string, string> = {
  person: 'Persona',
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Pájaro',
  horse: 'Caballo',
  car: 'Coche',
  bicycle: 'Bicicleta',
  motorcycle: 'Moto',
  bottle: 'Botella',
  cup: 'Taza',
  'wine glass': 'Copa',
  chair: 'Silla',
  couch: 'Sofá',
  'potted plant': 'Planta',
  laptop: 'Portátil',
  'cell phone': 'Móvil',
  book: 'Libro',
  clock: 'Reloj',
  vase: 'Jarrón',
  handbag: 'Bolso',
  backpack: 'Mochila',
  suitcase: 'Maleta',
  tie: 'Corbata',
  umbrella: 'Paraguas',
  'sports ball': 'Balón',
  'teddy bear': 'Peluche',
  bowl: 'Cuenco',
  banana: 'Plátano',
  apple: 'Manzana',
  orange: 'Naranja',
  pizza: 'Pizza',
  cake: 'Tarta',
  sandwich: 'Sándwich',
  tv: 'Televisor',
  keyboard: 'Teclado',
  mouse: 'Ratón',
  truck: 'Camión',
  bus: 'Autobús',
  boat: 'Barco',
  airplane: 'Avión',
  train: 'Tren',
}
const IGNORED = new Set(['dining table', 'bed', 'bench', 'toilet', 'sink', 'refrigerator', 'oven'])

const area = (r: Rect) => r.w * r.h
const union = (rs: Rect[]): Rect => {
  const x1 = Math.min(...rs.map((r) => r.x))
  const y1 = Math.min(...rs.map((r) => r.y))
  const x2 = Math.max(...rs.map((r) => r.x + r.w))
  const y2 = Math.max(...rs.map((r) => r.y + r.h))
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 }
}
const overlap = (a: Rect, b: Rect) => {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
  return w > 0 && h > 0 ? (w * h) / Math.min(area(a), area(b)) : 0
}
const clampRect = (r: Rect, W: number, H: number): Rect => {
  const x = Math.max(0, r.x)
  const y = Math.max(0, r.y)
  return { x, y, w: Math.min(W, r.x + r.w) - x, h: Math.min(H, r.y + r.h) - y }
}

/** Nitidez de una zona: varianza del laplaciano sobre la imagen en escala de grises. */
function sharpness(canvas: HTMLCanvasElement, r: Rect, k: number) {
  const x = Math.max(0, Math.floor(r.x * k))
  const y = Math.max(0, Math.floor(r.y * k))
  const w = Math.min(canvas.width - x, Math.ceil(r.w * k))
  const h = Math.min(canvas.height - y, Math.ceil(r.h * k))
  if (w < 5 || h < 5) return 0
  const d = canvas.getContext('2d', { willReadFrequently: true })!.getImageData(x, y, w, h).data
  const g = new Float32Array(w * h)
  for (let i = 0; i < w * h; i++) g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]
  let sum = 0
  let sum2 = 0
  let n = 0
  for (let yy = 1; yy < h - 1; yy++) {
    for (let xx = 1; xx < w - 1; xx++) {
      const i = yy * w + xx
      const l = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - w] - g[i + w]
      sum += l
      sum2 += l * l
      n++
    }
  }
  const m = sum / n
  return sum2 / n - m * m
}

async function toCanvas(file: Blob, maxSide: number) {
  const bmp = await createImageBitmap(file)
  const k = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.round(bmp.width * k))
  c.height = Math.max(1, Math.round(bmp.height * k))
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bmp, 0, 0, c.width, c.height)
  const full = { w: bmp.width, h: bmp.height }
  bmp.close()
  return { canvas: c, scale: 1 / k, full }
}

async function saliencyFocus(canvas: HTMLCanvasElement, scale: number, W: number, H: number): Promise<Focus> {
  const { default: smartcrop } = await import('smartcrop')
  const side = Math.min(canvas.width, canvas.height)
  const res = await smartcrop.crop(canvas, { width: side, height: side, minScale: 0.5, ruleOfThirds: false })
  const c = res.topCrop
  // La zona de interés es el núcleo del mejor recorte encontrado.
  const box = { x: (c.x + c.width * 0.2) * scale, y: (c.y + c.height * 0.2) * scale, w: c.width * 0.6 * scale, h: c.height * 0.6 * scale }
  return { box: clampRect(box, W, H), source: 'saliency', label: 'Zona de mayor interés visual' }
}

/** Detecta el elemento principal. Lanza error si no se pueden cargar los modelos. */
export async function detectSubject(file: Blob): Promise<Focus> {
  const [{ canvas, scale, full }, det] = await Promise.all([toCanvas(file, 1024), loadDetectors()])
  const W = full.w
  const H = full.h
  const toRect = (b?: { originX: number; originY: number; width: number; height: number }): Rect | null =>
    b ? clampRect({ x: b.originX * scale, y: b.originY * scale, w: b.width * scale, h: b.height * scale }, W, H) : null

  const faces = det.face
    .detect(canvas)
    .detections.map((d) => ({ r: toRect(d.boundingBox), s: d.categories[0]?.score ?? 0 }))
    .filter((f): f is { r: Rect; s: number } => !!f.r && f.r.w > 6)

  const objects = det.object
    .detect(canvas)
    .detections.map((d) => ({
      r: toRect(d.boundingBox),
      s: d.categories[0]?.score ?? 0,
      name: d.categories[0]?.categoryName ?? 'object',
    }))
    .filter((o): o is { r: Rect; s: number; name: string } => !!o.r && !IGNORED.has(o.name) && area(o.r) > W * H * 0.004)

  // 1) Elemento principal reconocido (persona, animal, objeto): confianza × tamaño × nitidez,
  //    con ligera preferencia por el centro. El sujeto de una foto suele ser lo que está enfocado.
  const sharp = new Map(objects.map((o) => [o, sharpness(canvas, o.r, 1 / scale)]))
  const maxSharp = Math.max(1e-6, ...sharp.values())
  const scoreOf = (o: (typeof objects)[number]) => {
    const cx = (o.r.x + o.r.w / 2) / W - 0.5
    const cy = (o.r.y + o.r.h / 2) / H - 0.5
    const focusK = 0.35 + 0.65 * Math.sqrt(sharp.get(o)! / maxSharp)
    return o.s * Math.sqrt(area(o.r) / (W * H)) * (1.15 - Math.hypot(cx, cy) * 0.5) * focusK
  }
  const sorted = objects.filter((o) => o.s >= 0.4).sort((a, b) => scoreOf(b) - scoreOf(a))
  const facesIn = (r: Rect) => faces.filter((f) => overlap(r, f.r) > 0.6)

  if (sorted.length) {
    const top = sorted[0]
    // Agrupa elementos del mismo tipo y tamaño parecido (p. ej. un grupo de personas).
    const peers = sorted.filter((o) => o.name === top.name && o.s >= 0.45 && area(o.r) >= area(top.r) * 0.45)
    const box = union(peers.map((o) => o.r))
    const label = LABELS_ES[top.name] ?? 'Objeto'
    // Zona prioritaria: el rostro de la persona principal (o el propio elemento principal si es un grupo).
    const topFaces = facesIn(top.r)
    const core = topFaces.length ? union(topFaces.map((f) => f.r)) : peers.length > 1 ? top.r : undefined
    return {
      box,
      core,
      source: topFaces.length ? 'face' : 'object',
      label:
        (peers.length > 1 ? `Detectado: ${peers.length} × ${label.toLowerCase()}` : `Detectado: ${label.toLowerCase()}`) +
        (topFaces.length ? ' y rostro' : ''),
      score: top.s,
    }
  }

  // 2) Solo rostros (primeros planos donde el detector de objetos no es concluyente).
  if (faces.length) {
    const maxA = Math.max(...faces.map((f) => area(f.r)))
    const main = faces.filter((f) => area(f.r) >= maxA * 0.25)
    const core = union(main.map((f) => f.r))
    const box = clampRect({ x: core.x - core.w * 0.6, y: core.y - core.h * 0.35, w: core.w * 2.2, h: core.h * 2.6 }, W, H)
    return {
      box,
      core,
      source: 'face',
      label: main.length > 1 ? `${main.length} rostros detectados` : 'Rostro detectado',
      score: Math.max(...main.map((f) => f.s)),
    }
  }

  // 3) Sin elementos reconocibles: análisis de contenido visual.
  return saliencyFocus(canvas, scale, W, H)
}

export function preloadDetectors() {
  return loadDetectors().then(() => undefined)
}
