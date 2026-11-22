// Genera HTML estático por ruta (SEO), sitemap.xml y robots.txt a partir del build de SSR.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const dist = resolve('dist')
let template = readFileSync(resolve(dist, 'index.html'), 'utf8')
// Rendimiento: el CSS (pequeño) va en línea para que el primer pintado no espere a otra descarga.
template = template.replace(/<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/, (tag, file) => {
  const css = readFileSync(resolve(dist, file), 'utf8').replace(/<\/style/gi, '<\/style')
  return `<style>${css}</style>`
})
const { render, routes, siteUrl } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)

// AdSense: el script solo se inyecta si hay ID de cliente configurado.
const env = loadEnv('production', process.cwd(), 'VITE_')
const client = process.env.VITE_ADSENSE_CLIENT || env.VITE_ADSENSE_CLIENT
// Google Analytics 4 (opcional): solo se inyecta si hay un ID de medición real (G-XXXXXXXXXX).
const gaId = process.env.VITE_GA_ID || env.VITE_GA_ID
if (gaId && !/^G-[A-Z0-9]{6,}$/.test(gaId)) {
  console.error(`[prerender] VITE_GA_ID no parece un ID de medición de GA4 válido: ${gaId}`)
  process.exit(1)
}
// Modo de consentimiento v2: todo denegado por defecto. El aviso de cookies de Google (AdSense,
// «Privacidad y mensajes») actualiza el consentimiento cuando el visitante acepta.
const analytics = gaId
  ? `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});gtag('js',new Date());gtag('config','${gaId}');</script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>`
  : ''

// El aviso legal es obligatorio (LSSI): no se publica sin los datos del titular.
const missing = ['VITE_OWNER_NAME', 'VITE_OWNER_NIF', 'VITE_OWNER_ADDRESS'].filter((k) => !(process.env[k] || env[k]))
if (missing.length) {
  console.error(`[prerender] Faltan datos del titular (${missing.join(', ')}). Crea .env.production.local (ver .env.example).`)
  process.exit(1)
}
const adsense = client
  ? `<meta name="google-adsense-account" content="${client}" />
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>`
  : ''

const page = (url) => {
  const { html, head } = render(url)
  return template.replace('<!--app-head-->', head + (analytics ? '\n    ' + analytics : '') + (adsense ? '\n    ' + adsense : '')).replace('<!--app-html-->', html)
}

// Fecha real de última modificación de cada página (para el <lastmod> del sitemap).
// Se guarda una huella del contenido principal (<main>) en scripts/lastmod.json: si el contenido cambia,
// la fecha pasa a ser la de este build; si no cambia, se conserva la fecha anterior.
// Ese archivo se versiona en git: después de compilar con cambios de contenido, haz commit de él.
const LASTMOD_FILE = resolve('scripts/lastmod.json')
const SEED_DATE = '2026-11-19T10:10:49+01:00' // último cambio de contenido antes de llevar este registro
const lastmod = existsSync(LASTMOD_FILE) ? JSON.parse(readFileSync(LASTMOD_FILE, 'utf8')) : {}
const firstRun = !existsSync(LASTMOD_FILE)
/** Fecha y hora actual en ISO 8601 con la zona horaria de Madrid, p. ej. 2026-11-21T10:00:00+01:00 */
function nowMadrid() {
  const d = new Date()
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZoneName: 'longOffset' })
      .formatToParts(d)
      .map((p) => [p.type, p.value]),
  )
  const off = parts.timeZoneName.replace('GMT', '') || '+00:00'
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${off}`
}
const buildDate = nowMadrid()

for (const r of routes) {
  const out = r.path === '/' ? resolve(dist, 'index.html') : resolve(dist, r.path.slice(1) + '.html')
  mkdirSync(dirname(out), { recursive: true })
  const html = page(r.path)
  // Solo cuenta el texto y los enlaces del contenido principal: un cambio de diseño (clases, maquetación) no es una modificación.
  const mainHtml = html.match(/<main[\s\S]*<\/main>/)?.[0] ?? html
  const main = mainHtml
    .replace(/<a [^>]*?href="([^"]*)"[^>]*>/g, ' [$1] ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
  const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16)
  const hash = sha(main)
  const prev = lastmod[r.path]
  if (!prev) lastmod[r.path] = { hash, v: 2, date: firstRun ? SEED_DATE : buildDate }
  else if (prev.v !== 2) {
    // Registro antiguo (huella del HTML completo): si ese HTML no ha cambiado, se conserva la fecha.
    lastmod[r.path] = { hash, v: 2, date: prev.hash === sha(mainHtml) ? prev.date : buildDate }
  } else if (prev.hash !== hash) lastmod[r.path] = { hash, v: 2, date: buildDate }
  // Artículos: la fecha de modificación (JSON-LD y Open Graph) es la misma que la del sitemap.
  const modified = lastmod[r.path].date
  writeFileSync(
    out,
    html
      .replace(/"dateModified":"[^"]*"/, `"dateModified":"${modified}"`)
      .replace(/(<meta property="article:modified_time" content=")[^"]*/, `$1${modified}`),
  )
  console.log('[prerender]', r.path, '→', out.replace(dist, 'dist'), '· lastmod', lastmod[r.path].date)
}
writeFileSync(resolve(dist, '404.html'), page('/404'))
for (const k of Object.keys(lastmod)) if (!routes.some((r) => r.path === k)) delete lastmod[k]
writeFileSync(LASTMOD_FILE, JSON.stringify(lastmod, null, 2) + '\n')

const urls = routes
  .filter((r) => !r.noindex)
  .map((r) => `  <url><loc>${siteUrl}${r.path === '/' ? '/' : r.path}</loc><lastmod>${lastmod[r.path].date}</lastmod></url>`)
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
)
writeFileSync(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
if (client) writeFileSync(resolve(dist, 'ads.txt'), `google.com, ${client.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`)
rmSync(resolve('dist-ssr'), { recursive: true, force: true })
console.log('[prerender] sitemap.xml y robots.txt generados para', siteUrl)
