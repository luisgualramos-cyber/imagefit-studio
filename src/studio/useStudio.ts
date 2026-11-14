import { useCallback, useEffect, useRef, useState } from 'react'
import { buildJob, newId, outputName, processBlob, readImage, resolveFormat, MAX_FILES } from '../lib/processor'
import type { ImageItem, ManualCrop, Settings } from '../lib/types'

export const DEFAULT_SETTINGS: Settings = {
  sizeMode: 'original',
  percent: 50,
  width: '',
  height: '',
  lockRatio: true,
  noUpscale: false,
  presetId: null,
  fit: 'cover',
  background: { type: 'blur' },
  smartCrop: true,
  format: 'original',
  quality: 80,
  maxKB: '',
  suffix: '-imagefit',
}

export interface Notice {
  id: string
  kind: 'error' | 'info'
  text: string
}

export function useStudio(initial?: Partial<Settings>) {
  const [items, setItems] = useState<ImageItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [settings, setSettingsState] = useState<Settings>({ ...DEFAULT_SETTINGS, ...initial })
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [notices, setNotices] = useState<Notice[]>([])
  const itemsRef = useRef(items)
  itemsRef.current = items

  const notify = useCallback((kind: Notice['kind'], text: string) => {
    const id = newId()
    setNotices((n) => [...n.slice(-3), { id, kind, text }])
    setTimeout(() => setNotices((n) => n.filter((x) => x.id !== id)), 7000)
  }, [])
  const dismiss = (id: string) => setNotices((n) => n.filter((x) => x.id !== id))

  const patch = useCallback((id: string, p: Partial<ImageItem> | ((it: ImageItem) => Partial<ImageItem>)) => {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...(typeof p === 'function' ? p(it) : p) } : it)))
  }, [])

  /** Invalida resultados (libera memoria) cuando cambia la configuración o el encuadre. */
  const clearResult = (it: ImageItem): ImageItem => {
    if (!it.result) return it
    URL.revokeObjectURL(it.result.url)
    return { ...it, result: undefined, status: it.status === 'done' || it.status === 'processing' ? 'ready' : it.status }
  }

  const setSettings = useCallback((p: Partial<Settings>) => {
    setSettingsState((s) => ({ ...s, ...p }))
    setItems((list) => list.map(clearResult))
  }, [])

  const setCrop = useCallback((id: string, crop: ManualCrop | undefined) => {
    setItems((list) => list.map((it) => (it.id === id ? { ...clearResult(it), crop } : it)))
  }, [])

  const addFiles = useCallback(
    (files: File[]) => {
      const room = MAX_FILES - itemsRef.current.length
      if (room <= 0) {
        notify('error', `Máximo ${MAX_FILES} imágenes a la vez.`)
        return
      }
      const accepted = files.filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name))
      const rejected = files.length - accepted.length
      if (rejected) notify('error', `${rejected} archivo(s) ignorado(s): no son imágenes.`)
      if (accepted.length > room) notify('info', `Solo se han añadido ${room} imágenes (máximo ${MAX_FILES}).`)
      const fresh: ImageItem[] = accepted.slice(0, room).map((file) => ({
        id: newId(),
        file,
        name: file.name,
        url: URL.createObjectURL(file),
        width: 0,
        height: 0,
        size: file.size,
        status: 'loading',
      }))
      if (!fresh.length) return
      setItems((list) => [...list, ...fresh])
      setSelectedId((cur) => cur ?? fresh[0].id)
      for (const it of fresh) {
        readImage(it.file)
          .then(({ width, height, file }) =>
            patch(it.id, (cur) => {
              // Si la foto se convirtió (HEIC), la vista previa pasa a usar el archivo convertido.
              if (file === cur.file) return { width, height, status: 'ready' }
              URL.revokeObjectURL(cur.url)
              return { width, height, file, url: URL.createObjectURL(file), status: 'ready' }
            }),
          )
          .catch((e: Error) => patch(it.id, { status: 'error', error: e.message }))
      }
    },
    [notify, patch],
  )

  const remove = useCallback((id: string) => {
    setItems((list) => {
      const it = list.find((x) => x.id === id)
      if (it) {
        URL.revokeObjectURL(it.url)
        if (it.result) URL.revokeObjectURL(it.result.url)
      }
      const next = list.filter((x) => x.id !== id)
      setSelectedId((cur) => (cur === id ? (next[0]?.id ?? null) : cur))
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    for (const it of itemsRef.current) {
      URL.revokeObjectURL(it.url)
      if (it.result) URL.revokeObjectURL(it.result.url)
    }
    setItems([])
    setSelectedId(null)
  }, [])

  /* ---- Detección automática del elemento principal (secuencial, una imagen cada vez) ---- */
  const detectingRef = useRef(false)
  useEffect(() => {
    // Solo se analiza cuando hace falta recortar (formato exacto + «Recortar»).
    const exact =
      settings.sizeMode === 'preset' || (settings.sizeMode === 'custom' && !settings.lockRatio && settings.width !== '' && settings.height !== '')
    if (!settings.smartCrop || settings.fit !== 'cover' || !exact || detectingRef.current) return
    const next = items.find((it) => it.status !== 'loading' && it.status !== 'error' && it.focus === undefined && !it.detectError)
    if (!next) return
    detectingRef.current = true
    patch(next.id, { detecting: true })
    import('../lib/detect')
      .then(({ detectSubject }) => detectSubject(next.file))
      .then((focus) => patch(next.id, (it) => ({ ...clearResult(it), focus, detecting: false })))
      .catch((e: Error) => {
        console.warn('Detección no disponible:', e)
        patch(next.id, {
          focus: null,
          detecting: false,
          detectError: 'No se pudo cargar el modelo de detección (¿sin conexión?). Se usa el encuadre centrado; puedes ajustarlo a mano.',
        })
      })
      .finally(() => {
        detectingRef.current = false
        // Fuerza una nueva evaluación para la siguiente imagen pendiente.
        setItems((l) => [...l])
      })
  }, [items, settings.smartCrop, settings.fit, settings.sizeMode, settings.lockRatio, settings.width, settings.height, patch])

  const processAll = useCallback(async () => {
    const list = itemsRef.current.filter((it) => it.width > 0 && it.status !== 'error')
    if (!list.length) return
    setProcessing(true)
    setProgress({ done: 0, total: list.length })
    let ok = 0
    let failed = 0
    await Promise.all(
      list.map(async (it) => {
        patch(it.id, (cur) => ({ ...clearResult(cur), status: 'processing' }))
        try {
          // Usa el estado más reciente del elemento (encuadre/detección).
          const fresh = itemsRef.current.find((x) => x.id === it.id) ?? it
          const job = buildJob(fresh, settings)
          const res = await processBlob(fresh.file, job)
          const url = URL.createObjectURL(res.blob)
          patch(it.id, {
            status: 'done',
            result: { blob: res.blob, url, width: res.width, height: res.height, size: res.blob.size, format: res.format, warning: res.warning },
          })
          ok++
        } catch (e) {
          failed++
          patch(it.id, { status: 'error', error: e instanceof Error ? e.message : 'Error al procesar la imagen.' })
        } finally {
          setProgress((p) => ({ ...p, done: p.done + 1 }))
        }
      }),
    )
    setProcessing(false)
    if (failed) notify('error', `${failed} imagen(es) no se pudieron procesar. Revisa los mensajes en cada miniatura.`)
    else if (ok) notify('info', ok === 1 ? 'Imagen lista para descargar.' : `${ok} imágenes listas para descargar.`)
  }, [settings, patch, notify])

  /** Reintenta una imagen que falló al procesar (no las que no se pudieron leer). */
  const retry = useCallback(
    (id: string) => patch(id, (it) => (it.width > 0 ? { status: 'ready', error: undefined } : {})),
    [patch],
  )

  const fileNameFor = (it: ImageItem) => outputName(it.name, it.result?.format ?? resolveFormat(it, settings), settings.suffix)

  return {
    items,
    selected: items.find((i) => i.id === selectedId) ?? null,
    selectedId,
    setSelectedId,
    settings,
    setSettings,
    setCrop,
    addFiles,
    remove,
    clearAll,
    processAll,
    retry,
    processing,
    progress,
    notices,
    dismiss,
    notify,
    fileNameFor,
  }
}

export type StudioState = ReturnType<typeof useStudio>
