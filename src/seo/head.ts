import { faqsFor } from '../content/faqs'
import { jsonLd, routeMeta, SITE_NAME, SITE_URL } from './routes'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const norm = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path)

/** Etiquetas <head> de una ruta (se usan al prerenderizar el HTML estático). */
export function headHtml(path: string) {
  const p = norm(path)
  const m = routeMeta(p)
  const url = SITE_URL + (m.path === '/' ? '/' : m.path)
  const ld = JSON.stringify(jsonLd(m, faqsFor(m.path))).replace(/</g, '\\u003c')
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    m.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="es_ES" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-image.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="ImageFit Studio: redimensionar, comprimir y convertir imágenes online" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<script type="application/ld+json">${ld}</script>`,
  ].join('\n    ')
}

/** Actualiza título, descripción y canonical al navegar en el cliente. */
export function applyHead(path: string) {
  const p = norm(path)
  const m = routeMeta(p)
  document.title = m.title
  const set = (sel: string, attr: string, val: string) => {
    const el = document.head.querySelector(sel)
    if (el) el.setAttribute(attr, val)
  }
  const url = SITE_URL + (m.path === '/' ? '/' : m.path)
  set('meta[name="description"]', 'content', m.description)
  set('link[rel="canonical"]', 'href', url)
  set('meta[property="og:title"]', 'content', m.title)
  set('meta[property="og:description"]', 'content', m.description)
  set('meta[property="og:url"]', 'content', url)
  const ld = document.head.querySelector('script[type="application/ld+json"]')
  if (ld) ld.textContent = JSON.stringify(jsonLd(m, faqsFor(m.path)))
}
