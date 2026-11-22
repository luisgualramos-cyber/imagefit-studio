export const SITE_NAME = 'ImageFit Studio'
export const SITE_URL = ((import.meta.env.VITE_SITE_URL as string | undefined) || 'https://imagefitstudio.com').replace(/\/$/, '')

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
  /** Página de contenido (guía): se marca como Article con sus fechas en ISO 8601 con zona horaria */
  article?: { published: string; modified: string }
}

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    name: 'Inicio',
    title: 'Herramientas de imagen online gratis y privadas | ImageFit',
    description:
      'Redimensiona, comprime, convierte, recorta o quita el fondo de tus fotos gratis y sin registro. Todo ocurre en tu navegador: tus imágenes no se suben.',
    priority: 1,
    tool: true,
  },
  {
    path: '/redimensionar-imagenes',
    name: 'Redimensionar imágenes',
    title: 'Cambiar tamaño de imagen online, una o varias | ImageFit',
    description:
      'Redimensiona imágenes online en píxeles o porcentaje sin perder calidad y sin deformarlas. Una foto o muchas a la vez, gratis y sin registro.',
    priority: 0.9,
    tool: true,
  },
  {
    path: '/comprimir-imagenes',
    name: 'Comprimir imágenes',
    title: 'Comprimir imágenes sin perder calidad | ImageFit Studio',
    description:
      'Reduce el peso de tus fotos JPG, PNG o WEBP eligiendo la calidad o un límite en KB. Compara el antes y el después. Gratis y sin subir nada.',
    priority: 0.9,
    tool: true,
  },
  {
    path: '/convertir-imagenes',
    name: 'Convertir formatos',
    title: 'Convertir imágenes a JPG, PNG, WEBP y AVIF | ImageFit Studio',
    description:
      'Convierte imágenes a JPG, PNG, WEBP o AVIF (JPG a PNG, PNG a WEBP y más) con una conversión real, no un cambio de extensión. Gratis y en tu navegador.',
    priority: 0.85,
    tool: true,
  },
  {
    path: '/imagenes-para-redes-sociales',
    name: 'Imágenes para redes sociales',
    title: 'Tamaño de imagen para Instagram, TikTok y YouTube | ImageFit',
    description:
      'Adapta tus fotos al tamaño exacto de Instagram, TikTok, YouTube, Facebook, X y LinkedIn sin cortar a las personas gracias al encuadre inteligente.',
    priority: 0.9,
    tool: true,
  },
  {
    path: '/fotos-para-tienda-online',
    name: 'Fotos para tienda online',
    title: 'Fotos de producto con fondo blanco | ImageFit Studio',
    description:
      'Prepara fotos de producto para Shopify, Amazon o Etsy: quita el fondo con IA en tu navegador, ponlo blanco, centra el producto y optimiza el peso.',
    priority: 0.85,
    tool: true,
  },
  {
    path: '/ampliar-imagen',
    name: 'Ampliar imagen',
    title: 'Ampliar el fondo de una imagen online | ImageFit Studio',
    description:
      'Convierte una foto cuadrada en horizontal o vertical ampliando el fondo con desenfoque o espejo, sin bandas negras. Gratis y en tu navegador.',
    priority: 0.7,
    tool: true,
  },
  {
    path: '/comprimir-foto-a-100kb',
    name: 'Comprimir foto a 100 KB',
    title: 'Comprimir foto a 100 KB online gratis | ImageFit Studio',
    description:
      'Reduce una foto a menos de 100 KB (o 50, 200, 500 KB) para formularios y sedes electrónicas. Busca la mejor calidad posible. Gratis y privado.',
    priority: 0.8,
    tool: true,
  },
  {
    path: '/foto-dni',
    name: 'Foto para el DNI',
    title: 'Foto para el DNI 32×26 mm: requisitos oficiales | ImageFit',
    description:
      'Recorta tu foto al tamaño oficial del DNI (32×26 mm, en color, fondo blanco liso) según el Real Decreto 255/2025. Centrada en tu cara y lista para imprimir.',
    priority: 0.85,
    tool: true,
  },
  {
    path: '/foto-carnet-conducir',
    name: 'Foto carné de conducir',
    title: 'Foto carné de conducir (DGT) 32×26 mm | ImageFit Studio',
    description:
      'Prepara la foto de 32×26 mm, en color y con fondo liso, que pide la DGT para el permiso de conducir. Requisitos oficiales, encuadre automático e impresión.',
    priority: 0.85,
    tool: true,
  },
  {
    path: '/foto-pasaporte',
    name: 'Foto para el pasaporte',
    title: 'Foto para el pasaporte 32×26 mm: requisitos | ImageFit',
    description:
      'Prepara la foto del pasaporte español: 32 × 26 mm, en color y con fondo blanco liso, según el Real Decreto 896/2003. Centrada en tu cara y lista para imprimir.',
    priority: 0.85,
    tool: true,
  },
  {
    path: '/foto-tie',
    name: 'Foto para la TIE',
    title: 'Foto para la TIE (extranjeros) 32×26 mm | ImageFit',
    description:
      'Prepara la foto de la TIE para extranjeros: 32 × 26 mm, en color y con fondo blanco liso, como pide la Policía Nacional. Centrada y lista para imprimir.',
    priority: 0.8,
    tool: true,
  },
  {
    path: '/fotos-tramites-espana',
    name: 'Fotos para trámites',
    title: 'Fotos para trámites oficiales en España: medidas y requisitos',
    description:
      'Qué foto piden el DNI, el permiso de conducir y las sedes electrónicas: medidas, fondo y peso según la fuente oficial, con la herramienta lista para prepararla.',
    priority: 0.85,
    article: { published: '2026-11-21T10:50:00+01:00', modified: '2026-11-21T10:50:00+01:00' },
  },
  {
    path: '/redimensionar-foto-whatsapp',
    name: 'Foto para WhatsApp',
    title: 'Foto de perfil de WhatsApp sin que se corte | ImageFit Studio',
    description:
      'Ajusta tu foto de perfil de WhatsApp para que no se corte en el círculo y prepara estados 9:16. Encuadre automático de la cara, gratis y privado.',
    priority: 0.75,
    tool: true,
  },
  {
    path: '/miniatura-youtube',
    name: 'Miniatura de YouTube',
    title: 'Miniatura de YouTube 1280×720 (menos de 2 MB) | ImageFit',
    description:
      'Convierte cualquier imagen en una miniatura válida para YouTube: 1280×720 px, 16:9 y por debajo del límite de 2 MB, sin perder nitidez.',
    priority: 0.75,
    tool: true,
  },
  {
    path: '/reducir-fotos-para-email',
    name: 'Reducir fotos para email',
    title: 'Reducir el tamaño de fotos para email | ImageFit Studio',
    description:
      'Reduce el peso de varias fotos a la vez para enviarlas por correo sin pasar el límite de adjuntos: de 5 MB a unos 300 KB por foto.',
    priority: 0.75,
    tool: true,
  },
  {
    path: '/convertir-heic-a-jpg',
    name: 'HEIC a JPG',
    title: 'Convertir HEIC a JPG online gratis | ImageFit Studio',
    description:
      'Convierte fotos HEIC del iPhone a JPG en tu navegador, sin instalar nada ni subirlas a un servidor. Varias a la vez y descarga en ZIP.',
    priority: 0.8,
    tool: true,
  },
  {
    path: '/convertir-webp-a-jpg',
    name: 'WEBP a JPG',
    title: 'Convertir WEBP a JPG online gratis | ImageFit Studio',
    description:
      'Pasa imágenes WEBP a JPG sin perder calidad para abrirlas en cualquier programa o subirlas a webs que no aceptan WEBP. Varias a la vez, gratis y sin registro.',
    priority: 0.8,
    tool: true,
  },
  {
    path: '/convertir-png-a-jpg',
    name: 'PNG a JPG',
    title: 'Convertir PNG a JPG online gratis | ImageFit Studio',
    description:
      'Convierte PNG a JPG y reduce mucho el peso de capturas y fotos. Elige el color de fondo para las zonas transparentes. Por lotes, gratis y en tu navegador.',
    priority: 0.8,
    tool: true,
  },
  {
    path: '/recortar-imagen',
    name: 'Recortar imagen',
    title: 'Recortar imagen online: 1:1, 4:5, 16:9 y más | ImageFit',
    description:
      'Recorta fotos online a cuadrado, vertical o panorámico. El encuadre inteligente con IA detecta caras y objetos para no cortarlos. Gratis y sin registro.',
    priority: 0.8,
    tool: true,
  },
  {
    path: '/redimensionar-imagen-en-cm',
    name: 'Cambiar tamaño en cm',
    title: 'Cambiar tamaño de imagen en cm o mm para imprimir | ImageFit',
    description:
      'Redimensiona una imagen a centímetros o milímetros exactos eligiendo la resolución (ppp). Calcula los píxeles necesarios para imprimir con buena calidad.',
    priority: 0.75,
    tool: true,
  },
  {
    path: '/acerca-de',
    name: 'Acerca de',
    title: 'Acerca de ImageFit Studio: quién lo hace y cómo funciona',
    description: 'Qué es ImageFit Studio, por qué tus imágenes no se suben a ningún servidor, qué herramientas incluye, quién lo mantiene y cómo se financia.',
    priority: 0.4,
  },
  {
    path: '/guia-formatos-de-imagen',
    name: 'Guía de formatos de imagen',
    title: 'JPG, PNG, WEBP, AVIF o HEIC: qué formato usar | ImageFit',
    description: 'Diferencias entre JPG, PNG, WEBP, AVIF y HEIC, compresión con y sin pérdida, y qué formato elegir para web, correo, impresión, logotipos o capturas.',
    priority: 0.6,
    article: { published: '2026-11-15T19:40:24+01:00', modified: '2026-11-19T10:10:49+01:00' },
  },
  {
    path: '/optimizar-imagenes-para-web',
    name: 'Optimizar imágenes para la web',
    title: 'Optimizar imágenes para la web sin perder calidad | ImageFit',
    description: 'Guía paso a paso para que las imágenes de tu web pesen menos: dimensiones, formato, compresión, metadatos, procesado por lotes y buenas prácticas.',
    priority: 0.6,
    article: { published: '2026-11-15T19:40:24+01:00', modified: '2026-11-19T10:10:49+01:00' },
  },
  {
    path: '/subir-fotos-sede-electronica',
    name: 'Subir fotos a una sede electrónica',
    title: 'Subir una foto a una sede electrónica sin errores | ImageFit',
    description: 'Soluciones a «el archivo supera el tamaño máximo» y «formato no válido»: formato, peso, medidas y nombre correctos para trámites online, oposiciones y becas.',
    priority: 0.7,
    article: { published: '2026-11-19T10:10:49+01:00', modified: '2026-11-21T10:50:25+01:00' },
  },
  {
    path: '/privacidad',
    name: 'Privacidad',
    title: 'Privacidad y cookies | ImageFit Studio',
    description: 'Cómo trata ImageFit Studio tus imágenes y datos: qué se procesa en tu navegador, qué servicios externos se usan y qué cookies puede haber.',
    priority: 0.3,
  },
  {
    path: '/aviso-legal',
    name: 'Aviso legal',
    title: 'Aviso legal | ImageFit Studio',
    description: 'Datos del titular de ImageFit Studio y condiciones de uso del sitio web.',
    priority: 0.2,
    // Contiene datos personales obligatorios (LSSI art. 10): accesible desde el pie, pero fuera de los buscadores.
    noindex: true,
  },
  {
    path: '/contacto',
    name: 'Contacto',
    title: 'Contacto | ImageFit Studio',
    description: 'Escríbenos para comunicar errores, sugerir formatos o resolver dudas sobre las herramientas de ImageFit Studio.',
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

const ORG_ID = `${SITE_URL}/#organization`

/** Datos estructurados JSON-LD de cada página. */
export function jsonLd(meta: RouteMeta, faqs: FaqItem[] = []) {
  const url = SITE_URL + (meta.path === '/' ? '/' : meta.path)
  const graph: Record<string, unknown>[] = []
  if (meta.path === '/') {
    graph.push({
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-512.png`, width: 512, height: 512 },
    })
    graph.push({
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: 'es',
      publisher: { '@id': ORG_ID },
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
  if (meta.article) {
    graph.push({
      '@type': 'Article',
      headline: meta.title.length > 110 ? meta.name : meta.title,
      description: meta.description,
      url,
      mainEntityOfPage: url,
      inLanguage: 'es',
      datePublished: meta.article.published,
      dateModified: meta.article.modified,
      image: `${SITE_URL}/og-image.png`,
      author: { '@type': 'Organization', '@id': ORG_ID, name: SITE_NAME, url: `${SITE_URL}/` },
      publisher: { '@type': 'Organization', '@id': ORG_ID, name: SITE_NAME, url: `${SITE_URL}/`, logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-512.png` } },
    })
  }
  if (meta.path !== '/' && meta.path !== NOT_FOUND.path) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
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
