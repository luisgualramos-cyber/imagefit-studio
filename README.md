# ImageFit Studio

Plataforma web de herramientas de imágenes: redimensionar, comprimir, convertir, adaptar a redes sociales, preparar fotos de producto, encuadre inteligente con IA y ampliación de fondo. Gratis, sin registro y con el procesamiento en el navegador.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router · Web Workers · WebAssembly.

## Qué se ejecuta dónde

| Función | Dónde | Tecnología |
|---|---|---|
| Redimensionar, recortar, encajar, estirar | Navegador (Web Workers) | `OffscreenCanvas`, reducción progresiva de alta calidad |
| Compresión JPG / WEBP | Navegador | Codificadores nativos + búsqueda binaria de calidad para «peso máximo» |
| Compresión PNG | Navegador | UPNG.js (deflate optimizado / cuantización a paleta) |
| AVIF | Navegador | Codificador nativo o libavif en WASM (`@jsquash/avif`) |
| Procesamiento por lotes y ZIP | Navegador | Pool de Web Workers + JSZip |
| Encuadre inteligente | Navegador | MediaPipe Tasks (BlazeFace + EfficientDet-Lite0) + nitidez + smartcrop.js como respaldo |
| Eliminar fondo (tiendas) | Navegador | `@imgly/background-removal` (modelo IS-Net fp16, ONNX Runtime Web) |
| Ampliar con desenfoque / espejo / color | Navegador | Canvas |
| **Ampliar con IA generativa** | **Servidor → Stability AI** | `functions/api/outpaint.ts` (Cloudflare) o `api/outpaint.ts` (Vercel), lógica en `server/outpaint-core.ts`; desactivada por defecto, de pago |

Descargas externas en el navegador (solo modelos, nunca las fotos): modelos MediaPipe desde `storage.googleapis.com`; modelo IS-Net y runtime ONNX desde `staticimgly.com` (~95 MB la primera vez, queda en caché). El WASM de MediaPipe se sirve desde el propio dominio (`/mediapipe`, copiado en `predev`/`prebuild`).

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc + build cliente + build SSR + prerender de todas las rutas
npm run preview    # sirve dist/
```

`npm run build` genera HTML estático por ruta (con título, descripción, canonical, Open Graph y JSON-LD), `sitemap.xml`, `robots.txt` y `404.html`.

## Variables de entorno

Ver `.env.example`. Todas son opcionales:

- `VITE_SITE_URL`: URL pública (canonical, sitemap, OG). **Cámbiala por el dominio real** (por defecto `imagefit-studio.pages.dev`) y vuelve a desplegar.
- `VITE_ADSENSE_CLIENT` y `VITE_ADSENSE_SLOT_*`: al definirlas, los huecos «ANUNCIO» pasan a ser bloques de AdSense y se inyecta el script en el HTML y `ads.txt`.
- `OUTPAINT_ENABLED=true` + `STABILITY_API_KEY`: activan la ampliación generativa. **Servicio de pago** (créditos de Stability AI). `OUTPAINT_ALLOWED_ORIGIN` restringe las peticiones a tu dominio.

## Publicidad (AdSense)

Huecos preparados (componente `src/components/AdSlot.tsx`), nunca dentro del editor ni cerca de los botones de carga/descarga:

1. `below-tool`: banner horizontal debajo de la herramienta principal.
2. `between-sections`: entre secciones de contenido.
3. `after-tools`: al final de la galería de herramientas.
4. `page-bottom`: banner inferior (en todas las páginas).
5. `sidebar`: espacio secundario lateral (escritorio).

Antes de activar AdSense en la UE hace falta un banner de consentimiento (CMP certificado por Google; AdSense ofrece uno propio en «Privacidad y mensajes») y conviene añadir un aviso legal con los datos del titular.

## Despliegue en Cloudflare Pages (recomendado)

Incluye `wrangler.toml`, `public/_headers` (caché y seguridad) y la función `functions/api/outpaint.ts`. Cloudflare Pages sirve `/ruta` desde `ruta.html` y usa `404.html` automáticamente.

```bash
npx wrangler login       # una vez, autoriza en el navegador
npm run deploy:cf        # build + despliegue en https://imagefit-studio.pages.dev
```

Variables (Ajustes del proyecto → Variables y secretos): `VITE_*` en el build; `STABILITY_API_KEY` como **secreto** y `OUTPAINT_ENABLED=true` solo si se quiere activar la IA generativa (de pago).

## Despliegue alternativo en Vercel

También funciona en Vercel (`vercel.json` + `api/outpaint.ts`): `npx vercel --prod`.

## Licencias a tener en cuenta

- `@imgly/background-removal` se distribuye bajo **AGPL-3.0**: si el sitio se publica, su código fuente debe estar disponible (p. ej., repositorio público) o adquirirse una licencia comercial de IMG.LY.
- MediaPipe (Apache-2.0), smartcrop.js (MIT), JSZip (MIT/GPLv3), UPNG.js (MIT), @jsquash/avif (Apache-2.0).
