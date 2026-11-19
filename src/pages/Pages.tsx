import { Link } from 'react-router'
import AdSlot from '../components/AdSlot'
import { Faq, HowItWorks, PrivacyNote, ToolsGrid, UseCases } from '../components/Sections'
import Example from '../components/Example'
import { IconShield } from '../components/Icons'
import Studio from '../studio/Studio'
import { HOME_FAQS, faqsFor } from '../content/faqs'
import { QUICK_PAGES, TOOL_PAGES } from '../content/pages'
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
                Redimensiona tus imágenes al tamaño <span className="text-accent">exacto</span> que necesitas
              </h1>
            </div>
            <p className="max-w-md text-[15px] text-muted md:text-right">
              Redimensiona, comprime, convierte y adapta fotos a Instagram, TikTok, YouTube, tiendas online y webs. Una imagen o cien a la vez.
            </p>
          </div>
          <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-local/25 bg-local-soft px-4 py-3 text-sm text-ink sm:flex-row sm:items-center sm:gap-3">
            <span className="flex items-center gap-2 font-bold text-local">
              <IconShield size={18} /> Tus fotos nunca salen de tu dispositivo
            </span>
            <span className="text-ink/80">
              A diferencia de la mayoría de webs de imágenes, aquí no se suben a ningún servidor: todo se hace en tu navegador.{' '}
              <Link to="/privacidad#como-comprobarlo" className="font-semibold text-local underline underline-offset-2">
                Cómo comprobarlo
              </Link>
            </span>
          </div>
          <Studio />
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AdSlot position="below-tool" format="horizontal" />
      </div>
      <HowItWorks />
      <PrivacyNote />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
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
        <h3 className="mt-12 text-xl font-bold">Usos populares</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {QUICK_PAGES.map((q) => (
            <li key={q.to}>
              <Link to={q.to} className="inline-block rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:border-ink/40 hover:text-accent-dark">
                {q.label}
              </Link>
            </li>
          ))}
        </ul>
        <AdSlot position="after-tools" format="horizontal" />
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
      <Example path={path} />
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
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Usos populares">
          {QUICK_PAGES.filter((q) => q.to !== path).map((q) => (
            <li key={q.to}>
              <Link to={q.to} className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-sm hover:border-ink/40 hover:text-accent-dark">
                {q.label}
              </Link>
            </li>
          ))}
        </ul>
        <AdSlot position="after-tools" format="horizontal" />
      </section>
    </>
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
