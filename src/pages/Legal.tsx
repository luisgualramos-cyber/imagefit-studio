import { Link } from 'react-router'

/** Datos del titular (LSSI-CE, art. 10). */
/** Se leen de .env.production.local (privado, fuera del repositorio). */
export const OWNER = {
  name: (import.meta.env.VITE_OWNER_NAME as string | undefined) ?? '',
  nif: (import.meta.env.VITE_OWNER_NIF as string | undefined) ?? '',
  address: (import.meta.env.VITE_OWNER_ADDRESS as string | undefined) ?? '',
  email: 'contacto@imagefitstudio.com',
  site: 'imagefitstudio.com',
}

const Mail = () => <a href={`mailto:${OWNER.email}`}>{OWNER.email}</a>

const UPDATED = 'noviembre de 2026'

export function AvisoLegal() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <article className="prose-if">
        <h1 className="text-4xl font-extrabold">Aviso legal</h1>
        <p>Última actualización: {UPDATED}.</p>
        <h2>Titular del sitio web</h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de {OWNER.site}:
        </p>
        <ul>
          <li><b>Titular:</b> {OWNER.name}</li>
          <li><b>NIF:</b> {OWNER.nif}</li>
          <li><b>Domicilio:</b> {OWNER.address}</li>
          <li><b>Correo electrónico:</b> <Mail /></li>
          <li><b>Sitio web:</b> https://{OWNER.site}</li>
        </ul>
        <h2>Objeto</h2>
        <p>
          ImageFit Studio ofrece de forma gratuita herramientas online para redimensionar, comprimir, convertir y adaptar imágenes. El acceso y uso del sitio atribuye la condición de usuario e implica la aceptación de este aviso legal. El sitio se financia mediante publicidad.
        </p>
        <h2>Uso del servicio</h2>
        <p>
          El usuario se compromete a utilizar las herramientas de forma lícita y a procesar únicamente imágenes sobre las que tenga los derechos necesarios. Las imágenes se procesan en el navegador del usuario y el titular no tiene acceso a ellas, salvo en la función opcional de ampliación con IA generativa descrita en la <Link to="/privacidad">política de privacidad</Link>.
        </p>
        <h2>Responsabilidad</h2>
        <p>
          Las herramientas se ofrecen «tal cual». El titular procura que funcionen correctamente, pero no garantiza la ausencia de errores ni se hace responsable de los daños derivados del uso de los archivos generados. Se recomienda conservar siempre una copia de las imágenes originales. Los tamaños y requisitos indicados para redes sociales, tiendas o documentos oficiales son orientativos y pueden cambiar; consulta siempre las indicaciones oficiales de cada plataforma u organismo.
        </p>
        <h2>Propiedad intelectual</h2>
        <p>
          Los textos, el diseño y la marca ImageFit Studio pertenecen a su titular. El código fuente del sitio se distribuye bajo la licencia AGPL-3.0 y puede descargarse desde el pie de página. Las imágenes que proceses siguen siendo tuyas.
        </p>
        <h2>Enlaces externos</h2>
        <p>El sitio puede contener enlaces o anuncios de terceros. El titular no se responsabiliza de sus contenidos ni de sus políticas.</p>
        <h2>Legislación aplicable</h2>
        <p>
          Este aviso legal se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales que correspondan conforme a la normativa vigente, incluida la de consumidores y usuarios.
        </p>
      </article>
    </div>
  )
}

export function Contacto() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <article className="prose-if">
        <h1 className="text-4xl font-extrabold">Contacto</h1>
        <p>
          ¿Has encontrado un error, echas de menos un formato o tienes una sugerencia? Escríbenos a <Mail />. Respondemos normalmente en unos días.
        </p>
        <h2>Antes de escribir</h2>
        <ul>
          <li>Si una imagen no se procesa, indica el formato del archivo, su tamaño y el navegador que usas.</li>
          <li>
            No adjuntes fotos con datos personales: las herramientas funcionan en tu navegador y no necesitamos tus imágenes para ayudarte.
          </li>
          <li>
            Muchas dudas están resueltas en las <Link to="/#preguntas">preguntas frecuentes</Link>.
          </li>
        </ul>
        <h2>Datos del titular</h2>
        <p>
          {OWNER.name} · {OWNER.address}. Más información en el <Link to="/aviso-legal">aviso legal</Link>.
        </p>
      </article>
    </div>
  )
}

export function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <article className="prose-if">
        <h1 className="text-4xl font-extrabold">Privacidad y cookies</h1>
        <p>Última actualización: {UPDATED}.</p>
        <h2>Responsable del tratamiento</h2>
        <p>
          {OWNER.name}, NIF {OWNER.nif}, {OWNER.address}. Contacto: <Mail />.
        </p>
        <h2>Tus imágenes</h2>
        <p>
          ImageFit Studio procesa las imágenes en tu navegador: redimensionar, recortar, comprimir, convertir (incluidas las fotos HEIC), procesar por lotes, crear el ZIP, el encuadre inteligente, la eliminación de fondo y los rellenos locales de ampliación se ejecutan en tu dispositivo. Las imágenes no se envían a nuestros servidores ni se almacenan, por lo que no tratamos su contenido.
        </p>
        <h2>Publicidad (Google AdSense) y cookies</h2>
        <p>
          Este sitio se financia con anuncios de Google AdSense. Google, como proveedor externo, utiliza cookies y tecnologías similares para mostrar anuncios, limitar su repetición, medir su rendimiento y, si lo aceptas, personalizarlos según tus visitas a este y otros sitios. La base legal es tu consentimiento, que se solicita mediante el aviso de cookies de Google (plataforma de gestión del consentimiento certificada) al entrar en la web desde el Espacio Económico Europeo, el Reino Unido o Suiza.
        </p>
        <ul>
          <li>Puedes aceptar, rechazar o configurar las cookies en ese aviso y cambiar tu elección en cualquier momento desde el enlace de preferencias de privacidad que aparece en la web.</li>
          <li>Si rechazas las cookies de personalización, Google puede mostrar anuncios no personalizados, que usan cookies o identificadores solo para limitar la frecuencia, generar informes agregados y prevenir el fraude.</li>
          <li>
            Más información sobre cómo usa Google los datos:{' '}
            <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">policies.google.com/technologies/partner-sites</a>. Puedes gestionar la personalización en{' '}
            <a href="https://adssettings.google.com" rel="noopener" target="_blank">adssettings.google.com</a>.
          </li>
        </ul>
        {import.meta.env.VITE_GA_ID ? (
          <>
            <h2>Analítica (Google Analytics)</h2>
            <p>
              Usamos Google Analytics 4 para saber de forma agregada qué páginas se visitan y cómo se usa la web, con el fin de mejorarla. Solo se guardan cookies de análisis si las aceptas en el aviso de cookies; si no, Google Analytics funciona sin cookies y solo recibe señales anónimas sin identificadores. Google actúa como encargado del tratamiento y puede transferir datos a EE. UU. bajo el Marco de Privacidad de Datos UE-EE. UU. Más información en{' '}
              <a href="https://policies.google.com/privacy" rel="noopener" target="_blank">policies.google.com/privacy</a>.
            </p>
            <p>ImageFit Studio no usa cookies propias. Solo puede guardar en tu navegador preferencias técnicas necesarias para su funcionamiento.</p>
          </>
        ) : (
          <p>ImageFit Studio no usa cookies propias de análisis ni de publicidad. Solo puede guardar en tu navegador preferencias técnicas necesarias para su funcionamiento.</p>
        )}
        <h2>Otros servicios externos</h2>
        <ul>
          <li>
            <b>Modelos de IA en el navegador.</b> Para el encuadre inteligente se descargan los modelos de MediaPipe desde servidores de Google (storage.googleapis.com) y, para la eliminación de fondo, el modelo IS-Net desde la CDN de IMG.LY (staticimgly.com). Solo se descargan los modelos; tus imágenes no se envían. Estos proveedores pueden registrar datos técnicos de la descarga, como la dirección IP.
          </li>
          <li>
            <b>Ampliación con IA generativa (opcional y desactivada actualmente).</b> Si se activa y la usas tras confirmarlo, se envía una copia reducida de tu imagen a Stability AI a través de nuestro servidor, que no la guarda.
          </li>
          <li><b>Tipografías.</b> Las fuentes se cargan desde Google Fonts.</li>
          <li>
            <b>Alojamiento y seguridad.</b> La web se sirve a través de Cloudflare, que trata datos técnicos de conexión (IP, navegador) para entregar la página y proteger el sitio.
          </li>
        </ul>
        <h2>Correo electrónico</h2>
        <p>
          Si nos escribes a <Mail />, usaremos tu dirección y tu mensaje solo para responderte, y los conservaremos el tiempo necesario para atender tu consulta.
        </p>
        <h2>Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a <Mail />. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).
        </p>
        <h2>Metadatos y código abierto</h2>
        <p>
          Las imágenes generadas no conservan los metadatos EXIF del original, como la ubicación GPS. El código fuente del sitio está disponible bajo licencia AGPL-3.0 en el enlace «Código fuente» del pie de página.
        </p>
      </article>
    </div>
  )
}
