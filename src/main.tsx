import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import './index.css'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// El HTML de cada ruta viene prerenderizado (SEO). Se hidrata en lugar de volver a pintarlo,
// así el contenido visible no se reemplaza al cargar el JavaScript (mejor LCP).
if (container.firstElementChild) hydrateRoot(container, app)
else createRoot(container).render(app)
