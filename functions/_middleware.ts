/**
 * Cloudflare Pages middleware:
 * - redirige la dirección provisional imagefit-studio.pages.dev al dominio definitivo (301), conservando ruta y query.
 *   Las vistas previas (<hash>.imagefit-studio.pages.dev) no se redirigen.
 * - redirige (301) las páginas que se unieron a otras el 18/11/2026, para no perder visitas ni posicionamiento.
 */
const PAGES_DEV_HOST = 'imagefit-studio.pages.dev'
const CANONICAL_ORIGIN = 'https://imagefitstudio.com'

/** Páginas antiguas → página que las sustituye */
export const MOVED: Record<string, string> = {
  '/redimensionar-varias-imagenes': '/redimensionar-imagenes',
  '/encuadre-inteligente': '/recortar-imagen',
  '/convertir-jpg-a-png': '/convertir-imagenes',
  '/convertir-png-a-webp': '/convertir-imagenes',
  '/foto-carnet-dni-pasaporte': '/foto-dni',
}

interface Ctx {
  request: Request
  next: () => Promise<Response>
}

export const onRequest = ({ request, next }: Ctx) => {
  const url = new URL(request.url)
  if (url.hostname === PAGES_DEV_HOST) {
    return Response.redirect(CANONICAL_ORIGIN + url.pathname + url.search, 301)
  }
  const path = url.pathname.replace(/\.html$/, '').replace(/\/+$/, '')
  const target = MOVED[path]
  if (target) {
    return Response.redirect(url.origin + target + url.search, 301)
  }
  return next()
}
