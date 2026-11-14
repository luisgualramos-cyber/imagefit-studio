export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif'

export type FitMode = 'cover' | 'contain' | 'stretch'

export type SizeMode = 'original' | 'percent' | 'custom' | 'preset'

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** Resultado de la detección del elemento principal (coordenadas en píxeles de la imagen original). */
export interface Focus {
  box: Rect
  /** Zona prioritaria dentro de box (p. ej. el rostro dentro de una persona). */
  core?: Rect
  source: 'face' | 'object' | 'saliency'
  label: string
  score?: number
}

/** Encuadre manual: centro normalizado (0-1) y zoom (>=1). */
export interface ManualCrop {
  cx: number
  cy: number
  zoom: number
}

export interface ResultInfo {
  blob: Blob
  url: string
  width: number
  height: number
  size: number
  format: OutputFormat
  warning?: string
}

export type ItemStatus = 'loading' | 'ready' | 'processing' | 'done' | 'error'

export interface ImageItem {
  id: string
  file: File
  name: string
  url: string
  width: number
  height: number
  size: number
  status: ItemStatus
  error?: string
  crop?: ManualCrop
  focus?: Focus | null
  detecting?: boolean
  detectError?: string
  result?: ResultInfo
}

export type BackgroundFill =
  | { type: 'color'; color: string }
  | { type: 'blur' }
  | { type: 'transparent' }

export interface Settings {
  sizeMode: SizeMode
  percent: number
  width: number | ''
  height: number | ''
  lockRatio: boolean
  presetId: string | null
  fit: FitMode
  background: BackgroundFill
  smartCrop: boolean
  format: OutputFormat | 'original'
  quality: number // 1-100
  maxKB: number | ''
  suffix: string
}

/** Trabajo de renderizado autocontenido que se envía al worker. */
export interface RenderJob {
  targetW: number
  targetH: number
  mode: FitMode | 'scale'
  crop?: Rect
  background: BackgroundFill
  format: OutputFormat
  quality: number // 0-1
  maxBytes?: number
}

export interface RenderResult {
  blob: Blob
  width: number
  height: number
  format: OutputFormat
  warning?: string
}
