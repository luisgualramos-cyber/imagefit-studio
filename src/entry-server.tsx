import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { headHtml } from './seo/head'
import { ROUTES, SITE_URL } from './seo/routes'

export function render(url: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return { html, head: headHtml(url) }
}

export const routes = ROUTES
export const siteUrl = SITE_URL
