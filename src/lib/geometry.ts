import { findPreset } from './presets'
import type { Focus, ImageItem, ManualCrop, Rect, Settings } from './types'

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export interface TargetSpec {
  w: number
  h: number
  /** 'scale' = se escala la imagen completa respetando la proporción (sin recorte). */
  kind: 'scale' | 'exact'
}

const MAX_SIDE = 16384

/** Dimensiones finales para una imagen dada la configuración. */
export function getTarget(item: Pick<ImageItem, 'width' | 'height'>, s: Settings): TargetSpec {
  const sw = item.width
  const sh = item.height
  const fix = (w: number, h: number, kind: TargetSpec['kind']): TargetSpec => ({
    w: clamp(Math.round(w), 1, MAX_SIDE),
    h: clamp(Math.round(h), 1, MAX_SIDE),
    kind,
  })
  switch (s.sizeMode) {
    case 'original':
      return fix(sw, sh, 'scale')
    case 'percent':
      return fix((sw * s.percent) / 100, (sh * s.percent) / 100, 'scale')
    case 'preset': {
      const p = findPreset(s.presetId)
      if (!p) return fix(sw, sh, 'scale')
      return fix(p.width, p.height, 'exact')
    }
    case 'custom': {
      const w = typeof s.width === 'number' && s.width > 0 ? s.width : null
      const h = typeof s.height === 'number' && s.height > 0 ? s.height : null
      if (s.lockRatio) {
        // Proporción bloqueada: cada imagen conserva su propia proporción.
        if (w && h) {
          // Encaja dentro de la caja W×H sin deformar.
          const k = Math.min(w / sw, h / sh)
          return fix(sw * k, sh * k, 'scale')
        }
        if (w) return fix(w, (sh * w) / sw, 'scale')
        if (h) return fix((sw * h) / sh, h, 'scale')
        return fix(sw, sh, 'scale')
      }
      if (w && h) return fix(w, h, 'exact')
      if (w) return fix(w, (sh * w) / sw, 'scale')
      if (h) return fix((sw * h) / sh, h, 'scale')
      return fix(sw, sh, 'scale')
    }
  }
}

/** True si la salida exige una proporción distinta a la original (hay que recortar, encajar o estirar). */
export function needsFraming(item: Pick<ImageItem, 'width' | 'height'>, t: TargetSpec) {
  if (t.kind === 'scale') return false
  return Math.abs(item.width / item.height - t.w / t.h) > 0.005
}

const rectCenter = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 })

/**
 * Calcula el rectángulo de recorte (en píxeles de la imagen original) para el modo "cover".
 * Prioridad: encuadre manual > elemento detectado > centro.
 */
export function computeCrop(
  sw: number,
  sh: number,
  tw: number,
  th: number,
  manual?: ManualCrop,
  focus?: Focus | null,
): Rect {
  const ar = tw / th
  let cw: number
  let ch: number
  if (sw / sh > ar) {
    ch = sh
    cw = sh * ar
  } else {
    cw = sw
    ch = sw / ar
  }
  const zoom = manual ? clamp(manual.zoom, 1, 10) : 1
  cw /= zoom
  ch /= zoom

  let cx = sw / 2
  let cy = sh / 2
  if (manual) {
    cx = manual.cx * sw
    cy = manual.cy * sh
  } else if (focus) {
    const b = focus.box
    const c = rectCenter(b)
    const core = focus.core ? rectCenter(focus.core) : null
    // Eje X: si el elemento cabe, se centra en él; si no, se prioriza su zona principal (rostro).
    cx = b.w <= cw ? c.x : core ? core.x : c.x
    if (b.h <= ch) {
      cy = c.y
    } else if (core) {
      // No cabe en altura: mantener la zona principal con algo de aire por encima.
      cy = Math.max(core.y, focus.core!.y - ch * 0.18 + ch / 2)
    } else {
      // Sin zona prioritaria: conservar la parte superior del elemento (cabezas, etiquetas...).
      cy = b.y + ch / 2
    }
  }
  const x = clamp(cx - cw / 2, 0, sw - cw)
  const y = clamp(cy - ch / 2, 0, sh - ch)
  return { x, y, w: cw, h: ch }
}

/** Indica si el elemento detectado queda cortado por el recorte. */
export function focusIsCut(crop: Rect, focus?: Focus | null) {
  if (!focus) return false
  // Si hay zona prioritaria (rostro, sujeto principal de un grupo) basta con que esa zona quede entera.
  const b = focus.core ?? focus.box
  const tol = 0.04
  const cutX = b.x < crop.x - b.w * tol || b.x + b.w > crop.x + crop.w + b.w * tol
  const cutY = b.y < crop.y - b.h * tol || b.y + b.h > crop.y + crop.h + b.h * tol
  return cutX || cutY
}

/** Convierte un rectángulo de recorte en un ManualCrop normalizado. */
export function cropToManual(crop: Rect, sw: number, sh: number, zoom: number): ManualCrop {
  return { cx: (crop.x + crop.w / 2) / sw, cy: (crop.y + crop.h / 2) / sh, zoom }
}
