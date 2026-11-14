export const SITE_NAME = 'ImageFit Studio'
export const SITE_URL = ((import.meta.env.VITE_SITE_URL as string | undefined) || 'https://imagefit-studio.pages.dev').replace(/\/$/, '')

export interface RouteMeta {
  path: string
  title: string
  description: string
  /** Nombre corto para menús y migas de pan */
  name: string
  priority: number
  /** Es una herramienta (se marca como WebApplication en los datos estructurados) */
  tool?: boolean
  noindex?: boolean
}

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    name: 'Inicio',
    title: 'ImageFit Studio · Redimensionar, comprimir y adaptar imágenes online gratis',
    description:
      'Cambia el tamaño, comprime, convierte y adapta tus fotos para Instagram, TikTok, YouTube o tu tienda online. Gratis, sin registro y procesadas en tu navegador.',
    priority: 1,
    tool: true,
  },
  {
    path: '/redimensionar-imagenes',
    name: 'Redimensionar imágenes',
    title: 'Redimensionar imágenes online · Cambiar tamaño de imagen gratis | ImageFit Studio',
    description:
      'Cambia el tamaño de una imagen en píxeles o porcentaje manteniendo la proporción. Redimensiona varias fotos a la vez sin perder calidad y sin subirlas a ningún servidor.',
    priority: 0.9,
    tool: true,
  },
  {
    path: '/comprimir-imagenes',
    name: 'Comprimir imágenes',
    title: 'Comprimir imágenes online sin perder calidad · JPG, PNG, WEBP | ImageFit Studio',
    description:
      'Reduce el peso de tus fotografías eligiendo la calidad o un tamaño máximo en KB. Compara el antes y el después y descarga al instante. Gratis y privado.',
    priority: 0.9,
    tool: true,
  },
  {
    path: '/convertir-imagenes',
    name: 'Convertir formatos',
    title: 'Convertir imágenes online · JPG, PNG, WEBP y AVIF | ImageFit Studio',
    description:
      'Convierte imágenes entre JPG, PNG, WEBP y AVIF generando archivos nuevos y válidos, no un simple cambio de extensión. Por lotes y en tu navegador.',
    priority: 0.85,
    tool: true,
  },
  {
    path: '/convertir-jpg-a-png',
    name: 'JPG a PNG',
    title: 'Convertir JPG a PNG online gratis | ImageFit Studio',
    description:
      'Pasa tus fotos JPG a PNG sin pérdida adicional de calidad. Conversión real en tu navegador, varias imágenes a la vez y descarga en ZIP.',
    priority: 0.7,
    tool: true,
  },
  {
    path: '/convertir-png-a-webp',
    name: 'PNG a WEBP',
    title: 'Convertir PNG a WEBP online · Imágenes más ligeras para tu web | ImageFit Studio',
    description:
      'Convierte PNG a WEBP conservando la transparencia y reduciendo el peso hasta un 80 %. Ideal para acelerar tu página web. Gratis y sin subir archivos.',
    priority: 0.7,
    tool: true,
  },
  {
    path: '/imagenes-para-redes-sociales',
    name: 'Imágenes para redes sociales',
    title: 'Adaptar imágenes para Instagram, TikTok y YouTube · Tamaños 2026 | ImageFit Studio',
    description:
      'Adapta tus fotos al tamaño exacto de Instagram, TikTok, YouTube, Facebook, X y LinkedIn con encuadre inteligente que mantiene a las personas en la imagen.',
    priority: 0.9,
    tool: true,
  },
  {
    path: '/fotos-para-tienda-online',
    name: 'Fotos para tienda online',
    title: 'Fotos de producto para tienda online · Fondo blanco y centrado | ImageFit Studio',
    description:
      'Prepara fotos de producto para Shopify, Amazon, WooCommerce o Etsy: elimina el fondo con IA en tu navegador, ponlo blanco, centra el producto y optimiza el peso.',
    priority: 0.85,
    tool: true,
  },
  {
    path: '/redimensionar-varias-imagenes',
    name: 'Procesar varias imágenes',
    title: 'Redimensionar varias imágenes a la vez · Procesamiento por lotes | ImageFit Studio',
    description:
      'Aplica el mismo tamaño, formato y compresión a decenas de fotos de una vez y descárgalas juntas en un ZIP. Sin instalar programas y sin límite de cuenta.',
    priority: 0.85,
    tool: true,
  },
  {
    path: '/encuadre-inteligente',
    name: 'Encuadre inteligente',
    title: 'Recorte inteligente de fotos con IA · Encuadre automático | ImageFit Studio',
    description:
      'Convierte fotos horizontales en verticales sin cortar a las personas: detección de rostros y objetos con IA directamente en tu navegador y ajuste manual del encuadre.',
    priority: 0.8,
    tool: true,
  },
  {
    path: '/ampliar-imagen',
    name: 'Ampliar imagen',
    title: 'Ampliar el fondo de una imagen · Cambiar formato sin bandas | ImageFit Studio',
    description:
      'Convierte una foto cuadrada en horizontal o vertical ampliando el fondo: relleno local por desenfoque o espejo, y ampliación generativa con IA cuando está activada.',
    priority: 0.7,
    tool: true,
  },
  {
    path: '/comprimir-foto-a-100kb',
    name: 'Comprimir foto a 100 KB',
    title: 'Comprimir foto a 100 KB online (o 50, 200, 500 KB) | ImageFit Studio',
    description:
      'Reduce una foto a menos de 100 KB para formularios, sedes electrónicas y webs. Elige el límite exacto en KB y la herramienta busca la mejor calidad posible. Gratis y sin subir nada.',
    priority: 0.8,
    tool: true,
  },
  {
    path: '/foto-carnet-dni-pasaporte',
    name: 'Foto para DNI y pasaporte',
    title: 'Foto de carné para DNI, pasaporte o visado online · Tamaño exacto | ImageFit Studio',
    description:
      'Recorta tu foto al tamaño del DNI y pasaporte español (26×32 mm), carné internacional 35×45 mm o EE. UU. 2×2", centrada en tu cara automáticamente. Lista para imprimir o subir.',
    priority: 0.8,
    tool: true,
  },
  {
    path: '/redimensionar-foto-whatsapp',
    name: 'Foto para WhatsApp',
    title: 'Foto de perfil y estados de WhatsApp sin que se corte | ImageFit Studio',
    description:
      'Ajusta tu foto de perfil de WhatsApp para que no se corte en el círculo y prepara estados 9:16 a pantalla completa. Encuadre automático de la cara, gratis y privado.',
    priority: 0.75,
    tool: true,
  },
  {
    path: '/miniatura-youtube',
    name: 'Miniatura de YouTube',
    title: 'Miniatura de YouTube 1280×720 y menos de 2 MB · Redimensionar online | ImageFit Studio',
    description:
      'Convierte cualquier imagen en una miniatura de YouTube válida: 1280×720 px, proporción 16:9 y por debajo del límite de 2 MB, sin perder nitidez.',
    priority: 0.75,
    tool: true,
  },
  {
    path: '/reducir-fotos-para-email',
    name: 'Reducir fotos para email',
    title: 'Reducir el tamaño de fotos para enviar por email | ImageFit Studio',
    description:
      'Reduce el peso de varias fotos a la vez para enviarlas por correo sin superar el límite de adjuntos. De 5 MB a unos 300 KB por foto, con calidad de sobra para verlas.',
    priority: 0.75,
    tool: true,
  },
  {
    path: '/convertir-heic-a-jpg',
    name: 'HEIC a JPG',
    title: 'Convertir HEIC a JPG online · Fotos de iPhone en Windows y Android | ImageFit Studio',
    description:
      'Convierte fotos HEIC del iPhone a JPG en tu navegador, sin instalar nada ni subirlas a ningún servidor. Varias a la vez y descarga en ZIP. Funciona en Windows, Android y Mac.',
    priority: 0.8,
    tool: true,
  },
  {
    path: '/privacidad',
    name: 'Privacidad',
    title: 'Privacidad y cookies | ImageFit Studio',
    description: 'Cómo trata ImageFit Studio tus imágenes y datos: qué se procesa en tu navegador, qué servicios externos se usan y qué cookies puede haber.',
    priority: 0.3,
  },
]

export const NOT_FOUND: RouteMeta = {
  path: '/404',
  name: 'Página no encontrada',
  title: 'Página no encontrada | ImageFit Studio',
  description: 'La página que buscas no existe.',
  priority: 0,
  noindex: true,
}

export const routeMeta = (path: string) => ROUTES.find((r) => r.path === path) ?? NOT_FOUND

export interface FaqItem {
  q: string
  a: string
}

/** Datos estructurados JSON-LD de cada página. */
export function jsonLd(meta: RouteMeta, faqs: FaqItem[] = []) {
  const url = SITE_URL + (meta.path === '/' ? '/' : meta.path)
  const graph: Record<string, unknown>[] = []
  if (meta.path === '/') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: 'es',
    })
  }
  if (meta.tool) {
    graph.push({
      '@type': 'WebApplication',
      name: meta.path === '/' ? SITE_NAME : `${meta.name} · ${SITE_NAME}`,
      url,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Cualquiera (navegador web)',
      browserRequirements: 'Requiere JavaScript y un navegador actualizado',
      description: meta.description,
      inLanguage: 'es',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    })
  }
  if (meta.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: meta.name, item: url },
      ],
    })
  }
  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}
