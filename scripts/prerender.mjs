// Genera HTML estático por ruta (SEO), sitemap.xml y robots.txt a partir del build de SSR.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const dist = resolve('dist')
const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
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

for (const r of routes) {
  const out = r.path === '/' ? resolve(dist, 'index.html') : resolve(dist, r.path.slice(1) + '.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, page(r.path))
  console.log('[prerender]', r.path, '→', out.replace(dist, 'dist'))
}
writeFileSync(resolve(dist, '404.html'), page('/404'))

const today = new Date().toISOString().slice(0, 10)
const urls = routes
  .filter((r) => !r.noindex)
  .map((r) => `  <url><loc>${siteUrl}${r.path === '/' ? '/' : r.path}</loc><lastmod>${today}</lastmod><priority>${r.priority.toFixed(1)}</priority></url>`)
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
)
writeFileSync(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
if (client) writeFileSync(resolve(dist, 'ads.txt'), `google.com, ${client.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`)
rmSync(resolve('dist-ssr'), { recursive: true, force: true })
console.log('[prerender] sitemap.xml y robots.txt generados para', siteUrl)
