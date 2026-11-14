// Avisa a Bing (y demás buscadores compatibles con IndexNow) de todas las URLs del sitemap publicado.
// Uso, después de desplegar:  npm run indexnow
// La clave es pública por diseño: el archivo public/<clave>.txt demuestra que el dominio es nuestro.
const KEY = 'b2175af2847e169760f7410833ae3fdd'
const HOST = 'imagefitstudio.com'

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text()
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
})
console.log(`IndexNow: ${urlList.length} URLs enviadas → HTTP ${res.status}`)
if (res.status >= 400) process.exit(1)
