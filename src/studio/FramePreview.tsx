import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { computeCrop, cropToManual, focusIsCut, getTarget, needsFraming } from '../lib/geometry'
import type { ImageItem, Rect, Settings } from '../lib/types'
import { IconAlert, IconRefresh, IconTarget } from '../components/Icons'

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useIso(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

const fitBox = (w: number, h: number, maxW: number, maxH: number) => {
  const k = Math.min(maxW / w, maxH / h)
  return { w: Math.max(1, w * k), h: Math.max(1, h * k) }
}

/** Vista final en miniatura (en tiempo real) del encuadre elegido. */
function LiveThumb({ item, crop, tw, th, settings }: { item: ImageItem; crop: Rect | null; tw: number; th: number; settings: Settings }) {
  const box = fitBox(tw, th, 220, 220)
  let inner: React.ReactNode
  if (crop) {
    const s = box.w / crop.w
    inner = (
      <img
        src={item.url}
        alt=""
        draggable={false}
        className="absolute max-w-none"
        style={{ left: -crop.x * s, top: -crop.y * s, width: item.width * s, height: item.height * s }}
      />
    )
  } else if (settings.fit === 'contain') {
    const k = Math.min(box.w / item.width, box.h / item.height)
    const bg = settings.background
    inner = (
      <>
        {bg.type === 'blur' && (
          <img src={item.url} alt="" className="absolute inset-0 size-full scale-110 object-cover blur-md brightness-90" />
        )}
        <img
          src={item.url}
          alt=""
          className="absolute"
          style={{ width: item.width * k, height: item.height * k, left: (box.w - item.width * k) / 2, top: (box.h - item.height * k) / 2 }}
        />
      </>
    )
  } else {
    inner = <img src={item.url} alt="" className="absolute inset-0 size-full" />
  }
  const bg = settings.fit === 'contain' && settings.background.type === 'color' ? settings.background.color : undefined
  const transparent = settings.fit === 'contain' && settings.background.type === 'transparent'
  return (
    <div className={`relative overflow-hidden rounded-md shadow-md ring-1 ring-black/10 ${transparent ? 'checker' : 'bg-white'}`} style={{ width: box.w, height: box.h, background: bg }}>
      {inner}
    </div>
  )
}

export default function FramePreview({
  item,
  settings,
  onCrop,
}: {
  item: ImageItem
  settings: Settings
  onCrop: (crop: ImageItem['crop']) => void
}) {
  const [areaRef, area] = useSize<HTMLDivElement>()
  const target = getTarget(item, settings)
  const framing = needsFraming(item, target)
  const cover = framing && settings.fit === 'cover'
  const focus = settings.smartCrop ? item.focus : null
  const crop = cover ? computeCrop(item.width, item.height, target.w, target.h, item.crop, focus) : null
  const zoom = item.crop?.zoom ?? 1
  const cut = cover && focusIsCut(crop!, focus)

  // Imagen completa ajustada al área disponible.
  const maxH = Math.max(220, Math.min(520, typeof window !== 'undefined' ? window.innerHeight * 0.55 : 520))
  const disp = area.w ? fitBox(item.width, item.height, area.w, maxH) : { w: 0, h: 0 }
  const k = disp.w / item.width

  const drag = useRef<{ x: number; y: number; crop: Rect } | null>(null)

  const setZoom = (z: number) => {
    if (!crop) return
    const nz = Math.min(5, Math.max(1, z))
    const cx = (crop.x + crop.w / 2) / item.width
    const cy = (crop.y + crop.h / 2) / item.height
    onCrop({ cx, cy, zoom: nz })
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!crop) return
    e.preventDefault()
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, crop }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || !crop) return
    const dx = (e.clientX - d.x) / k
    const dy = (e.clientY - d.y) / k
    const moved = { ...d.crop, x: d.crop.x + dx, y: d.crop.y + dy }
    // Normaliza y deja que computeCrop limite el movimiento a la imagen.
    const m = cropToManual(moved, item.width, item.height, zoom)
    const clamped = computeCrop(item.width, item.height, target.w, target.h, m, null)
    onCrop(cropToManual(clamped, item.width, item.height, zoom))
  }
  const endDrag = () => {
    drag.current = null
  }

  const nudge = (dx: number, dy: number) => {
    if (!crop) return
    const moved = { ...crop, x: crop.x + dx * crop.w, y: crop.y + dy * crop.h }
    const clamped = computeCrop(item.width, item.height, target.w, target.h, cropToManual(moved, item.width, item.height, zoom), null)
    onCrop(cropToManual(clamped, item.width, item.height, zoom))
  }

  const focusBox = cover ? focus?.box : undefined
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div ref={areaRef} className="relative flex min-w-0 flex-1 items-center justify-center rounded-xl bg-[#e9e6df] p-0" style={{ minHeight: 240 }}>
          {disp.w > 0 && (
            <div
              className="relative overflow-hidden select-none"
              style={{ width: disp.w, height: disp.h }}
              onWheel={(e) => {
                if (!cover) return
                e.preventDefault()
                setZoom(zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08))
              }}
            >
              <img src={item.url} alt={`Vista previa de ${item.name}`} draggable={false} className="absolute inset-0 size-full" />
              {focusBox && (
                <div
                  className="pointer-events-none absolute z-[5] rounded-sm border-2 border-dashed border-[#38e3b0]"
                  style={{ left: focusBox.x * k, top: focusBox.y * k, width: focusBox.w * k, height: focusBox.h * k }}
                >
                  <span className="absolute top-0 left-0 z-10 rounded-br bg-[#0e8f6c] px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap text-white">
                    {focus!.label}
                    {focus!.score ? ` · ${Math.round(focus!.score * 100)}%` : ''}
                  </span>
                </div>
              )}
              {crop && (
                <div
                  role="slider"
                  aria-label="Encuadre: arrastra para mover. Flechas del teclado para ajustar."
                  aria-valuenow={Math.round((crop.x / Math.max(1, item.width - crop.w)) * 100) || 0}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    const st = e.shiftKey ? 0.1 : 0.02
                    if (e.key === 'ArrowLeft') nudge(-st, 0)
                    else if (e.key === 'ArrowRight') nudge(st, 0)
                    else if (e.key === 'ArrowUp') nudge(0, -st)
                    else if (e.key === 'ArrowDown') nudge(0, st)
                    else return
                    e.preventDefault()
                  }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  className="absolute cursor-move touch-none border-2 border-white outline-none focus-visible:border-accent"
                  style={{
                    left: crop.x * k,
                    top: crop.y * k,
                    width: crop.w * k,
                    height: crop.h * k,
                    boxShadow: '0 0 0 9999px rgba(20,19,31,.58)',
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border-[0.5px] border-white/30" />
                    ))}
                  </div>
                  {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((p) => (
                    <span key={p} className={`absolute size-3 rounded-sm bg-white ${p}`} />
                  ))}
                </div>
              )}
            </div>
          )}
          {cover && (
            <div className="pointer-events-none absolute right-2 bottom-2 rounded-md bg-ink/80 px-2 py-1 text-[11px] text-white">
              Arrastra el marco para encuadrar
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2 lg:w-[240px]">
          <span className="text-xs font-semibold tracking-wide text-muted uppercase">Vista final</span>
          <LiveThumb item={item} crop={crop} tw={target.w} th={target.h} settings={settings} />
          <span className="text-xs text-muted">
            {target.w}×{target.h}px
            {framing && settings.fit === 'stretch' && <b className="ml-1 text-accent-dark">· estirada</b>}
          </span>
        </div>
      </div>

      {cover && (
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[200px] flex-1 items-center gap-3 text-sm">
            <span className="font-medium">Zoom</span>
            <input type="range" min={1} max={5} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} aria-label="Zoom del encuadre" />
            <span className="w-10 text-right text-xs text-muted tabular-nums">{zoom.toFixed(1)}×</span>
          </label>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onCrop(undefined)} disabled={!item.crop}>
            <IconRefresh size={15} /> {settings.smartCrop ? 'Volver al encuadre inteligente' : 'Centrar'}
          </button>
        </div>
      )}

      {settings.smartCrop && framing && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {item.detecting ? (
            <span className="pulse flex items-center gap-1.5 rounded-full bg-local-soft px-2.5 py-1 font-medium text-local">
              <IconTarget size={14} /> Analizando la imagen en tu navegador…
            </span>
          ) : item.focus ? (
            <span className="flex items-center gap-1.5 rounded-full bg-local-soft px-2.5 py-1 font-medium text-local">
              <IconTarget size={14} />
              {item.crop
                ? `${item.focus.source === 'saliency' ? 'Zona de interés localizada' : item.focus.label} · encuadre ajustado a mano`
                : item.focus.source === 'saliency'
                  ? 'Sin personas ni objetos reconocibles: encuadre por análisis de contenido visual'
                  : `${item.focus.label}: el encuadre se centra en el elemento principal`}
            </span>
          ) : item.detectError ? (
            <span className="rounded-full bg-[#fff3d6] px-2.5 py-1 text-[#8a5a00]">{item.detectError}</span>
          ) : null}
        </div>
      )}
      {cut && (
        <p className="flex items-start gap-2 rounded-lg bg-[#fff3d6] px-3 py-2 text-xs text-[#7a5200]">
          <IconAlert size={16} className="mt-px shrink-0" />
          El elemento principal no cabe completo en este formato. Puedes reducir el zoom, mover el marco o usar «Encajar» para no recortar nada.
        </p>
      )}
    </div>
  )
}
