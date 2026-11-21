/**
 * Páginas de trámites oficiales en España.
 * Regla: cada requisito publicado sale de una fuente oficial leída y enlazada, con su fecha de revisión.
 * Si no se puede verificar un dato en la fuente oficial, no se publica.
 */
export interface Tramite {
  /** Página de ImageFit con la herramienta preparada */
  to: string
  name: string
  /** Texto del botón (descriptivo) */
  cta: string
  /** Resumen de la foto que se pide (solo datos verificados) */
  foto: string
  /** Fuente oficial; ausente cuando la página es una ayuda general y no un requisito oficial */
  source?: { label: string; url: string }
  /** Fecha de la última revisión de la fuente (dd/mm/aaaa) */
  reviewed?: string
}

export const TRAMITES: Tramite[] = [
  {
    to: '/foto-dni',
    name: 'Foto para el DNI',
    cta: 'Preparar la foto del DNI',
    foto: '32 × 26 mm, en color, con fondo uniforme blanco y liso, de frente y con la cabeza descubierta.',
    source: { label: 'BOE · Real Decreto 255/2025, art. 6.2.d', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2025-6601' },
    reviewed: '21/11/2026',
  },
  {
    to: '/foto-carnet-conducir',
    name: 'Foto para el carné de conducir',
    cta: 'Preparar la foto para la DGT',
    foto: '32 × 26 mm, en color y con fondo liso. Desde noviembre de 2024 la DGT no la vuelve a pedir si ya tiene tu foto.',
    source: {
      label: 'Sede electrónica de la DGT',
      url: 'https://sede.dgt.gob.es/es/permisos-de-conducir/obtencion-y-gestion-de-permisos/duplicado-de-permisos-por-cambio-de-datos/index.html',
    },
    reviewed: '21/11/2026',
  },
  {
    to: '/comprimir-foto-a-100kb',
    name: 'Foto de menos de 100 KB',
    cta: 'Comprimir una foto a 100 KB',
    foto: 'Para formularios y sedes que limitan el peso del archivo: 100 KB, o el límite que te indiquen (50, 200, 500 KB).',
  },
  {
    to: '/subir-fotos-sede-electronica',
    name: 'Subir una foto a una sede electrónica',
    cta: 'Ver cómo subir la foto sin errores',
    foto: 'Qué hacer cuando la sede dice «el archivo supera el tamaño máximo» o «formato no válido».',
  },
]
