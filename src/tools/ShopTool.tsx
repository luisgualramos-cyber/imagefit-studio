import { useCallback, useEffect, useRef, useState } from 'react'
import Dropzone from '../components/Dropzone'
import CompareView from '../components/CompareView'
import { IconAlert, IconCheck, IconDownload, IconShield, IconSparkle, IconX } from '../components/Icons'
import { composeProduct, removeBackground } from '../lib/product'
import { downloadBlob, formatBytes, makeZip, newId, outputName, readImage, FORMAT_LABEL } from '../lib/processor'
import { PRESET_GROUPS } from '../lib/presets'
import type { OutputFormat } from '../lib/types'

interface ShopItem {
  id: string
  file: File
  name: string
  url: string
  width: number
  height: number
  status: 'loading' | 'ready' | 'working' | 'done' | 'error'
  error?: string
  cutout?: Blob
  result?: { blob: Blob; url: string; width: number; height: number; warning?: string; format: OutputFormat }
}

const SHOP_PRESETS = PRESET_GROUPS.find((g) => g.id === 'shop')!.presets
const COLORS = ['#ffffff', '#f5f5f5', '#f3efe8', '#e9f0f7', '#111111']

export default function ShopTool() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [selId, setSelId] = useState<string | null>(null)
  const [size, setSize] = useState({ w: 2048, h: 2048, preset: SHOP_PRESETS[0].id as string | 'custom' })
  const [bg, setBg] = useState<string>('#ffffff')
  const [removeBg, setRemoveBg] = useState(false)
  const [autoCenter, setAutoCenter] = useState(true)
  const [margin, setMargin] = useState(8)
  const [shadow, setShadow] = useState(false)
  const [format, setFormat] = useState<OutputFormat>('image/jpeg')
  const [quality, setQuality] = useState(85)
  const [maxKB, setMaxKB] = useState<number | ''>('')
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState<{ text: string; frac: number; idx: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [zipping, setZipping] = useState(false)
  const itemsRef = useRef(items)
  itemsRef.current = items

  const patch = (id: string, p: Partial<ShopItem>) => setItems((l) => l.map((i) => (i.id === id ? { ...i, ...p } : i)))

  const addFiles = (files: File[]) => {
    setError(null)
    const imgs = files.filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name)).slice(0, 50 - itemsRef.current.length)
    if (!imgs.length) {
      setError('Selecciona archivos de imagen (JPG, PNG, WEBP…).')
      return
    }
    const fresh: ShopItem[] = imgs.map((file) => ({ id: newId(), file, name: file.name, url: URL.createObjectURL(file), width: 0, height: 0, status: 'loading' }))
    setItems((l) => [...l, ...fresh])
    setSelId((c) => c ?? fresh[0].id)
    fresh.forEach((it) =>
      readImage(it.file)
        .then((d) =>
          setItems((l) =>
            l.map((x) => {
              if (x.id !== it.id) return x
              if (d.file === x.file) return { ...x, width: d.width, height: d.height, status: 'ready' }
              URL.revokeObjectURL(x.url)
              return { ...x, width: d.width, height: d.height, file: d.file, url: URL.createObjectURL(d.file), status: 'ready' }
            }),
          ),
        )
        .catch((e: Error) => patch(it.id, { status: 'error', error: e.message })),
    )
  }

  const remove = (id: string) => {
    setItems((l) => {
      const it = l.find((x) => x.id === id)
      if (it) {
        URL.revokeObjectURL(it.url)
        if (it.result) URL.revokeObjectURL(it.result.url)
      }
      const next = l.filter((x) => x.id !== id)
      setSelId((c) => (c === id ? (next[0]?.id ?? null) : c))
      return next
    })
  }

  const opts = useCallback(
    (useAlpha: boolean) => ({
      width: size.w,
      height: size.h,
      background: bg,
      marginPct: margin,
      autoCenter,
      useAlpha,
      shadow,
      format,
      quality: quality / 100,
      maxBytes: typeof maxKB === 'number' && maxKB > 0 ? maxKB * 1024 : undefined,
    }),
    [size, bg, margin, autoCenter, shadow, format, quality, maxKB],
  )

  const composeOne = useCallback(
    async (it: ShopItem, cutout?: Blob) => {
      const src = removeBg ? cutout : it.file
      if (!src) return
      const r = await composeProduct(src, opts(removeBg))
      const url = URL.createObjectURL(r.blob)
      setItems((l) =>
        l.map((x) => {
          if (x.id !== it.id) return x
          if (x.result) URL.revokeObjectURL(x.result.url)
          return { ...x, status: 'done', error: undefined, result: { blob: r.blob, url, width: r.width, height: r.height, warning: r.warning, format } }
        }),
      )
    },
    [removeBg, opts, format],
  )

  const processAll = async () => {
    setBusy(true)
    setError(null)
    const list = itemsRef.current.filter((i) => i.width > 0)
    let i = 0
    for (const it of list) {
      i++
      patch(it.id, { status: 'working' })
      try {
        let cutout = itemsRef.current.find((x) => x.id === it.id)?.cutout
        if (removeBg && !cutout) {
          setStage({ text: 'Preparando IA…', frac: 0, idx: i, total: list.length })
          cutout = await removeBackground(it.file, (text, frac) => setStage({ text, frac, idx: i, total: list.length }))
          patch(it.id, { cutout })
        }
        setStage({ text: 'Componiendo y comprimiendo', frac: 1, idx: i, total: list.length })
        await composeOne(it, cutout)
      } catch (e) {
        console.error(e)
        const msg = e instanceof Error ? e.message : String(e)
        patch(it.id, {
          status: 'error',
          error: /fetch|network|Failed to load/i.test(msg) ? 'No se pudo descargar el modelo de IA. Comprueba tu conexión e inténtalo de nuevo.' : msg,
        })
      }
    }
    setStage(null)
    setBusy(false)
  }

  // Actualización automática del resultado al cambiar ajustes (sin repetir la IA: se reutiliza el recorte).
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    if (busy) return
    const ready = itemsRef.current.filter((i) => i.result && (!removeBg || i.cutout))
    if (!ready.length) return
    const t = setTimeout(() => {
      ready.forEach((it) => composeOne(it, it.cutout).catch((e) => patch(it.id, { status: 'error', error: String(e?.message ?? e) })))
    }, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composeOne])

  const sel = items.find((i) => i.id === selId) ?? null
  const done = items.filter((i) => i.result)
  const needsAi = removeBg && items.some((i) => i.width && !i.cutout)

  const downloadAll = async () => {
    setZipping(true)
    try {
      const zip = await makeZip(done.map((it) => ({ name: outputName(it.name, it.result!.format, '-producto'), blob: it.result!.blob })))
      downloadBlob(zip, `productos-${done.length}.zip`)
    } finally {
      setZipping(false)
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-[1.6rem] border border-line bg-white/70 p-3 shadow-[0_30px_60px_-40px_rgba(20,19,31,.45)] md:p-4">
        <Dropzone onFiles={addFiles} title="Sube las fotos de tus productos" />
        {error && <p className="mt-3 text-center text-sm text-accent-dark">{error}</p>}
        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted">
          <IconShield size={15} className="text-local" /> Procesado en tu navegador, incluida la eliminación de fondo con IA.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-[0_30px_60px_-40px_rgba(20,19,31,.45)]">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-4 p-4 md:p-5">
          {sel && sel.width > 0 ? (
            sel.result ? (
              <>
                <CompareView
                  before={{ url: sel.url, width: sel.width, height: sel.height, label: 'Original' }}
                  after={{ url: sel.result.url, width: sel.result.width, height: sel.result.height, label: 'Producto' }}
                  transparent={bg === 'transparent'}
                />
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-paper px-4 py-3 text-sm">
                  <span>
                    {sel.result.width}×{sel.result.height} · {FORMAT_LABEL[sel.result.format]} · {formatBytes(sel.result.blob.size)}
                    <span className="text-muted"> (original {formatBytes(sel.file.size)})</span>
                  </span>
                  <button type="button" className="btn btn-dark btn-sm" onClick={() => downloadBlob(sel.result!.blob, outputName(sel.name, sel.result!.format, '-producto'))}>
                    <IconDownload size={16} /> Descargar
                  </button>
                </div>
                {sel.result.warning && <p className="rounded-lg bg-[#fff3d6] px-3 py-2 text-xs text-[#7a5200]">{sel.result.warning}</p>}
              </>
            ) : (
              <div className="flex items-center justify-center rounded-xl bg-[#ece9e2] p-3" style={{ minHeight: 300 }}>
                <img src={sel.url} alt={sel.name} className="max-h-[52vh] max-w-full object-contain" />
              </div>
            )
          ) : sel?.status === 'error' ? (
            <div className="grid min-h-[240px] place-items-center rounded-xl bg-[#fdf0ec] p-6 text-center text-sm">{sel.error}</div>
          ) : (
            <div className="grid min-h-[240px] place-items-center rounded-xl bg-[#ece9e2] text-sm text-muted">Cargando…</div>
          )}

          <ul className="flex gap-2.5 overflow-x-auto pb-2">
            {items.map((it) => (
              <li key={it.id} className={`relative w-[120px] shrink-0 overflow-hidden rounded-xl border bg-white ${it.id === selId ? 'border-accent shadow-[0_0_0_2px_var(--color-accent)]' : 'border-line'}`}>
                <button type="button" onClick={() => setSelId(it.id)} className="block h-[90px] w-full bg-[#ece9e2]" aria-label={`Seleccionar ${it.name}`}>
                  {it.width > 0 && <img src={it.result?.url ?? it.url} alt="" className="size-full object-contain" />}
                  {it.status === 'working' && <span className="pulse absolute inset-0 bg-white/60" />}
                </button>
                <div className="flex items-center gap-1 px-2 py-1.5 text-[11px]">
                  {it.status === 'done' && <IconCheck size={13} className="text-local" />}
                  {it.status === 'error' && <IconAlert size={13} className="text-accent-dark" />}
                  <span className="truncate" title={it.error ?? it.name}>
                    {it.status === 'error' ? it.error : it.name}
                  </span>
                </div>
                <button type="button" onClick={() => remove(it.id)} className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-white/95 shadow" aria-label={`Quitar ${it.name}`}>
                  <IconX size={13} />
                </button>
              </li>
            ))}
            <li className="w-[120px] shrink-0 [&>div]:h-full">
              <Dropzone onFiles={addFiles} compact />
            </li>
          </ul>
        </div>

        <div className="flex flex-col border-t border-line bg-[#fbfaf7] lg:border-t-0 lg:border-l">
          <div className="flex-1 space-y-5 p-4 md:p-5">
            <div>
              <h3 className="text-[15px] font-bold">Fondo</h3>
              <label className="mt-2 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-3">
                <input type="checkbox" className="mt-0.5 size-4 accent-[#0e8f6c]" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} />
                <span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    <IconSparkle size={15} className="text-local" /> Eliminar fondo con IA
                  </span>
                  <span className="block text-xs text-muted">
                    Modelo IS-Net ejecutado en tu navegador. La primera vez descarga unos 95 MB (queda en caché). Tarda entre 5 y 30 s por foto según el equipo.
                  </span>
                </span>
              </label>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setBg(c)} aria-label={`Fondo ${c}`} title={c} className={`size-8 rounded-full border border-black/15 ${bg === c ? 'ring-2 ring-accent ring-offset-2' : ''}`} style={{ background: c }} />
                ))}
                <label className="relative size-8 cursor-pointer overflow-hidden rounded-full border border-black/15 bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]" title="Otro color">
                  <input type="color" className="absolute inset-0 opacity-0" value={bg.startsWith('#') ? bg : '#ffffff'} onChange={(e) => setBg(e.target.value)} aria-label="Elegir color de fondo" />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setBg('transparent')
                    if (format === 'image/jpeg') setFormat('image/png')
                  }}
                  className={`checker h-8 rounded-full border border-black/15 px-3 text-xs font-semibold ${bg === 'transparent' ? 'ring-2 ring-accent ring-offset-2' : ''}`}
                >
                  Transparente
                </button>
              </div>
              {!removeBg && bg !== '#ffffff' && <p className="mt-2 text-xs text-muted">Sin eliminar el fondo, el color solo se ve en los márgenes. Activa la IA para sustituir el fondo de la foto.</p>}
            </div>

            <div>
              <h3 className="text-[15px] font-bold">Tamaño del lienzo</h3>
              <select
                className="field mt-2"
                value={size.preset}
                onChange={(e) => {
                  const p = SHOP_PRESETS.find((x) => x.id === e.target.value)
                  setSize(p ? { w: p.width, h: p.height, preset: p.id } : { ...size, preset: 'custom' })
                }}
                aria-label="Tamaño del lienzo"
              >
                {SHOP_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.width}×{p.height}
                  </option>
                ))}
                <option value="custom">Personalizado</option>
              </select>
              {size.preset === 'custom' && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input className="field" type="number" min={100} max={6000} value={size.w} onChange={(e) => setSize({ ...size, w: Math.min(6000, Math.max(100, Number(e.target.value) || 100)) })} aria-label="Ancho" />
                  <input className="field" type="number" min={100} max={6000} value={size.h} onChange={(e) => setSize({ ...size, h: Math.min(6000, Math.max(100, Number(e.target.value) || 100)) })} aria-label="Alto" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold">Margen alrededor</h3>
                <span className="text-xs text-muted tabular-nums">{margin}%</span>
              </div>
              <input type="range" min={0} max={30} value={margin} onChange={(e) => setMargin(Number(e.target.value))} aria-label="Margen" className="mt-2" />
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input type="checkbox" className="size-4 accent-[#ff5a2c]" checked={autoCenter} onChange={(e) => setAutoCenter(e.target.checked)} />
                Detectar y centrar el producto
              </label>
              <label className={`mt-1.5 flex items-center gap-2 text-sm ${removeBg ? '' : 'opacity-45'}`}>
                <input type="checkbox" className="size-4 accent-[#ff5a2c]" checked={shadow} disabled={!removeBg} onChange={(e) => setShadow(e.target.checked)} />
                Sombra suave bajo el producto
              </label>
            </div>

            <div>
              <h3 className="text-[15px] font-bold">Exportar</h3>
              <div className="seg mt-2" role="group" aria-label="Formato">
                {(['image/jpeg', 'image/webp', 'image/png'] as OutputFormat[]).map((f) => (
                  <button key={f} type="button" aria-pressed={format === f} onClick={() => setFormat(f)}>
                    {FORMAT_LABEL[f]}
                  </button>
                ))}
              </div>
              <div className={`mt-3 ${format === 'image/png' ? 'opacity-45' : ''}`}>
                <div className="flex justify-between text-sm">
                  <span>Calidad</span>
                  <span className="text-xs text-muted">{quality}</span>
                </div>
                <input type="range" min={40} max={100} value={quality} disabled={format === 'image/png'} onChange={(e) => setQuality(Number(e.target.value))} aria-label="Calidad" />
              </div>
              <label className="mt-2 block text-xs font-medium text-muted">
                Peso máximo (KB)
                <input className="field mt-1" type="number" min={10} placeholder="sin límite" value={maxKB} onChange={(e) => setMaxKB(e.target.value ? Math.max(10, Number(e.target.value)) : '')} />
              </label>
            </div>
          </div>

          <div className="sticky bottom-0 space-y-3 border-t border-line bg-white p-4 md:p-5">
            {error && <p className="text-sm text-accent-dark">{error}</p>}
            {busy && stage ? (
              <div aria-live="polite">
                <div className="mb-1 flex justify-between text-xs font-medium">
                  <span>
                    {stage.text} ({stage.idx}/{stage.total})
                  </span>
                  <span>{Math.round(stage.frac * 100)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#ece9e2]">
                  <div className="h-full rounded-full bg-local transition-[width]" style={{ width: `${Math.max(4, stage.frac * 100)}%` }} />
                </div>
              </div>
            ) : (
              <button type="button" className="btn btn-primary w-full py-3.5 text-base" disabled={!items.some((i) => i.width) || busy} onClick={processAll}>
                {needsAi ? 'Quitar fondo y preparar fotos' : done.length ? 'Volver a procesar' : 'Preparar fotos'}
              </button>
            )}
            {done.length > 0 && !busy && (
              <button type="button" className="btn btn-dark w-full" onClick={done.length > 1 ? downloadAll : () => downloadBlob(done[0].result!.blob, outputName(done[0].name, done[0].result!.format, '-producto'))} disabled={zipping}>
                <IconDownload size={17} /> {done.length > 1 ? (zipping ? 'Creando ZIP…' : `Descargar todo (ZIP, ${done.length})`) : 'Descargar imagen'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
