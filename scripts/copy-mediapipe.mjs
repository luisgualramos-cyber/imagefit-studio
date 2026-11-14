// Copia los binarios WASM de MediaPipe a /public para servirlos desde el propio dominio
// (sin depender de un CDN de terceros). Se ejecuta antes de dev y build.
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const src = resolve('node_modules/@mediapipe/tasks-vision/wasm')
const dest = resolve('public/mediapipe')
if (!existsSync(src)) {
  console.error('[copy-mediapipe] No se encuentra', src)
  process.exit(1)
}
mkdirSync(dest, { recursive: true })
for (const f of ['vision_wasm_internal.js', 'vision_wasm_internal.wasm']) {
  cpSync(resolve(src, f), resolve(dest, f))
}
console.log('[copy-mediapipe] WASM copiado a public/mediapipe')
