import { Link } from 'react-router'

/** Política de cookies (LSSI art. 22.2 y Guía sobre el uso de cookies de la AEPD). */
const UPDATED = '23 de noviembre de 2026'

type Fila = { nombre: string; proveedor: string; finalidad: string; duracion: string; tipo: string }

const NECESARIAS: Fila[] = [
  {
    nombre: 'cookie-consent (almacenamiento local)',
    proveedor: 'ImageFit Studio',
    finalidad: 'Recordar si aceptas o rechazas cada tipo de cookie, y cuándo lo decidiste, para no volver a preguntarte en cada página.',
    duracion: '12 meses',
    tipo: 'Propia',
  },
]

const ANALITICAS: Fila[] = [
  { nombre: '_ga', proveedor: 'Google (Google Analytics)', finalidad: 'Distinguir visitantes de forma anónima para contar visitas y páginas vistas de forma agregada.', duracion: '2 años', tipo: 'Propia, gestionada por Google' },
  { nombre: '_ga_LVHQDG9Q3C', proveedor: 'Google (Google Analytics)', finalidad: 'Mantener el estado de la sesión (número de visitas, páginas de la visita).', duracion: '2 años', tipo: 'Propia, gestionada por Google' },
]

const PUBLICIDAD: Fila[] = [
  { nombre: '__gads', proveedor: 'Google (AdSense)', finalidad: 'Mostrar anuncios, limitar cuántas veces ves el mismo y medir su rendimiento.', duracion: '13 meses', tipo: 'Propia, gestionada por Google' },
  { nombre: '__gpi', proveedor: 'Google (AdSense)', finalidad: 'Igual que __gads: frecuencia de los anuncios y estadísticas.', duracion: '13 meses', tipo: 'Propia, gestionada por Google' },
  { nombre: '__eoi', proveedor: 'Google (AdSense)', finalidad: 'Seguridad y prevención del fraude en los anuncios.', duracion: '6 meses', tipo: 'Propia, gestionada por Google' },
  { nombre: 'IDE', proveedor: 'Google (doubleclick.net)', finalidad: 'Mostrar anuncios personalizados según tu navegación y medir su eficacia.', duracion: '13 meses', tipo: 'De terceros' },
  { nombre: 'test_cookie', proveedor: 'Google (doubleclick.net)', finalidad: 'Comprobar si el navegador admite cookies.', duracion: '15 minutos', tipo: 'De terceros' },
  { nombre: 'NID', proveedor: 'Google (google.com)', finalidad: 'Recordar tus preferencias en Google y mostrar anuncios de Google personalizados.', duracion: '6 meses', tipo: 'De terceros' },
]

function Tabla({ filas }: { filas: Fila[] }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Proveedor</th>
            <th>Finalidad</th>
            <th>Duración</th>
            <th>Propia o de terceros</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.nombre}>
              <td><code>{f.nombre}</code></td>
              <td>{f.proveedor}</td>
              <td>{f.finalidad}</td>
              <td>{f.duracion}</td>
              <td>{f.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const Configurar = ({ children }: { children: string }) => (
  <button type="button" data-cookie-settings className="btn btn-dark mt-2">
    {children}
  </button>
)

export function CookiePolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <article className="prose-if">
        <h1 className="text-4xl font-extrabold">Política de cookies</h1>
        <p>Última actualización: {UPDATED}.</p>

        <h2>Qué son las cookies</h2>
        <p>
          Las cookies son pequeños archivos que una web guarda en tu navegador para recordar información entre una página y otra o entre visitas. Algunas son imprescindibles para que la web funcione; otras sirven para medir las visitas o para mostrar publicidad, y esas solo se instalan si das tu permiso. En esta política llamamos también «cookies» a tecnologías parecidas, como el almacenamiento local del navegador.
        </p>

        <h2>Qué cookies usamos</h2>
        <p>
          ImageFit Studio procesa tus imágenes en tu navegador y no necesita cookies para funcionar. Usamos estas, agrupadas por tipo. Las analíticas y las de publicidad <b>no se instalan hasta que las aceptas</b>:
        </p>
        <h3>Necesarias (siempre activas)</h3>
        <Tabla filas={NECESARIAS} />
        <h3>Analíticas (solo si las aceptas)</h3>
        <Tabla filas={ANALITICAS} />
        <h3>Publicidad (solo si las aceptas)</h3>
        <p>
          Google AdSense instala unas u otras según los anuncios que se muestren; esta es la lista de las que usa habitualmente. Las tres primeras se guardan con el dominio de esta web y las demás con dominios de Google. Mientras no aceptes la publicidad, la web no pide anuncios a Google, así que no se instala ninguna de estas cookies (y no verás anuncios).
        </p>
        <Tabla filas={PUBLICIDAD} />
        <p>
          Google puede cambiar el nombre o la duración de sus cookies. Puedes consultar la lista oficial en{' '}
          <a href="https://policies.google.com/technologies/cookies" rel="noopener" target="_blank">policies.google.com/technologies/cookies</a>.
        </p>
        <p>
          Además usamos Cloudflare Web Analytics, que cuenta las visitas de forma agregada <b>sin cookies</b> y sin guardar nada en tu dispositivo.
        </p>

        <h2 id="configurar">Cómo aceptar, rechazar o cambiar tu elección</h2>
        <p>
          La primera vez que entras te mostramos un aviso con tres botones: «Aceptar todas», «Rechazar todas» y «Configurar», donde puedes elegir por tipo (las opcionales empiezan desactivadas). Puedes usar la web igual aunque no aceptes nada, y seguir navegando o desplazarte por la página no cuenta como aceptar.
        </p>
        <p>
          Puedes cambiar de opinión o retirar tu consentimiento cuando quieras desde el enlace «Configurar cookies» del pie de página o con este botón. Si retiras el permiso, borramos las cookies de Google Analytics y de AdSense guardadas con el dominio de esta web. Tu elección se guarda 12 meses; después te lo volvemos a preguntar.
        </p>
        <Configurar>Configurar cookies</Configurar>

        <h2>Cómo borrar las cookies desde el navegador</h2>
        <p>También puedes bloquear o borrar las cookies desde tu navegador:</p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647?hl=es" rel="noopener" target="_blank">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/es/kb/Borrar%20cookies" rel="noopener" target="_blank">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" rel="noopener" target="_blank">Safari (Mac)</a> y <a href="https://support.apple.com/es-es/105082" rel="noopener" target="_blank">Safari (iPhone y iPad)</a></li>
          <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" rel="noopener" target="_blank">Microsoft Edge</a></li>
        </ul>
        <p>Si bloqueas todas las cookies, la web seguirá funcionando, pero te volveremos a mostrar el aviso en cada visita.</p>

        <h2>Más información</h2>
        <ul>
          <li>
            Cómo trata Google los datos:{' '}
            <a href="https://policies.google.com/privacy" rel="noopener" target="_blank">política de privacidad de Google</a> y{' '}
            <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">cómo usa Google la información de los sitios que usan sus servicios</a>.
          </li>
          <li>
            Cómo tratamos tus datos en ImageFit Studio: <Link to="/privacidad">política de privacidad</Link>.
          </li>
        </ul>
      </article>
    </div>
  )
}
