import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Layout from './components/Layout'
import { Home, NotFound, ToolPage } from './pages/Pages'
import { AvisoLegal, Contacto, Privacy } from './pages/Legal'
import { About, FormatsGuide, SedeGuide, WebGuide } from './pages/Guides'
import { TramitesHub } from './pages/TramitesHub'
import { CookiePolicy } from './pages/Cookies'
import { TOOL_PAGES } from './content/pages'
import { applyHead } from './seo/head'

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    applyHead(pathname)
  }, [pathname])
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        {Object.keys(TOOL_PAGES).map((p) => (
          <Route key={p} path={p} element={<ToolPage key={p} path={p} />} />
        ))}
        <Route path="/fotos-tramites-espana" element={<TramitesHub />} />
        <Route path="/acerca-de" element={<About />} />
        <Route path="/guia-formatos-de-imagen" element={<FormatsGuide />} />
        <Route path="/optimizar-imagenes-para-web" element={<WebGuide />} />
        <Route path="/subir-fotos-sede-electronica" element={<SedeGuide />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="/politica-cookies" element={<CookiePolicy />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
