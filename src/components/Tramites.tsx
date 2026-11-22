import { Link } from 'react-router'
import { RELATED, TRAMITES } from '../content/tramites'

/** Enlaces a herramientas y trámites relacionados con la página actual (sin listas, para no heredar el estilo de los artículos). */
export function RelatedLinks({ path }: { path: string }) {
  const block = RELATED[path]
  if (!block) return null
  return (
    <nav aria-labelledby="relacionados-titulo" className="not-prose mt-10 rounded-2xl border border-line bg-white p-5 md:p-6">
      <h2 id="relacionados-titulo" className="text-xl font-bold md:text-2xl">
        {block.title}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {block.links.map((l) => (
          <div key={l.to} className="rounded-xl bg-paper p-4">
            <Link to={l.to} className="font-semibold text-accent-dark underline underline-offset-2">
              {l.label}
            </Link>
            <p className="mt-1 text-sm text-muted">{l.why}</p>
          </div>
        ))}
      </div>
    </nav>
  )
}
import { IconChevron } from './Icons'

/** Bloque destacado de la portada: fotos para trámites oficiales en España. */
export function TramitesBlock() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6" aria-labelledby="tramites-titulo">
      <div className="rounded-[1.6rem] border border-line bg-white p-6 md:p-10">
        <p className="text-xs font-semibold tracking-wide text-accent-dark uppercase">España</p>
        <h2 id="tramites-titulo" className="mt-1 text-3xl font-bold md:text-4xl">
          Fotos para trámites oficiales en España
        </h2>
        <p className="mt-2 max-w-3xl text-muted">
          La herramienta ya viene configurada con la medida de cada trámite, y los requisitos están sacados de la fuente oficial (BOE, Ministerio del Interior, Policía Nacional y DGT), con su enlace y la fecha en que los revisamos. Tu foto no sale de tu dispositivo.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRAMITES.map((t) => (
            <li key={t.to} className="flex flex-col rounded-2xl border border-line bg-paper p-5">
              <h3 className="text-[17px] font-bold">{t.name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted">{t.foto}</p>
              {t.source ? (
                <p className="mt-3 text-xs text-muted">
                  Fuente:{' '}
                  <a href={t.source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
                    {t.source.label}
                  </a>
                  . Revisado el {t.reviewed}.
                </p>
              ) : null}
              <Link to={t.to} className="mt-4 flex items-center gap-1 text-sm font-semibold text-accent-dark hover:underline">
                {t.cta} <IconChevron size={15} />
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/fotos-tramites-espana" className="btn btn-dark mt-8">
          Ver todos los trámites y sus requisitos
        </Link>
      </div>
    </section>
  )
}
