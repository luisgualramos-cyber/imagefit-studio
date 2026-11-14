import { useEffect, useRef, useState } from 'react'
import Dropzone from '../components/Dropzone'
import CompareView from '../components/CompareView'
import { IconAlert, IconCloud, IconDownload, IconShield, IconSparkle } from '../components/Icons'
import { aiExpand, computePlacement, getAiStatus, localExpand, type AiStatus, type LocalFill } from '../lib/expand'
import { encodeCanvas } from '../lib/render'
import { downloadBlob, formatBytes, outputName, readImage, FORMAT_LABEL } from '../lib/processor'
import type { OutputFormat } from '../lib/types'

type Fill = LocalFill | 'ai'
const RATIOS = [
  { l: '16:9', r: 16 / 9 },
  { l: '1:1', r: 1 },
  { l: '4:5', r: 4 / 5 },
  { l: '9:16', r: 9 / 16 },
  { l: '3:2', r: 3 / 2 },
  { l: '3:1', r: 3 },
]
const ANCHORS = [0, 0.5, 1]

export default function ExpandTool() {
  const [file, setFile] = useState<File | null>(null)
  const [src, setSrc] = useState<{ url: string; w: number; h: number; bmp: ImageBitmap } | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [W, setW] = useState(0)
  const [H, setH] = useState(0)
  const [ax, setAx] = useState(0.5)
  const [ay, setAy] = useState(0.5)
  const [scale, setScale] = useState(1)
  const [fill, setFill] = useState<Fill>('blur')
  const [color, setColor] = useState('#ffffff')
  const [format, setFormat] = useState<OutputFormat>('image/jpeg')
  const [result, setResult] = useState<{ url: string; blob: Blob; w: number; h: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [ai, setAi] = useState<AiStatus | null>(null)
  const [prompt, setPrompt] = useState('')
  const [consent, setConsent] = useState(false)
  const resultRef = useRef(result)
  resultRef.current = result

  useEffect(() => {
    getAiStatus().then(setAi)
  }, [])

  const load = async (files: File[]) => {
    const f = files[0]
    if (!f) return
    setErr(null)
    try {
      const d = await readImage(f)
      const bmp = await createImageBitmap(d.file)
      if (src) {
        URL.revokeObjectURL(src.url)
        src.bmp.close()
      }
      setFile(f)
      setSrc({ url: URL.createObjectURL(d.file), w: d.width, h: d.height, bmp })
      // Por defecto: pasar a 16:9 (o a 1:1 si ya es muy horizontal) sin reducir el original.
      const r = d.width / d.height < 1.5 ? 16 / 9 : 1
      applyRatio(r, d.width, d.height)
      if (f.type === 'image/png' || f.type === 'image/webp') setFormat('image/webp')
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }

  const applyRatio = (r: number, sw = src?.w ?? 0, sh = src?.h ?? 0) => {
    if (!sw) return
    if (r > sw / sh) {
      setH(sh)
      setW(Math.round(sh * r))
    } else {
      setW(sw)
      setH(Math.round(sw / r))
    }
  }

  // Previsualización en vivo de los rellenos locales.
  useEffect(() => {
    if (!src || !W || !H || fill === 'ai') return
    let cancelled = false
    const t = setTimeout(async () => {
      try {
        const p = computePlacement(src.w, src.h, W, H, scale, ax, ay)
        const canvas = localExpand(src.bmp, p, fill, color)
        const { blob } = await encodeCanvas(canvas, format, 0.88)
        if (cancelled) return
        if (resultRef.current) URL.revokeObjectURL(resultRef.current.url)
        setResult({ url: URL.createObjectURL(blob), blob, w: W, h: H })
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : String(e))
      }
    }, 200)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [src, W, H, ax, ay, scale, fill, color, format])

  const runAi = async () => {
    if (!src) return
    setBusy(true)
    setErr(null)
    try {
      const p = computePlacement(src.w, src.h, W, H, scale, ax, ay)
      const canvas = await aiExpand(src.bmp, p, prompt)
      const { blob } = await encodeCanvas(canvas, format, 0.9)
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url)
      setResult({ url: URL.createObjectURL(blob), blob, w: W, h: H })
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  if (!src || !file) {
    return (
      <div className="rounded-[1.6rem] border border-line bg-white/70 p-3 shadow-[0_30px_60px_-40px_rgba(20,19,31,.45)] md:p-4">
        <Dropzone onFiles={load} multiple={false} title="Sube la imagen que quieres ampliar" />
        {err && <p className="mt-3 text-center text-sm text-accent-dark">{err}</p>}
      </div>
    )
  }

  const p = computePlacement(src.w, src.h, W || 1, H || 1, scale, ax, ay)
  const k = Math.min(1, 190 / Math.max(W, H, 1))
  const aiReady = ai?.enabled

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-[0_30px_60px_-40px_rgba(20,19,31,.45)]">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-4 p-4 md:p-5">
          {result ? (
            <CompareView before={{ url: src.url, width: src.w, height: src.h, label: 'Original' }} after={{ url: result.url, width: result.w, height: result.h, label: 'Ampliada' }} />
          ) : (
            <div className="grid min-h-[260px] place-items-center rounded-xl bg-[#ece9e2] p-6 text-center text-sm text-muted">
              {fill === 'ai' ? 'Configura la ampliación con IA y pulsa «Ampliar con IA».' : 'Generando vista previa…'}
            </div>
          )}
          {result && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-paper px-4 py-3 text-sm">
              <span>
                {result.w}×{result.h}px · {FORMAT_LABEL[format]} · {formatBytes(result.blob.size)}
              </span>
              <div className="flex gap-2">
                <button type="button" className="btn btn-dark btn-sm" onClick={() => downloadBlob(result.blob, outputName(file.name, format, '-ampliada'))}>
                  <IconDownload size={16} /> Descargar
                </button>
              </div>
            </div>
          )}
          {err && (
            <p className="flex items-start gap-2 rounded-lg bg-[#fdf0ec] px-3 py-2 text-sm text-accent-dark">
              <IconAlert size={17} className="mt-0.5 shrink-0" /> {err}
            </p>
          )}
          <div className="[&>div]:py-4">
            <Dropzone onFiles={load} multiple={false} compact compactLabel="Cambiar de imagen" />
          </div>
        </div>

        <div className="space-y-5 border-t border-line bg-[#fbfaf7] p-4 md:p-5 lg:border-t-0 lg:border-l">
          <div>
            <h3 className="text-[15px] font-bold">Formato final</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {RATIOS.map((r) => (
                <button key={r.l} type="button" onClick={() => applyRatio(r.r)} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${Math.abs(W / H - r.r) < 0.01 ? 'border-ink bg-ink text-white' : 'border-line bg-white'}`}>
                  {r.l}
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="text-xs text-muted">
                Ancho (px)
                <input className="field mt-1" type="number" min={64} max={8000} value={W} onChange={(e) => setW(Math.min(8000, Math.max(64, Number(e.target.value) || 64)))} />
              </label>
              <label className="text-xs text-muted">
                Alto (px)
                <input className="field mt-1" type="number" min={64} max={8000} value={H} onChange={(e) => setH(Math.min(8000, Math.max(64, Number(e.target.value) || 64)))} />
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-[15px] font-bold">Posición del original</h3>
            <div className="mt-2 flex items-start gap-4">
              <div className="grid grid-cols-3 gap-1" role="group" aria-label="Posición">
                {ANCHORS.map((y) =>
                  ANCHORS.map((x) => (
                    <button
                      key={`${x}-${y}`}
                      type="button"
                      aria-label={`Posición ${x},${y}`}
                      aria-pressed={ax === x && ay === y}
                      onClick={() => {
                        setAx(x)
                        setAy(y)
                      }}
                      className={`size-7 rounded-md border ${ax === x && ay === y ? 'border-accent bg-accent' : 'border-line bg-white hover:border-ink/40'}`}
                    />
                  )),
                )}
              </div>
              <div className="relative shrink-0 rounded bg-[#d9d5cc]" style={{ width: W * k, height: H * k }} aria-hidden>
                <div className="absolute bg-ink/80" style={{ left: p.x * k, top: p.y * k, width: p.w * k, height: p.h * k }} />
              </div>
            </div>
            <label className="mt-3 block text-sm">
              <span className="flex justify-between">
                Tamaño del original <span className="text-xs text-muted">{Math.round(scale * 100)}%</span>
              </span>
              <input type="range" min={0.4} max={1} step={0.01} value={scale} onChange={(e) => setScale(Number(e.target.value))} aria-label="Tamaño del original" />
            </label>
          </div>

          <div>
            <h3 className="text-[15px] font-bold">Relleno de la zona nueva</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-local">
              <IconShield size={14} /> En tu navegador, sin IA generativa
            </p>
            <div className="seg mt-2" role="group" aria-label="Relleno local">
              {(
                [
                  ['blur', 'Desenfocado'],
                  ['mirror', 'Espejo'],
                  ['color', 'Color'],
                ] as [LocalFill, string][]
              ).map(([v, l]) => (
                <button key={v} type="button" aria-pressed={fill === v} onClick={() => setFill(v)}>
                  {l}
                </button>
              ))}
            </div>
            {fill === 'color' && <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-2 h-9 w-20 cursor-pointer rounded border border-line" aria-label="Color de relleno" />}

            <div className={`mt-4 rounded-xl border p-3 ${fill === 'ai' ? 'border-cloud bg-cloud-soft' : 'border-line bg-white'}`}>
              <button type="button" disabled={!aiReady} onClick={() => {
                  setFill('ai')
                  if (resultRef.current) URL.revokeObjectURL(resultRef.current.url)
                  setResult(null)
                }} className="flex w-full items-start gap-2 text-left disabled:cursor-not-allowed">
                <IconSparkle size={18} className="mt-0.5 text-cloud" />
                <span>
                  <span className="block text-sm font-semibold">Ampliación generativa con IA</span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <IconCloud size={13} /> Servicio externo: Stability AI (de pago)
                  </span>
                </span>
              </button>
              {!aiReady && (
                <p className="mt-2 text-xs text-muted">
                  {ai === null
                    ? 'Comprobando disponibilidad…'
                    : 'No está activada en este servidor. El responsable de la web debe configurar una clave de Stability AI. Mientras tanto puedes usar los rellenos locales, que son gratuitos.'}
                </p>
              )}
              {aiReady && fill === 'ai' && (
                <div className="mt-3 space-y-2">
                  <input className="field" placeholder="Describe la escena (opcional, en inglés funciona mejor)" value={prompt} maxLength={500} onChange={(e) => setPrompt(e.target.value)} />
                  <label className="flex items-start gap-2 text-xs text-ink-2">
                    <input type="checkbox" className="mt-0.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                    Entiendo que se enviará una copia reducida de la imagen a Stability AI para generar el resultado. No se guarda.
                  </label>
                  <button type="button" className="btn w-full bg-cloud text-white hover:opacity-90" disabled={!consent || busy} onClick={runAi}>
                    {busy ? 'Generando con IA… (10-30 s)' : 'Ampliar con IA'}
                  </button>
                </div>
              )}
            </div>
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
          </div>
        </div>
      </div>
    </div>
  )
}
