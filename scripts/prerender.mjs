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
const adsense = client
  ? `<meta name="google-adsense-account" content="${client}" />
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>`
  : ''

const page = (url) => {
  const { html, head } = render(url)
  return template.replace('<!--app-head-->', head + (adsense ? '\n    ' + adsense : '')).replace('<!--app-html-->', html)
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
