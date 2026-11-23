/*!
 * Aviso de cookies propio (LSSI art. 22.2 + Guía de cookies de la AEPD) con Google Consent Mode v2.
 * Mismo archivo en imagefitstudio.com y llaveros3d.eu. Sin dependencias ni servicios externos.
 *
 * Cómo encaja:
 *  1. En el <head>, ANTES de Google Analytics y AdSense, un pequeño <script> en línea fija el
 *     consentimiento por defecto (todo denegado) y aplica la elección guardada (clave CLAVE).
 *  2. Este archivo (cargado con «defer») muestra el aviso, guarda la elección y llama a
 *     gtag('consent','update', ...).
 *  3. Cualquier elemento con el atributo data-cookie-settings (o un enlace a #configurar-cookies)
 *     vuelve a abrir el panel de configuración.
 *
 * FUTURO: cuando se active la herramienta de consentimiento de Google (AdSense → «Privacidad y
 * mensajes», certificada IAB TCF), basta con quitar el bloque <!-- consentimiento-cookies --> del
 * <head> (y este archivo) y apuntar los enlaces data-cookie-settings a googlefc.showRevocationMessage().
 */
(function () {
  'use strict'
  var CLAVE = 'cookie-consent' // localStorage: {v, fecha, t, analiticas, publicidad}
  var VERSION = 1
  var CADUCIDAD = 365 * 24 * 60 * 60 * 1000 // 12 meses: después se vuelve a preguntar
  var yo = document.currentScript
  var POLITICA = (yo && yo.getAttribute('data-politica')) || '/politica-cookies/'

  var gtag =
    window.gtag ||
    function () {
      ;(window.dataLayer = window.dataLayer || []).push(arguments)
    }

  function leer() {
    try {
      var c = JSON.parse(localStorage.getItem(CLAVE) || 'null')
      if (c && c.v === VERSION && Date.now() - c.t < CADUCIDAD) return c
    } catch (e) {}
    return null
  }

  var enMemoria = null // si localStorage no está disponible, la elección vale para esta visita
  function guardar(analiticas, publicidad) {
    var antes = leer() || enMemoria
    var c = { v: VERSION, fecha: new Date().toISOString(), t: Date.now(), analiticas: !!analiticas, publicidad: !!publicidad }
    enMemoria = c
    try {
      localStorage.setItem(CLAVE, JSON.stringify(c))
    } catch (e) {}
    var ad = publicidad ? 'granted' : 'denied'
    gtag('consent', 'update', {
      analytics_storage: analiticas ? 'granted' : 'denied',
      ad_storage: ad,
      ad_user_data: ad,
      ad_personalization: ad,
    })
    // AdSense: solo pide anuncios si se acepta la publicidad (la pausa se fija en el <head>).
    ;(window.adsbygoogle = window.adsbygoogle || []).pauseAdRequests = publicidad ? 0 : 1
    // Retirada del consentimiento: borra las cookies propias que se hubieran instalado.
    if (!analiticas) borrarCookies(/^_ga(_|$)|^_gid$|^_gat/)
    if (!publicidad) borrarCookies(/^__gads$|^__gpi$|^__eoi$|^FCNEC$/)
    try {
      document.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: c }))
    } catch (e) {}
    return antes
  }

  function borrarCookies(patron) {
    var partes = location.hostname.split('.')
    var dominios = ['']
    for (var i = 0; i < partes.length - 1; i++) dominios.push(';domain=.' + partes.slice(i).join('.'))
    document.cookie.split(';').forEach(function (par) {
      var nombre = par.split('=')[0].trim()
      if (!patron.test(nombre)) return
      dominios.forEach(function (d) {
        document.cookie = nombre + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + d
      })
    })
  }

  /* ---------- Interfaz ---------- */
  var CSS =
    '.ckc,.ckc *{box-sizing:border-box}' +
    '.ckc{--ckc-ink:var(--color-ink,#14161a);--ckc-line:var(--color-line,#e3e3e3);--ckc-muted:var(--color-muted,var(--color-ink-2,#4a505a));--ckc-accent:var(--color-accent-dark,var(--color-accent-strong,#1f45d6));' +
    'font-family:var(--font-sans,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif);color:var(--ckc-ink);font-size:14px;line-height:1.5;text-align:left}' +
    '.ckc-banner{position:fixed;z-index:2147483000;left:12px;right:12px;bottom:12px;margin:0 auto;max-width:880px;background:#fff;border:1px solid var(--ckc-line);border-radius:14px;box-shadow:0 10px 40px -10px rgba(0,0,0,.35);padding:16px 18px;max-height:calc(100vh - 24px);overflow:auto}' +
    '.ckc-t{margin:0 0 4px;font-size:15px;font-weight:700}' +
    '.ckc p{margin:0}.ckc a{color:var(--ckc-accent);text-decoration:underline}' +
    '.ckc-acc{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}' +
    '.ckc-b{flex:1 1 150px;min-height:44px;padding:10px 14px;border-radius:10px;border:1.5px solid var(--ckc-ink);background:var(--ckc-ink);color:#fff;font:inherit;font-weight:600;cursor:pointer}' +
    '.ckc-b:hover{opacity:.88}.ckc-b:focus-visible,.ckc-sw input:focus-visible+span,.ckc-x:focus-visible{outline:3px solid var(--ckc-accent);outline-offset:2px}' +
    '.ckc-fondo{position:fixed;z-index:2147483001;inset:0;background:rgba(10,10,20,.45);display:flex;align-items:flex-end;justify-content:center;padding:12px}' +
    '@media (min-width:640px){.ckc-fondo{align-items:center}}' +
    '@media (max-width:480px){.ckc-banner{left:8px;right:8px;bottom:8px;padding:12px 14px;font-size:13.5px}.ckc-acc{gap:6px;margin-top:10px}.ckc-b{flex-basis:120px;min-height:42px;padding:8px 10px}}' +
    '.ckc-panel{position:relative;background:#fff;border-radius:14px;max-width:560px;width:100%;max-height:calc(100vh - 24px);overflow:auto;padding:20px;box-shadow:0 20px 60px -15px rgba(0,0,0,.45)}' +
    '.ckc-panel h2{margin:0 32px 6px 0;font-size:18px;font-weight:700}' +
    '.ckc-x{position:absolute;top:10px;right:10px;width:36px;height:36px;border:0;border-radius:8px;background:transparent;font-size:22px;line-height:1;cursor:pointer;color:var(--ckc-ink)}' +
    '.ckc-cat{border:1px solid var(--ckc-line);border-radius:10px;padding:12px 14px;margin-top:10px}' +
    '.ckc-fila{display:flex;align-items:center;justify-content:space-between;gap:12px}' +
    '.ckc-fila strong{font-size:15px}.ckc-cat p{margin-top:4px;color:var(--ckc-muted);font-size:13px}' +
    '.ckc-sw{position:relative;display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;white-space:nowrap}' +
    '.ckc-sw input{position:absolute;opacity:0;width:44px;height:26px;margin:0;cursor:pointer}' +
    '.ckc-sw span{position:relative;width:44px;height:26px;border-radius:99px;background:#c4c4cc;transition:background .15s;flex:none}' +
    '.ckc-sw span:after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .15s}' +
    '.ckc-sw input:checked+span{background:var(--ckc-accent)}.ckc-sw input:checked+span:after{transform:translateX(18px)}' +
    '.ckc-sw input:disabled+span{opacity:.6}.ckc-sw input:disabled{cursor:not-allowed}' +
    '@media (prefers-reduced-motion:reduce){.ckc-sw span,.ckc-sw span:after{transition:none}}'

  function estilos() {
    if (document.getElementById('ckc-css')) return
    var s = document.createElement('style')
    s.id = 'ckc-css'
    s.textContent = CSS
    document.head.appendChild(s)
  }

  function el(html) {
    var d = document.createElement('div')
    d.innerHTML = html
    return d.firstElementChild
  }

  var banner = null
  var panel = null
  var foco = null

  function botones(conGuardar) {
    return (
      '<div class="ckc-acc">' +
      '<button type="button" class="ckc-b" data-ckc="aceptar">Aceptar todas</button>' +
      '<button type="button" class="ckc-b" data-ckc="rechazar">Rechazar todas</button>' +
      (conGuardar
        ? '<button type="button" class="ckc-b" data-ckc="guardar">Guardar selección</button>'
        : '<button type="button" class="ckc-b" data-ckc="configurar">Configurar</button>') +
      '</div>'
    )
  }

  function mostrarBanner() {
    if (banner) return
    estilos()
    banner = el(
      '<section class="ckc ckc-banner" role="region" aria-label="Aviso de cookies">' +
        '<p class="ckc-t">Usamos cookies</p>' +
        '<p>Usamos cookies <strong>analíticas</strong> (Google Analytics) para medir las visitas y <strong>publicitarias</strong> (Google AdSense) para mostrar y medir anuncios. Solo se instalan si las aceptas, y puedes cambiar tu elección cuando quieras en «Configurar cookies», al pie de la página. ' +
        '<a href="' + POLITICA + '">Política de cookies</a>.</p>' +
        botones(false) +
        '</section>',
    )
    banner.addEventListener('click', alPulsar)
    document.body.appendChild(banner)
  }

  function cerrarBanner() {
    if (banner) banner.remove()
    banner = null
  }

  function categoria(id, titulo, texto, marcada, fija) {
    return (
      '<div class="ckc-cat"><div class="ckc-fila"><strong id="ckc-' + id + '-t">' + titulo + '</strong>' +
      '<label class="ckc-sw"><input type="checkbox" id="ckc-' + id + '" aria-labelledby="ckc-' + id + '-t"' +
      (marcada ? ' checked' : '') + (fija ? ' disabled' : '') + '><span aria-hidden="true"></span>' +
      (fija ? 'Siempre activas' : '') + '</label></div><p>' + texto + '</p></div>'
    )
  }

  function abrirPanel() {
    if (panel) return
    estilos()
    var c = leer() || enMemoria || { analiticas: false, publicidad: false }
    foco = document.activeElement
    panel = el(
      '<div class="ckc ckc-fondo">' +
        '<div class="ckc-panel" role="dialog" aria-modal="true" aria-labelledby="ckc-titulo">' +
        '<button type="button" class="ckc-x" data-ckc="cerrar" aria-label="Cerrar sin cambiar nada">×</button>' +
        '<h2 id="ckc-titulo">Configurar cookies</h2>' +
        '<p>Elige qué cookies aceptas. Las opcionales están desactivadas hasta que las actives. Más detalles en la <a href="' + POLITICA + '">política de cookies</a>.</p>' +
        categoria('nec', 'Necesarias', 'Imprescindibles para que la web funcione y para recordar esta elección (se guarda en tu navegador). No se pueden desactivar.', true, true) +
        categoria('ana', 'Analíticas', 'Google Analytics: cuántas personas visitan cada página y cómo se usa la web, de forma agregada. Cookies _ga y _ga_*.', c.analiticas, false) +
        categoria('pub', 'Publicidad', 'Google AdSense: mostrar anuncios, limitar su repetición, medir su rendimiento y personalizarlos. Cookies de Google como __gads, __gpi, __eoi, IDE o NID.', c.publicidad, false) +
        botones(true) +
        '</div></div>',
    )
    panel.addEventListener('click', alPulsar)
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarPanel()
      if (e.key === 'Tab') atraparFoco(e)
    })
    document.body.appendChild(panel)
    panel.querySelector('#ckc-ana').focus()
  }

  function atraparFoco(e) {
    var f = panel.querySelectorAll('button,input:not([disabled]),a[href]')
    var primero = f[0]
    var ultimo = f[f.length - 1]
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault()
      ultimo.focus()
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault()
      primero.focus()
    }
  }

  function cerrarPanel() {
    if (!panel) return
    panel.remove()
    panel = null
    if (foco && foco.focus && document.contains(foco)) foco.focus()
    // Si se cierra sin decidir, el aviso sigue visible: nada se acepta por omisión.
    if (!leer() && !enMemoria) mostrarBanner()
  }

  function alPulsar(e) {
    var b = e.target.closest('[data-ckc]')
    if (!b) {
      if (panel && e.target === panel) cerrarPanel() // clic fuera del panel
      return
    }
    var accion = b.getAttribute('data-ckc')
    if (accion === 'configurar') return abrirPanel()
    if (accion === 'cerrar') return cerrarPanel()
    if (accion === 'aceptar') guardar(true, true)
    else if (accion === 'rechazar') guardar(false, false)
    else if (accion === 'guardar') guardar(panel.querySelector('#ckc-ana').checked, panel.querySelector('#ckc-pub').checked)
    cerrarPanel()
    cerrarBanner()
  }

  // Enlaces «Configurar cookies»: [data-cookie-settings] o href="...#configurar-cookies".
  // Fase de captura en window para adelantarse a otros manejadores de la página.
  window.addEventListener(
    'click',
    function (e) {
      var t = e.target.closest && e.target.closest('[data-cookie-settings],a[href$="#configurar-cookies"]')
      if (!t) return
      e.preventDefault()
      e.stopPropagation()
      abrirPanel()
    },
    true,
  )

  // API mínima por si hace falta desde la consola o desde otro script.
  window.cookieConsent = { abrir: abrirPanel, leer: leer }

  function iniciar() {
    if (location.hash === '#configurar-cookies') abrirPanel()
    else if (!leer()) mostrarBanner()
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar)
  else iniciar()
})()
