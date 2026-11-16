/**
 * Cloudflare Pages middleware: redirige la dirección provisional
 * imagefit-studio.pages.dev al dominio definitivo (301), conservando ruta y query.
 * Las vistas previas (<hash>.imagefit-studio.pages.dev) no se redirigen.
 */
const PAGES_DEV_HOST = 'imagefit-studio.pages.dev'
const CANONICAL_ORIGIN = 'https://imagefitstudio.com'

interface Ctx {
  request: Request
  next: () => Promise<Response>
}

export const onRequest = ({ request, next }: Ctx) => {
  const url = new URL(request.url)
  if (url.hostname === PAGES_DEV_HOST) {
    return Response.redirect(CANONICAL_ORIGIN + url.pathname + url.search, 301)
  }
  return next()
}
