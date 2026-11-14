import { useRef, useState, type ReactNode } from 'react'
import { IconUpload } from './Icons'

interface Props {
  onFiles: (files: File[]) => void
  multiple?: boolean
  compact?: boolean
  title?: string
  hint?: ReactNode
  compactLabel?: string
}

export default function Dropzone({ onFiles, multiple = true, compact = false, title, hint, compactLabel }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)

  const pick = (list: FileList | null) => {
    if (!list || !list.length) return
    onFiles(Array.from(list))
    if (input.current) input.current.value = ''
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={title ?? 'Subir imágenes'}
      onClick={() => input.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          input.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        pick(e.dataTransfer.files)
      }}
      className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-colors outline-none focus-visible:ring-4 focus-visible:ring-accent/25 ${
        over ? 'border-accent bg-accent-soft' : 'border-[#cfcac0] bg-white hover:border-ink/50'
      } ${compact ? 'gap-1 px-4 py-4' : 'gap-3 px-6 py-12 md:py-16'}`}
    >
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,.heic,.heif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => pick(e.target.files)}
      />
      {compact ? (
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          <IconUpload size={18} /> {compactLabel ?? 'Añadir más imágenes'}
        </span>
      ) : (
        <>
          <span className="grid size-14 place-items-center rounded-2xl bg-ink text-white transition-transform group-hover:-translate-y-0.5">
            <IconUpload size={26} />
          </span>
          <span className="font-display text-xl font-bold md:text-2xl">{title ?? 'Arrastra tus imágenes aquí'}</span>
          <span className="text-sm text-muted">
            {hint ?? (
              <>
                o <span className="font-semibold text-accent-dark underline underline-offset-2">selecciónalas desde tu dispositivo</span> · JPG, PNG, WEBP, AVIF, GIF, BMP
              </>
            )}
          </span>
        </>
      )}
    </div>
  )
}
