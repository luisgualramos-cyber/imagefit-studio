import { Link } from 'react-router'
import AdSlot from '../components/AdSlot'
import { Faq, HowItWorks, PrivacyNote, ToolsGrid, UseCases } from '../components/Sections'
import { IconShield } from '../components/Icons'
import Studio from '../studio/Studio'
import { HOME_FAQS, faqsFor } from '../content/faqs'
import { TOOL_PAGES } from '../content/pages'
import { routeMeta } from '../seo/routes'

export function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-accent/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-6 md:px-6 md:pt-12">
          <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-local-soft px-3 py-1 text-xs font-semibold text-local">
                <IconShield size={14} /> Gratis · Sin registro · Procesado en tu navegador
              </p>
              <h1 className="text-4xl leading-[1.05] font-extrabold md:text-6xl">
                Tus imágenes, al tamaño <span className="text-accent">exacto</span> que necesitas.
              </h1>
            </div>
            <p className="max-w-md text-[15px] text-muted md:text-right">
              Redimensiona, comprime, convierte y adapta fotos a Instagram, TikTok, YouTube, tiendas online y webs. Una imagen o cien a la vez.
            </p>
          </div>
          <Studio />
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AdSlot position="below-tool" format="horizontal" />
      </div>
      <HowItWorks />
      <PrivacyNote />
      <div className="mx-auto max-w-7xl px-4 pt-10 md:px-6">
        <AdSlot position="between-sections" format="inline" />
      </div>
      <section id="herramientas" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 md:px-6" aria-labelledby="herr-title">
        <h2 id="herr-title" className="text-3xl font-bold md:text-4xl">
          Todas las herramientas
        </h2>
        <p className="mt-2 max-w-2xl text-muted">Cada herramienta tiene su propia página con la configuración más habitual ya preparada.</p>
        <div className="mt-8">
          <ToolsGrid />
        </div>
        <div className="mt-8">
          <AdSlot position="after-tools" format="horizontal" />
        </div>
      </section>
      <UseCases />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Faq items={HOME_FAQS} />
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <AdSlot position="sidebar" format="rectangle" />
          </div>
        </div>
      </div>
    </>
  )
}

export function ToolPage({ path }: { path: string }) {
  const meta = routeMeta(path)
  const page = TOOL_PAGES[path]
  const faqs = faqsFor(path)
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-6 pb-6 md:px-6 md:pt-10">
        <nav aria-label="Migas de pan" className="mb-4 text-xs text-muted">
          <Link to="/" className="hover:text-ink">
            Inicio
          </Link>{' '}
          / <span className="text-ink">{meta.name}</span>
        </nav>
        <div className="mb-6 max-w-3xl">
          <h1 className="text-3xl leading-tight font-extrabold md:text-5xl">{page.h1}</h1>
          <p className="mt-3 text-[15px] text-muted md:text-base">{page.lead}</p>
        </div>
        {page.tool}
      </section>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AdSlot position="below-tool" format="horizontal" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="prose-if max-w-3xl">{page.body}</article>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <AdSlot position="sidebar" format="rectangle" />
          </div>
        </aside>
      </div>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AdSlot position="between-sections" format="inline" />
      </div>
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-6">
        <Faq items={faqs} />
      </div>
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6" aria-labelledby="otras">
        <h2 id="otras" className="text-2xl font-bold md:text-3xl">
          Otras herramientas
        </h2>
        <div className="mt-6">
          <ToolsGrid exclude={path} />
        </div>
        <div className="mt-8">
          <AdSlot position="after-tools" format="horizontal" />
        </div>
      </section>
    </>
  )
}

export function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <article className="prose-if">
        <h1 className="text-4xl font-extrabold">Privacidad y cookies</h1>
        <p>Última actualización: noviembre de 2026.</p>
        <h2>Tus imágenes</h2>
        <p>
          ImageFit Studio procesa las imágenes en tu navegador. Redimensionar, recortar, comprimir, convertir, procesar por lotes, crear el ZIP, el encuadre inteligente, la eliminación de fondo y los rellenos locales de ampliación se ejecutan en tu dispositivo. Las imágenes no se envían a nuestros servidores ni se almacenan.
        </p>
        <h2>Servicios externos</h2>
        <ul>
          <li>
            <b>Modelos de IA en el navegador.</b> Para el encuadre inteligente se descargan los modelos de MediaPipe desde los servidores de Google (storage.googleapis.com). Para la eliminación de fondo se descarga el modelo IS-Net desde la CDN de IMG.LY (staticimgly.com). Solo se descargan los modelos; tus imágenes no se envían. Estos proveedores pueden registrar datos técnicos de la descarga, como tu dirección IP.
          </li>
          <li>
            <b>Ampliación con IA generativa (opcional).</b> Si está activada y la usas tras confirmarlo, se envía una copia reducida de tu imagen a Stability AI a través de nuestra función de servidor, que no la guarda. Stability AI la procesa según su propia política de privacidad.
          </li>
          <li>
            <b>Tipografías.</b> Las fuentes se cargan desde Google Fonts.
          </li>
          <li>
            <b>Alojamiento.</b> La web está alojada en Vercel, que puede registrar datos técnicos de acceso (IP, navegador) por motivos de seguridad.
          </li>
        </ul>
        <h2>Cookies y publicidad</h2>
        <p>
          Actualmente ImageFit Studio no usa cookies propias. En el futuro la web podrá mostrar anuncios de Google AdSense, que utilizan cookies para mostrar y medir anuncios. Antes de activarlos se mostrará un aviso de consentimiento que te permitirá aceptar o rechazar las cookies no necesarias. Puedes obtener más información sobre cómo usa Google los datos en policies.google.com/technologies/ads.
        </p>
        <h2>Código abierto</h2>
        <p>
          ImageFit Studio se distribuye bajo la licencia AGPL-3.0. Puedes descargar el código fuente completo de la versión publicada desde el enlace «Código fuente» del pie de página.
        </p>
        <h2>Metadatos</h2>
        <p>Las imágenes generadas no conservan los metadatos EXIF del original, como la ubicación GPS o el modelo de cámara.</p>
      </article>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-6">
      <p className="font-display text-7xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 text-3xl font-bold">Esta página no existe</h1>
      <p className="mt-2 text-muted">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
      <Link to="/" className="btn btn-primary mt-8">
        Ir al preparador de imágenes
      </Link>
      <div className="mt-14 text-left">
        <ToolsGrid />
      </div>
    </div>
  )
}
