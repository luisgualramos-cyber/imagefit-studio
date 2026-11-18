import { useEffect, useRef } from 'react'

/**
 * Hueco publicitario preparado para Google AdSense.
 * - Sin configuración (sin VITE_ADSENSE_CLIENT o sin id de bloque): no pinta nada.
 * - Con configuración: renderiza el <ins class="adsbygoogle">, que no ocupa espacio hasta que
 *   AdSense lo rellena (data-ad-status="filled"); si queda "unfilled" se oculta (ver index.css).
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

  if (!live) return null
  return (
    <aside aria-label="Publicidad" className={`ad-slot w-full ${className}`}>
      <ins
        ref={ref}
        className="adsbygoogle block"
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
        data-full-width-responsive="true"
      />
    </aside>
  )
}
