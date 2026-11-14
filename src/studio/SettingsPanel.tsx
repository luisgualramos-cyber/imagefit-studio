import { useState, type ReactNode } from 'react'
import { PRESET_GROUPS, findPreset } from '../lib/presets'
import type { ImageItem, Settings, SizeMode } from '../lib/types'
import { IconLock } from '../components/Icons'

export type PanelKey = 'size' | 'fit' | 'output'

function Section({ title, step, children, aside }: { title: string; step: number; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="border-b border-line px-4 py-4 last:border-b-0 md:px-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-[15px] font-bold">
          <span className="grid size-5 place-items-center rounded-full bg-ink text-[11px] text-white">{step}</span>
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </section>
  )
}

function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.v} type="button" aria-pressed={value === o.v} onClick={() => onChange(o.v)}>
          {o.l}
        </button>
      ))}
    </div>
  )
}

const numOrEmpty = (v: string): number | '' => {
  if (v.trim() === '') return ''
  const n = Math.round(Number(v))
  return Number.isFinite(n) && n > 0 ? Math.min(n, 16384) : ''
}

const SWATCHES = ['#ffffff', '#000000', '#f3f1ec', '#ff5a2c', '#1d4ed8', '#0e8f6c']

function AspectIcon({ w, h }: { w: number; h: number }) {
  const k = 18 / Math.max(w, h)
  return (
    <span className="grid size-6 shrink-0 place-items-center">
      <span className="block rounded-[3px] border-[1.5px] border-current" style={{ width: Math.max(5, w * k), height: Math.max(5, h * k) }} />
    </span>
  )
}

export default function SettingsPanel({
  settings,
  set,
  selected,
  groupFilter,
}: {
  settings: Settings
  set: (p: Partial<Settings>) => void
  selected: ImageItem | null
  groupFilter?: 'social' | 'web' | 'all'
}) {
  const groups = PRESET_GROUPS.filter((g) => !groupFilter || groupFilter === 'all' || (groupFilter === 'social' ? g.kind === 'social' : g.kind !== 'social'))
  const current = findPreset(settings.presetId)
  const [groupId, setGroupId] = useState(current?.group ?? groups[0].id)
  const group = groups.find((g) => g.id === groupId) ?? groups[0]

  const ratio = selected && selected.width ? selected.width / selected.height : null
  const exactish = settings.sizeMode === 'preset' || (settings.sizeMode === 'custom' && !settings.lockRatio && settings.width !== '' && settings.height !== '')
  const lossy = true
  const fmtOptions: { v: Settings['format']; l: string }[] = [
    { v: 'original', l: 'Igual' },
    { v: 'image/jpeg', l: 'JPG' },
    { v: 'image/png', l: 'PNG' },
    { v: 'image/webp', l: 'WEBP' },
    { v: 'image/avif', l: 'AVIF' },
  ]

  const setW = (v: string) => {
    const w = numOrEmpty(v)
    if (settings.lockRatio && ratio && w !== '') set({ width: w, height: Math.max(1, Math.round(w / ratio)) })
    else set({ width: w })
  }
  const setH = (v: string) => {
    const h = numOrEmpty(v)
    if (settings.lockRatio && ratio && h !== '') set({ height: h, width: Math.max(1, Math.round(h * ratio)) })
    else set({ height: h })
  }

  return (
    <div>
      <Section title="Tamaño" step={1}>
        <Seg<SizeMode>
          label="Modo de tamaño"
          value={settings.sizeMode}
          onChange={(v) => {
            if (v === 'custom' && settings.width === '' && selected?.width) set({ sizeMode: v, width: selected.width, height: selected.height })
            else if (v === 'preset' && !settings.presetId) set({ sizeMode: v, presetId: group.presets[0].id })
            else set({ sizeMode: v })
          }}
          options={[
            { v: 'original', l: 'Original' },
            { v: 'percent', l: 'Escala %' },
            { v: 'custom', l: 'Píxeles' },
            { v: 'preset', l: 'Formatos' },
          ]}
        />

        {settings.sizeMode === 'original' && <p className="mt-3 text-xs text-muted">Se mantienen las dimensiones originales de cada imagen.</p>}

        {settings.sizeMode === 'percent' && (
          <div className="mt-4 flex items-center gap-3">
            <input type="range" min={5} max={200} value={settings.percent} onChange={(e) => set({ percent: Number(e.target.value) })} aria-label="Porcentaje de escala" />
            <div className="flex w-24 items-center gap-1">
              <input
                className="field py-1.5 text-right"
                type="number"
                min={1}
                max={400}
                value={settings.percent}
                onChange={(e) => set({ percent: Math.min(400, Math.max(1, Number(e.target.value) || 1)) })}
                aria-label="Porcentaje"
              />
              <span className="text-sm text-muted">%</span>
            </div>
          </div>
        )}

        {settings.sizeMode === 'custom' && (
          <div className="mt-4">
            <div className="flex items-end gap-2">
              <label className="flex-1 text-xs font-medium text-muted">
                Ancho (px)
                <input className="field mt-1" inputMode="numeric" type="number" min={1} value={settings.width} onChange={(e) => setW(e.target.value)} placeholder="auto" />
              </label>
              <button
                type="button"
                onClick={() => set({ lockRatio: !settings.lockRatio })}
                aria-pressed={settings.lockRatio}
                title={settings.lockRatio ? 'Proporción bloqueada' : 'Proporción libre'}
                className={`mb-0.5 grid size-10 shrink-0 place-items-center rounded-lg border ${settings.lockRatio ? 'border-ink bg-ink text-white' : 'border-line bg-white text-muted'}`}
              >
                <IconLock open={!settings.lockRatio} size={18} />
                <span className="sr-only">{settings.lockRatio ? 'Desbloquear proporción' : 'Bloquear proporción'}</span>
              </button>
              <label className="flex-1 text-xs font-medium text-muted">
                Alto (px)
                <input className="field mt-1" inputMode="numeric" type="number" min={1} value={settings.height} onChange={(e) => setH(e.target.value)} placeholder="auto" />
              </label>
            </div>
            <p className="mt-2 text-xs text-muted">
              {settings.lockRatio
                ? 'Proporción bloqueada: ninguna imagen se deforma. En lotes, cada foto conserva su proporción y cabe dentro de estas medidas.'
                : 'Proporción libre: la imagen se recortará o encajará según el paso 2 para obtener exactamente estas medidas.'}
            </p>
          </div>
        )}

        {settings.sizeMode === 'preset' && (
          <div className="mt-4">
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2" role="tablist" aria-label="Plataforma">
              {groups.map((g) => (
                <button
                  key={g.id}
                  role="tab"
                  aria-selected={g.id === group.id}
                  type="button"
                  onClick={() => setGroupId(g.id)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${g.id === group.id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/40'}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <ul className="mt-1 flex flex-col gap-1.5">
              {group.presets.map((p) => {
                const on = p.id === settings.presetId
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => set({ presetId: p.id, sizeMode: 'preset' })}
                      aria-pressed={on}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${on ? 'border-accent bg-accent-soft text-ink' : 'border-line bg-white hover:border-ink/30'}`}
                    >
                      <AspectIcon w={p.width} h={p.height} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{p.name}</span>
                        <span className="block truncate text-xs text-muted">
                          {p.width}×{p.height}px{p.note ? ` · ${p.note}` : ''}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </Section>

      <Section title="Encuadre" step={2}>
        {!exactish ? (
          <p className="text-xs text-muted">
            Con este tamaño la imagen se escala completa, sin recortes ni deformaciones. Elige un formato o desbloquea la proporción para cambiar el encuadre.
          </p>
        ) : (
          <>
            <Seg<Settings['fit']>
              label="Ajuste"
              value={settings.fit}
              onChange={(v) => set({ fit: v })}
              options={[
                { v: 'cover', l: 'Recortar' },
                { v: 'contain', l: 'Encajar' },
                { v: 'stretch', l: 'Estirar' },
              ]}
            />
            <p className="mt-2 text-xs text-muted">
              {settings.fit === 'cover' && 'Rellena todo el formato recortando lo que sobra. Puedes mover el marco y hacer zoom.'}
              {settings.fit === 'contain' && 'La imagen completa cabe en el formato y el espacio sobrante se rellena.'}
              {settings.fit === 'stretch' && 'Atención: estira la imagen hasta las medidas exactas y puede deformarla.'}
            </p>
            {settings.fit === 'cover' && (
              <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-3">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 accent-[#0e8f6c]"
                  checked={settings.smartCrop}
                  onChange={(e) => set({ smartCrop: e.target.checked })}
                />
                <span>
                  <span className="block text-sm font-semibold">Encuadre inteligente</span>
                  <span className="block text-xs text-muted">
                    Detecta rostros, personas y objetos con IA en tu navegador (MediaPipe) y los mantiene dentro del recorte.
                  </span>
                </span>
              </label>
            )}
            {settings.fit === 'contain' && (
              <div className="mt-3">
                <span className="text-xs font-medium text-muted">Relleno</span>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => set({ background: { type: 'blur' } })}
                    aria-pressed={settings.background.type === 'blur'}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${settings.background.type === 'blur' ? 'border-ink bg-ink text-white' : 'border-line bg-white'}`}
                  >
                    Desenfocado
                  </button>
                  <button
                    type="button"
                    onClick={() => set({ background: { type: 'transparent' } })}
                    aria-pressed={settings.background.type === 'transparent'}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${settings.background.type === 'transparent' ? 'border-ink bg-ink text-white' : 'border-line bg-white'}`}
                  >
                    Transparente
                  </button>
                  {SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      aria-label={`Color ${c}`}
                      onClick={() => set({ background: { type: 'color', color: c } })}
                      className={`size-7 rounded-full border ${settings.background.type === 'color' && settings.background.color === c ? 'ring-2 ring-accent ring-offset-2' : 'border-black/15'}`}
                      style={{ background: c }}
                    />
                  ))}
                  <label className="relative size-7 cursor-pointer overflow-hidden rounded-full border border-black/15 bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]" title="Otro color">
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0"
                      value={settings.background.type === 'color' ? settings.background.color : '#ffffff'}
                      onChange={(e) => set({ background: { type: 'color', color: e.target.value } })}
                      aria-label="Elegir otro color"
                    />
                  </label>
                </div>
                {settings.background.type === 'transparent' && settings.format === 'image/jpeg' && (
                  <p className="mt-2 text-xs text-[#8a5a00]">JPG no admite transparencia: el fondo será blanco. Usa PNG, WEBP o AVIF.</p>
                )}
              </div>
            )}
          </>
        )}
      </Section>

      <Section title="Formato y compresión" step={3}>
        <Seg<Settings['format']> label="Formato de salida" value={settings.format} onChange={(v) => set({ format: v })} options={fmtOptions} />
        <p className="mt-2 text-xs text-muted">
          {settings.format === 'original' && 'Cada imagen mantiene su formato (GIF y BMP se guardan como PNG).'}
          {settings.format === 'image/jpeg' && 'JPG: máxima compatibilidad. Sin transparencia.'}
          {settings.format === 'image/png' && 'PNG: con transparencia. Calidad 95-100 = sin pérdida; por debajo se reduce la paleta a 256 colores o menos (ideal para logos y capturas).'}
          {settings.format === 'image/webp' && 'WEBP: 25-35 % más ligero que JPG con la misma calidad. Ideal para webs.'}
          {settings.format === 'image/avif' && 'AVIF: el más eficiente. Codificación más lenta; si tu navegador no lo genera, se usa un codificador WebAssembly.'}
        </p>

        <div className={`mt-4 ${lossy ? '' : 'pointer-events-none opacity-45'}`}>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="q" className="font-medium">
              Calidad
            </label>
            <span className="text-xs text-muted tabular-nums">{settings.quality}</span>
          </div>
          <input id="q" type="range" min={10} max={100} value={settings.quality} onChange={(e) => set({ quality: Number(e.target.value) })} disabled={!lossy} />
          <div className="flex justify-between text-[11px] text-muted">
            <span>Más ligera</span>
            <span>Recomendado 75-85</span>
            <span>Máxima</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-xs font-medium text-muted">
            Peso máximo (KB)
            <input className="field mt-1" type="number" min={5} inputMode="numeric" placeholder="sin límite" value={settings.maxKB} onChange={(e) => set({ maxKB: numOrEmpty(e.target.value) })} />
          </label>
          <label className="text-xs font-medium text-muted">
            Sufijo del nombre
            <input className="field mt-1" maxLength={40} value={settings.suffix} onChange={(e) => set({ suffix: e.target.value.replace(/[\\/:*?"<>|]/g, '') })} />
          </label>
        </div>
        {settings.maxKB !== '' && <p className="mt-2 text-xs text-muted">Se buscará la mayor calidad posible que no supere {settings.maxKB} KB.</p>}
      </Section>
    </div>
  )
}
