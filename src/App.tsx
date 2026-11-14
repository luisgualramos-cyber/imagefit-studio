import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Layout from './components/Layout'
import { Home, NotFound, ToolPage } from './pages/Pages'
import { AvisoLegal, Contacto, Privacy } from './pages/Legal'
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
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
