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

export interface RelatedLink {
  to: string
  label: string
  /** Para qué sirve en este caso concreto */
  why: string
}

export interface RelatedBlock {
  title: string
  links: RelatedLink[]
}

const HUB: RelatedLink = {
  to: '/fotos-tramites-espana',
  label: 'Fotos para trámites oficiales en España',
  why: 'Resumen de qué foto pide cada trámite, con su fuente oficial.',
}

/**
 * Enlazado interno entre trámites y herramientas:
 * - cada página de trámite enlaza a las herramientas exactas que necesita, a la página central y a trámites relacionados;
 * - cada herramienta enlaza a los trámites en los que se usa.
 * (No se enlaza «quitar el fondo» desde los trámites: una foto oficial con el fondo cambiado podría no ser aceptada.)
 */
export const RELATED: Record<string, RelatedBlock> = {
  '/foto-dni': {
    title: 'Herramientas y trámites relacionados',
    links: [
      { to: '/recortar-imagen', label: 'Recortar una imagen', why: 'Si quieres ajustar el encuadre a mano antes de preparar la foto.' },
      { to: '/redimensionar-imagen-en-cm', label: 'Cambiar el tamaño en cm', why: 'Si necesitas otra medida exacta en milímetros para imprimir.' },
      { to: '/foto-carnet-conducir', label: 'Foto para el carné de conducir', why: 'Misma medida; con fondo blanco te sirve la misma foto.' },
      { to: '/subir-fotos-sede-electronica', label: 'Subir una foto a una sede electrónica', why: 'Si el trámite es online y la foto no se acepta.' },
      HUB,
    ],
  },
  '/foto-carnet-conducir': {
    title: 'Herramientas y trámites relacionados',
    links: [
      { to: '/recortar-imagen', label: 'Recortar una imagen', why: 'Si quieres ajustar el encuadre a mano antes de preparar la foto.' },
      { to: '/redimensionar-imagen-en-cm', label: 'Cambiar el tamaño en cm', why: 'Si necesitas otra medida exacta en milímetros para imprimir.' },
      { to: '/foto-dni', label: 'Foto para el DNI', why: 'Misma medida, pero con fondo blanco obligatorio.' },
      { to: '/comprimir-foto-a-100kb', label: 'Comprimir una foto a 100 KB', why: 'Si un formulario online te limita el peso de la foto.' },
      HUB,
    ],
  },
  '/comprimir-foto-a-100kb': {
    title: 'Herramientas y trámites relacionados',
    links: [
      { to: '/comprimir-imagenes', label: 'Comprimir imágenes con otro límite', why: 'Para cualquier peso máximo (50 KB, 200 KB, 1 MB…) o elegir la calidad a mano.' },
      { to: '/convertir-heic-a-jpg', label: 'Convertir HEIC a JPG', why: 'Las fotos del iPhone en HEIC no las acepta casi ninguna sede.' },
      { to: '/redimensionar-imagenes', label: 'Redimensionar una imagen', why: 'Si además te piden unas medidas en píxeles.' },
      { to: '/subir-fotos-sede-electronica', label: 'Subir una foto a una sede electrónica', why: 'Errores típicos («supera el tamaño máximo», «formato no válido») y cómo resolverlos.' },
      { to: '/foto-dni', label: 'Foto para el DNI', why: 'Si la foto es para el documento de identidad.' },
      HUB,
    ],
  },
  '/subir-fotos-sede-electronica': {
    title: 'Herramientas para preparar tu archivo',
    links: [
      { to: '/comprimir-foto-a-100kb', label: 'Comprimir una foto a 100 KB', why: 'El límite de peso más habitual en formularios.' },
      { to: '/convertir-heic-a-jpg', label: 'Convertir HEIC a JPG', why: 'Si la foto es de un iPhone.' },
      { to: '/redimensionar-imagenes', label: 'Redimensionar una imagen', why: 'Si te piden unas medidas en píxeles.' },
      { to: '/foto-dni', label: 'Foto para el DNI', why: 'Foto de 32 × 26 mm según el BOE.' },
      { to: '/foto-carnet-conducir', label: 'Foto para el carné de conducir', why: 'Foto de 32 × 26 mm según la DGT.' },
      HUB,
    ],
  },
  // Herramientas → trámites en los que se usan
  '/recortar-imagen': {
    title: 'Trámites en los que se usa',
    links: [
      { to: '/foto-dni', label: 'Foto para el DNI', why: 'Recorte de 32 × 26 mm centrado en la cara, ya configurado.' },
      { to: '/foto-carnet-conducir', label: 'Foto para el carné de conducir', why: 'La misma medida que pide la DGT.' },
      HUB,
    ],
  },
  '/redimensionar-imagen-en-cm': {
    title: 'Trámites en los que se usa',
    links: [
      { to: '/foto-dni', label: 'Foto para el DNI', why: 'Tiene ya preparada la medida de 32 × 26 mm a 300 ppp.' },
      { to: '/foto-carnet-conducir', label: 'Foto para el carné de conducir', why: 'Misma medida de impresión.' },
      HUB,
    ],
  },
  '/comprimir-imagenes': {
    title: 'Trámites en los que se usa',
    links: [
      { to: '/comprimir-foto-a-100kb', label: 'Comprimir una foto a 100 KB', why: 'Ya configurada con el límite más habitual de los formularios.' },
      { to: '/subir-fotos-sede-electronica', label: 'Subir una foto a una sede electrónica', why: 'Qué hacer cuando la sede dice que el archivo pesa demasiado.' },
      HUB,
    ],
  },
  '/redimensionar-imagenes': {
    title: 'Trámites en los que se usa',
    links: [
      { to: '/subir-fotos-sede-electronica', label: 'Subir una foto a una sede electrónica', why: 'Cuando el formulario pide unas medidas en píxeles.' },
      { to: '/comprimir-foto-a-100kb', label: 'Comprimir una foto a 100 KB', why: 'Si además hay un límite de peso.' },
      HUB,
    ],
  },
  '/convertir-heic-a-jpg': {
    title: 'Trámites en los que se usa',
    links: [
      { to: '/subir-fotos-sede-electronica', label: 'Subir una foto a una sede electrónica', why: 'Casi ninguna sede acepta HEIC: conviértela antes.' },
      { to: '/comprimir-foto-a-100kb', label: 'Comprimir una foto a 100 KB', why: 'Si además te limitan el peso.' },
      HUB,
    ],
  },
  '/convertir-imagenes': {
    title: 'Trámites en los que se usa',
    links: [
      { to: '/subir-fotos-sede-electronica', label: 'Subir una foto a una sede electrónica', why: 'Cuando el formulario dice «formato no válido».' },
      HUB,
    ],
  },
  '/convertir-webp-a-jpg': {
    title: 'Trámites en los que se usa',
    links: [
      { to: '/subir-fotos-sede-electronica', label: 'Subir una foto a una sede electrónica', why: 'Muchas sedes solo aceptan JPG.' },
      HUB,
    ],
  },
  '/convertir-png-a-jpg': {
    title: 'Trámites en los que se usa',
    links: [
      { to: '/subir-fotos-sede-electronica', label: 'Subir una foto a una sede electrónica', why: 'Un PNG suele pesar demasiado para los formularios: en JPG pesa mucho menos.' },
      HUB,
    ],
  },
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
