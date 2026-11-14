import { useRef, useState } from 'react'

interface Side {
  url: string
  width: number
  height: number
  label: string
}

/**
 * Comparación original / resultado. Si ambas imágenes tienen la misma proporción, se usa un
 * deslizador superpuesto; si no, se muestran lado a lado.
 */
export default function CompareView({ before, after, transparent }: { before: Side; after: Side; transparent?: boolean }) {
  const sameRatio = Math.abs(before.width / before.height - after.width / after.height) < 0.01
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement>(null)

  if (!sameRatio) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[before, after].map((s) => (
          <figure key={s.label} className="flex flex-col gap-2">
            <div className={`flex items-center justify-center overflow-hidden rounded-xl bg-[#ece9e2] p-2 ${transparent ? 'checker' : ''}`} style={{ height: 'min(52vh, 420px)' }}>
              <img src={s.url} alt={s.label} className="max-h-full max-w-full object-contain shadow-sm" />
            </div>
            <figcaption className="text-center text-xs text-muted">
              <b className="text-ink">{s.label}</b> · {s.width}×{s.height}px
            </figcaption>
          </figure>
        ))}
      </div>
    )
  }

  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={box}
        className={`relative w-full touch-none overflow-hidden rounded-xl select-none ${transparent ? 'checker' : 'bg-[#ece9e2]'}`}
        style={{ aspectRatio: `${after.width} / ${after.height}`, maxHeight: '60vh', maxWidth: `calc(60vh * ${after.width / after.height})` }}
        onPointerDown={(e) => {
          ;(e.target as Element).setPointerCapture?.(e.pointerId)
          move(e.clientX)
        }}
        onPointerMove={(e) => e.buttons === 1 && move(e.clientX)}
      >
        <img src={after.url} alt={after.label} className="absolute inset-0 size-full object-contain" draggable={false} />
        <img
          src={before.url}
          alt={before.label}
          className="absolute inset-0 size-full object-contain"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,.2)]" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-xs font-bold text-ink shadow-md">⇆</div>
        </div>
        <span className="absolute top-2 left-2 rounded-md bg-ink/75 px-2 py-1 text-[11px] font-semibold text-white">{before.label}</span>
        <span className="absolute top-2 right-2 rounded-md bg-accent px-2 py-1 text-[11px] font-semibold text-white">{after.label}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Posición del comparador"
        className="max-w-xs"
      />
    </div>
  )
}
