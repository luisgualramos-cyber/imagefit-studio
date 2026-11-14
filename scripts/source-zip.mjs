// Genera dist/imagefit-studio-codigo-fuente.zip con el código fuente del commit actual.
// Cumple la AGPL-3.0 (requerida por @imgly/background-removal): el código de la versión
// publicada queda disponible para cualquier visitante desde el pie de la web.
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const out = resolve('dist/imagefit-studio-codigo-fuente.zip')
try {
  const dirty = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()
  if (dirty) console.warn('[source-zip] Aviso: hay cambios sin commit; el ZIP contiene el último commit. Haz commit antes de publicar.')
  execFileSync('git', ['archive', '--format=zip', '--prefix=imagefit-studio/', '-o', out, 'HEAD'])
  console.log('[source-zip] Código fuente empaquetado en dist/imagefit-studio-codigo-fuente.zip')
} catch (e) {
  console.error('[source-zip] No se pudo generar el ZIP del código fuente (¿git no disponible?):', e.message)
  process.exit(1)
}
