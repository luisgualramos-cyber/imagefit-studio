import { useState, type ReactNode } from 'react'
import Dropzone from '../components/Dropzone'
import CompareView from '../components/CompareView'
import FramePreview from './FramePreview'
import SettingsPanel from './SettingsPanel'
import { useStudio } from './useStudio'
import { downloadBlob, formatBytes, makeZip, FORMAT_LABEL } from '../lib/processor'
import { getTarget } from '../lib/geometry'
import { findPreset, presetLabel } from '../lib/presets'
import type { ImageItem, Settings } from '../lib/types'
import { IconAlert, IconCheck, IconDownload, IconRefresh, IconShield, IconTrash, IconX } from '../components/Icons'

export interface StudioProps {
  initial?: Partial<Settings>
  presetFilter?: 'social' | 'web' | 'all'
  dropTitle?: string
  dropHint?: ReactNode
}

function pct(a: number, b: number) {
  if (!a) return 0
  return Math.round(((b - a) / a) * 100)
}

function Delta({ before, after }: { before: number; after: number }) {
  const d = pct(before, after)
  return <span className={`font-semibold ${d <= 0 ? 'text-local' : 'text-accent-dark'}`}>{d <= 0 ? `−${Math.abs(d)}%` : `+${d}%`}</span>
}

function Thumb({ it, active, onSelect, onRemove, onDownload }: { it: ImageItem; active: boolean; onSelect: () => void; onRemove: () => void; onDownload: () => void }) {
  return (
    <li
      className={`group relative flex w-[148px] shrink-0 flex-col overflow-hidden rounded-xl border bg-white transition-shadow ${active ? 'border-accent shadow-[0_0_0_2px_var(--color-accent)]' : 'border-line hover:border-ink/30'}`}
    >
      <button type="button" onClick={onSelect} className="relative block h-[96px] w-full overflow-hidden bg-[#ece9e2] text-left" aria-label={`Seleccionar ${it.name}`}>
        {it.status !== 'error' || it.width ? <img src={it.result?.url ?? it.url} alt="" className="size-full object-cover" loading="lazy" /> : null}
        {it.status === 'processing' && <span className="pulse absolute inset-0 bg-white/60" />}
        {it.status === 'done' && (
          <span className="absolute top-1.5 left-1.5 grid size-5 place-items-center rounded-full bg-local text-white">
            <IconCheck size={13} />
          </span>
        )}
        {it.status === 'error' && (
          <span className="absolute inset-0 grid place-items-center bg-[#fde8e3] text-accent-dark">
            <IconAlert size={22} />
          </span>
        )}
      </button>
      <div className="flex min-h-[46px] flex-col gap-0.5 px-2 py-1.5 text-[11px] leading-tight">
        <span className="truncate font-semibold text-ink" title={it.name}>
          {it.name}
        </span>
        {it.status === 'loading' && <span className="text-muted">Leyendo…</span>}
        {it.status === 'error' && <span className="line-clamp-2 text-accent-dark" title={it.error}>{it.error}</span>}
        {(it.status === 'ready' || it.status === 'processing') && (
          <span className="text-muted">
            {it.width}×{it.height} · {formatBytes(it.size)}
          </span>
        )}
        {it.status === 'done' && it.result && (
          <span className="text-muted">
            {formatBytes(it.result.size)} <Delta before={it.size} after={it.result.size} />
          </span>
        )}
      </div>
      <div className="absolute top-1.5 right-1.5 flex gap-1">
        {it.result && (
          <button type="button" onClick={onDownload} className="grid size-7 place-items-center rounded-full bg-ink text-white shadow" aria-label={`Descargar ${it.name}`} title="Descargar">
            <IconDownload size={15} />
          </button>
        )}
        <button type="button" onClick={onRemove} className="grid size-7 place-items-center rounded-full bg-white/95 text-ink shadow" aria-label={`Quitar ${it.name}`} title="Quitar">
          <IconX size={14} />
        </button>
      </div>
    </li>
  )
}

export default function Studio({ initial, presetFilter = 'all', dropTitle, dropHint }: StudioProps) {
  const st = useStudio(initial)
  const { items, selected, settings } = st
  const [view, setView] = useState<'edit' | 'result'>('edit')
  const [zipping, setZipping] = useState(false)

  const valid = items.filter((i) => i.width > 0)
  const done = items.filter((i) => i.result)
  const totalIn = done.reduce((a, i) => a + i.size, 0)
  const totalOut = done.reduce((a, i) => a + (i.result?.size ?? 0), 0)
  const anyLoading = items.some((i) => i.status === 'loading')

  const downloadOne = (it: ImageItem) => it.result && downloadBlob(it.result.blob, st.fileNameFor(it))
  const downloadZip = async () => {
    setZipping(true)
    try {
      const zip = await makeZip(done.map((it) => ({ name: st.fileNameFor(it), blob: it.result!.blob })))
      downloadBlob(zip, `imagefit-studio-${done.length}-imagenes.zip`)
    } catch (e) {
      st.notify('error', `No se pudo crear el ZIP: ${e instanceof Error ? e.message : e}`)
    } finally {
      setZipping(false)
    }
  }

  const summary = () => {
    if (!selected?.width) return null
    const t = getTarget(selected, settings)
    const p = settings.sizeMode === 'preset' ? findPreset(settings.presetId) : null
    const fmt = settings.format === 'original' ? 'formato original' : FORMAT_LABEL[settings.format]
    return (
      <>
        {p ? `${presetLabel(p)} · ` : ''}
        {t.w}×{t.h}px · {fmt}
        {` · calidad ${settings.quality}`}
        {settings.maxKB !== '' ? ` · máx. ${settings.maxKB} KB` : ''}
      </>
    )
  }

  const toasts = (
    st.notices.length > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
          {st.notices.map((n) => (
            <div
              key={n.id}
              role={n.kind === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto flex max-w-md items-start gap-2 rounded-xl px-4 py-3 text-sm shadow-lg ${n.kind === 'error' ? 'bg-[#2a1410] text-white' : 'bg-ink text-white'}`}
            >
              {n.kind === 'error' ? <IconAlert size={18} className="mt-px shrink-0 text-accent" /> : <IconCheck size={18} className="mt-px shrink-0 text-[#38e3b0]" />}
              <span className="flex-1">{n.text}</span>
              <button type="button" onClick={() => st.dismiss(n.id)} aria-label="Cerrar aviso" className="opacity-70 hover:opacity-100">
                <IconX size={16} />
              </button>
            </div>
          ))}
        </div>
      )
  )

  if (!items.length) {
    return (
      <div className="rounded-[1.6rem] border border-line bg-white/70 p-3 shadow-[0_30px_60px_-40px_rgba(20,19,31,.45)] md:p-4">
        <Dropzone onFiles={st.addFiles} title={dropTitle} hint={dropHint} />
        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted">
          <IconShield size={15} className="text-local" /> Tus fotos se procesan en tu navegador: no se suben a ningún servidor.
        </p>
        {toasts}
      </div>
    )
  }

  const showResult = view === 'result' && selected?.result
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-[0_30px_60px_-40px_rgba(20,19,31,.45)]">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Columna principal */}
        <div className="flex min-w-0 flex-col gap-4 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="seg w-auto" role="tablist" aria-label="Vista">
              <button type="button" aria-pressed={view === 'edit'} onClick={() => setView('edit')} className="px-4">
                Encuadre
              </button>
              <button type="button" aria-pressed={view === 'result'} onClick={() => setView('result')} disabled={!selected?.result} className="px-4 disabled:opacity-40">
                Resultado
              </button>
            </div>
            <span className="text-xs text-muted">
              {items.length} {items.length === 1 ? 'imagen' : 'imágenes'}
            </span>
          </div>

          {selected && selected.status === 'error' && !selected.width ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-xl bg-[#fdf0ec] p-6 text-center">
              <IconAlert className="text-accent-dark" size={28} />
              <p className="font-semibold">No se puede usar «{selected.name}»</p>
              <p className="max-w-md text-sm text-muted">{selected.error}</p>
            </div>
          ) : selected && selected.width ? (
            showResult ? (
              <div className="flex flex-col gap-3">
                <CompareView
                  before={{ url: selected.url, width: selected.width, height: selected.height, label: 'Original' }}
                  after={{ url: selected.result!.url, width: selected.result!.width, height: selected.result!.height, label: 'Resultado' }}
                  transparent={selected.result!.format !== 'image/jpeg'}
                />
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-paper px-4 py-3 text-sm">
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    <span>
                      <span className="text-muted">Original:</span> {selected.width}×{selected.height} · {formatBytes(selected.size)}
                    </span>
                    <span>
                      <span className="text-muted">Resultado:</span> {selected.result!.width}×{selected.result!.height} · {FORMAT_LABEL[selected.result!.format]} ·{' '}
                      {formatBytes(selected.result!.size)} <Delta before={selected.size} after={selected.result!.size} />
                    </span>
                  </div>
                  <button type="button" className="btn btn-dark btn-sm" onClick={() => downloadOne(selected)}>
                    <IconDownload size={16} /> Descargar
                  </button>
                </div>
                {selected.result!.warning && (
                  <p className="flex items-start gap-2 rounded-lg bg-[#fff3d6] px-3 py-2 text-xs text-[#7a5200]">
                    <IconAlert size={16} className="mt-px shrink-0" /> {selected.result!.warning}
                  </p>
                )}
                {selected.result!.size > selected.size && (
                  <p className="text-xs text-muted">
                    {/\.(heic|heif)$/i.test(selected.name)
                      ? 'Es normal que el JPG pese algo más que el HEIC: HEIC es un formato más eficiente. Si necesitas menos peso, baja la calidad o reduce las dimensiones.'
                      : 'El resultado pesa más que el original: suele pasar si la foto ya estaba muy optimizada, si se amplía o si conviertes a PNG. Prueba a bajar la calidad o usar WEBP.'}
                  </p>
                )}
              </div>
            ) : (
              <FramePreview item={selected} settings={settings} onCrop={(c) => st.setCrop(selected.id, c)} />
            )
          ) : (
            <div className="grid min-h-[240px] place-items-center rounded-xl bg-[#ece9e2] text-sm text-muted">Cargando imagen…</div>
          )}

          <div>
            <ul className="flex gap-2.5 overflow-x-auto pb-2" aria-label="Imágenes cargadas">
              {items.map((it) => (
                <Thumb
                  key={it.id}
                  it={it}
                  active={it.id === st.selectedId}
                  onSelect={() => st.setSelectedId(it.id)}
                  onRemove={() => st.remove(it.id)}
                  onDownload={() => downloadOne(it)}
                />
              ))}
              <li className="w-[148px] shrink-0">
                <div className="h-full [&>div]:h-full">
                  <Dropzone onFiles={st.addFiles} compact />
                </div>
              </li>
            </ul>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-muted">Los ajustes se aplican a todas las imágenes. El encuadre manual es individual.</p>
              <button type="button" className="flex items-center gap-1 text-xs font-medium text-muted hover:text-accent-dark" onClick={st.clearAll}>
                <IconTrash size={14} /> Vaciar
              </button>
            </div>
          </div>
        </div>

        {/* Ajustes */}
        <div className="flex flex-col border-t border-line bg-[#fbfaf7] lg:border-t-0 lg:border-l">
          <div className="flex-1">
            <SettingsPanel settings={settings} set={st.setSettings} selected={selected} groupFilter={presetFilter} />
          </div>
          <div className="sticky bottom-0 flex flex-col gap-3 border-t border-line bg-white p-4 md:p-5">
            <p className="text-xs text-muted">
              <b className="text-ink">Salida:</b> {summary()}
            </p>
            {st.processing ? (
              <div aria-live="polite">
                <div className="mb-1.5 flex justify-between text-xs font-medium">
                  <span>Procesando…</span>
                  <span className="tabular-nums">
                    {st.progress.done}/{st.progress.total}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#ece9e2]">
                  <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${(st.progress.done / Math.max(1, st.progress.total)) * 100}%` }} />
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-full py-3.5 text-base"
                disabled={!valid.length || anyLoading}
                onClick={async () => {
                  await st.processAll()
                  setView('result')
                }}
              >
                {done.length ? <IconRefresh size={18} /> : null}
                {done.length ? 'Volver a procesar' : valid.length > 1 ? `Procesar ${valid.length} imágenes` : 'Procesar imagen'}
              </button>
            )}
            {done.length > 0 && !st.processing && (
              <div className="flex flex-col gap-2 rounded-xl bg-local-soft p-3" aria-live="polite">
                <p className="text-xs text-[#0b5e47]">
                  <b>{done.length} lista{done.length > 1 ? 's' : ''}</b> · {formatBytes(totalIn)} → {formatBytes(totalOut)} (<Delta before={totalIn} after={totalOut} />)
                </p>
                {done.length > 1 ? (
                  <button type="button" className="btn btn-dark w-full" onClick={downloadZip} disabled={zipping}>
                    <IconDownload size={17} /> {zipping ? 'Creando ZIP…' : `Descargar todo (ZIP, ${done.length})`}
                  </button>
                ) : (
                  <button type="button" className="btn btn-dark w-full" onClick={() => downloadOne(done[0])}>
                    <IconDownload size={17} /> Descargar imagen
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {toasts}
    </div>
  )
}
