import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import AdSlot from './AdSlot'
import { IconMenu, IconX } from './Icons'
import { TOOLS } from './Sections'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="ImageFit Studio, inicio">
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="16" fill={light ? '#fff' : '#14131f'} />
        <path d="M14 24V14h10M40 14h10v10M50 40v10H40M24 50H14V40" fill="none" stroke="#ff5a2c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="32" r="8" fill={light ? '#14131f' : '#fff'} />
      </svg>
      <span className={`font-display text-[19px] leading-none font-extrabold ${light ? 'text-white' : 'text-ink'}`}>
        ImageFit<span className="font-semibold text-accent"> Studio</span>
      </span>
    </Link>
  )
}

const NAV = [
  { to: '/redimensionar-imagenes', label: 'Redimensionar' },
  { to: '/comprimir-imagenes', label: 'Comprimir' },
  { to: '/convertir-imagenes', label: 'Convertir' },
  { to: '/imagenes-para-redes-sociales', label: 'Redes sociales' },
  { to: '/fotos-para-tienda-online', label: 'Tiendas online' },
]

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Herramientas principales">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-ink text-white' : 'text-ink-2 hover:bg-black/5'}`}
            >
              {n.label}
            </NavLink>
          ))}
          <Link to="/#herramientas" className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-black/5">
            Más
          </Link>
        </nav>
        <button type="button" className="grid size-10 place-items-center rounded-lg lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menú">
          {open ? <IconX /> : <IconMenu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-line bg-paper px-4 py-3 lg:hidden" aria-label="Menú móvil">
          <ul className="grid grid-cols-2 gap-1.5">
            {TOOLS.map((t) => (
              <li key={t.to}>
                <Link to={t.to} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-sm font-medium">
                  <t.icon size={17} className="text-accent" /> {t.short}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-6 bg-ink text-white/75">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_1fr] md:px-6">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Herramientas online para preparar imágenes: redimensionar, comprimir, convertir y adaptar fotos a cualquier formato. Gratis, sin registro y con el procesamiento en tu navegador.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold tracking-wide text-white uppercase">Herramientas</h2>
          <ul className="space-y-2 text-sm">
            {TOOLS.map((t) => (
              <li key={t.to}>
                <Link to={t.to} className="hover:text-white">
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold tracking-wide text-white uppercase">Conversiones</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/convertir-jpg-a-png" className="hover:text-white">Convertir JPG a PNG</Link></li>
            <li><Link to="/convertir-png-a-webp" className="hover:text-white">Convertir PNG a WEBP</Link></li>
            <li><Link to="/convertir-imagenes" className="hover:text-white">JPG, PNG, WEBP y AVIF</Link></li>
          </ul>
          <h2 className="mt-6 mb-3 text-sm font-bold tracking-wide text-white uppercase">Información</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacidad" className="hover:text-white">Privacidad y cookies</Link></li>
            <li><Link to="/#preguntas" className="hover:text-white">Preguntas frecuentes</Link></li>
            <li><a href="/imagefit-studio-codigo-fuente.zip" download className="hover:text-white">Código fuente (AGPL-3.0)</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-white/50 md:px-6">© {new Date().getFullYear()} ImageFit Studio · Tus imágenes no salen de tu dispositivo salvo que uses la ampliación con IA generativa.</p>
      </div>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-6">
        <AdSlot position="page-bottom" format="footer" />
      </div>
      <Footer />
    </div>
  )
}
