import { useEffect, useRef } from 'react'

/**
 * Hueco publicitario preparado para Google AdSense.
 * - Sin configuración: muestra un marcador "ANUNCIO" con el espacio reservado (evita saltos de diseño).
 * - Con VITE_ADSENSE_CLIENT y el id de bloque correspondiente: renderiza el <ins class="adsbygoogle">.
 * Nunca se coloca dentro del editor ni sobre botones de carga o descarga.
 */
export type AdFormat = 'horizontal' | 'inline' | 'rectangle' | 'footer'

const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined
const SLOTS: Record<string, string | undefined> = {
  'below-tool': import.meta.env.VITE_ADSENSE_SLOT_BELOW_TOOL,
  'between-sections': import.meta.env.VITE_ADSENSE_SLOT_BETWEEN,
  'after-tools': import.meta.env.VITE_ADSENSE_SLOT_AFTER_TOOLS,
  'page-bottom': import.meta.env.VITE_ADSENSE_SLOT_BOTTOM,
  sidebar: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR,
}

const SIZE: Record<AdFormat, string> = {
  horizontal: 'min-h-[90px] md:min-h-[100px]',
  inline: 'min-h-[120px]',
  rectangle: 'min-h-[250px]',
  footer: 'min-h-[90px]',
}

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export default function AdSlot({ position, format = 'horizontal', className = '' }: { position: keyof typeof SLOTS; format?: AdFormat; className?: string }) {
  const slot = SLOTS[position]
  const ref = useRef<HTMLModElement>(null)
  const live = Boolean(CLIENT && slot)

  useEffect(() => {
    if (!live || !ref.current || ref.current.dataset.loaded) return
    ref.current.dataset.loaded = '1'
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      /* AdSense no disponible (bloqueador, etc.) */
    }
  }, [live])

  return (
    <aside aria-label="Publicidad" className={`w-full ${className}`}>
      {live ? (
        <ins
          ref={ref}
          className={`adsbygoogle block ${SIZE[format]}`}
          data-ad-client={CLIENT}
          data-ad-slot={slot}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className={`flex ${SIZE[format]} items-center justify-center rounded-xl border border-dashed border-[#d5d1c8] bg-[#efece6] text-[11px] font-semibold tracking-[0.25em] text-[#9a968d]`}
          data-ad-position={position}
        >
          ANUNCIO
        </div>
      )}
    </aside>
  )
}
