import { Link } from 'react-router'
import AdSlot from '../components/AdSlot'
import { Faq } from '../components/Sections'
import { faqsFor } from '../content/faqs'
import { TRAMITES } from '../content/tramites'

const PATH = '/fotos-tramites-espana'
const dni = TRAMITES.find((t) => t.to === '/foto-dni')!
const dgt = TRAMITES.find((t) => t.to === '/foto-carnet-conducir')!
const pas = TRAMITES.find((t) => t.to === '/foto-pasaporte')!
const INTERIOR_PASAPORTE = 'https://www.interior.gob.es/opencms/es/servicios-al-ciudadano/tramites-y-gestiones/pasaporte/procedimiento-de-expedicion/'
const DGT_EXAMEN = 'https://sede.dgt.gob.es/es/permisos-de-conducir/obtencion-y-gestion-de-permisos/solicitud-de-prueba-de-aptitud-de-examen/'

function Source({ url, label, reviewed }: { url: string; label: string; reviewed?: string }) {
  return (
    <p className="text-sm text-muted">
      Fuente oficial:{' '}
      <a href={url} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
      {reviewed ? `. Última revisión: ${reviewed}.` : '.'}
    </p>
  )
}

/** Página central de los trámites oficiales en España. */
export function TramitesHub() {
  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="prose-if max-w-3xl">
          <nav aria-label="Migas de pan" className="mb-4 text-xs text-muted">
            <Link to="/" className="hover:text-ink">
              ImageFit Studio
            </Link>{' '}
            / <span className="text-ink">Fotos para trámites</span>
          </nav>
          <h1 className="text-4xl font-extrabold">Fotos para trámites oficiales en España</h1>
          <p>Cada trámite indica la fecha en que revisamos su fuente oficial.</p>
          <p>
            Una foto mal preparada es uno de los motivos más habituales para que te devuelvan un trámite o para que la sede electrónica no te deje continuar: medida incorrecta, fondo que no es el pedido, un archivo que pesa demasiado o un formato que el formulario no acepta. En esta página reunimos qué foto pide cada trámite, con la herramienta ya configurada para prepararla.
          </p>
          <p>
            Nuestra regla es sencilla: <b>solo publicamos un requisito si lo hemos leído en la fuente oficial</b> (el BOE, el Ministerio o la sede electrónica del organismo), lo enlazamos y anotamos cuándo lo revisamos. Si una norma cambia, manda siempre lo que diga la fuente oficial en ese momento.
          </p>

          <h2>Resumen: qué foto pide cada trámite</h2>
          <div className="table-scroll" role="region" aria-label="Tabla de requisitos por trámite" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th>Trámite</th>
                <th>Medida</th>
                <th>Fondo</th>
                <th>Cómo se entrega</th>
                <th>Fuente</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Link to="/foto-dni">DNI</Link>
                </td>
                <td>32 × 26 mm, en color</td>
                <td>Blanco, uniforme y liso</td>
                <td>Se aporta al pedirlo y al renovarlo</td>
                <td>
                  <a href={dni.source!.url} target="_blank" rel="noopener noreferrer">
                    BOE
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <Link to="/foto-pasaporte">Pasaporte</Link>
                </td>
                <td>32 × 26 mm, en color</td>
                <td>Blanco, uniforme y liso</td>
                <td>No hace falta si haces el DNI el mismo día</td>
                <td>
                  <a href={pas.source!.url} target="_blank" rel="noopener noreferrer">
                    BOE
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <Link to="/foto-carnet-conducir">Permiso de conducir</Link>
                </td>
                <td>32 × 26 mm, en color</td>
                <td>Liso</td>
                <td>Solo en algunos trámites (ver abajo)</td>
                <td>
                  <a href={dgt.source!.url} target="_blank" rel="noopener noreferrer">
                    DGT
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  <Link to="/comprimir-foto-a-100kb">Formularios con límite de peso</Link>
                </td>
                <td colSpan={2}>Lo que indique cada convocatoria (no hay una norma única)</td>
                <td>Archivo subido a la sede</td>
                <td>Cada convocatoria</td>
              </tr>
            </tbody>
          </table>
          </div>

          <h2>Foto para el DNI</h2>
          <p>
            El Real Decreto 255/2025, que regula el DNI, pide una fotografía reciente del rostro, en color, de 32 por 26 milímetros, con fondo uniforme blanco y liso, tomada de frente, con la cabeza totalmente descubierta y sin gafas de cristales oscuros ni prendas que dificulten la identificación. La misma foto se exige al renovarlo (artículo 8.2). La norma prevé también que, en las oficinas que dispongan de ese medio, la foto se pueda hacer allí de forma automatizada; si no sabes si es tu caso, pregunta al pedir la cita.
          </p>
          <p>
            32 × 26 mm significa 32 mm de alto por 26 mm de ancho. Para imprimirla con buena calidad (300 ppp) son 307 × 378 píxeles, que es exactamente lo que genera la herramienta. Lo más importante ocurre antes: la foto tiene que estar hecha delante de una pared blanca y lisa, porque la herramienta recorta y encuadra, pero no fabrica un fondo oficial.
          </p>
          <p>
            <Link to="/foto-dni">Preparar la foto del DNI (32 × 26 mm)</Link>
          </p>
          <Source url={dni.source!.url} label="Real Decreto 255/2025, artículos 6.2.d y 8.2 (BOE núm. 80, de 2 de abril de 2025)" reviewed={dni.reviewed} />

          <h2>Foto para el pasaporte</h2>
          <p>
            El Real Decreto 896/2003, que regula el pasaporte ordinario, pide en su artículo 4.1.c lo mismo que el DNI: una fotografía reciente en color del rostro, de 32 × 26 mm, con fondo uniforme blanco y liso, tomada de frente y sin gafas de cristales oscuros ni prendas que impidan la identificación. El Ministerio del Interior añade que debe verse claramente el óvalo de la cara (cejas, ojos, nariz, boca y mentón) y que tiene que ser de alta resolución y en papel fotográfico de buena calidad.
          </p>
          <p>
            Un detalle práctico: según el Ministerio del Interior, si obtienes o renuevas el DNI el mismo día, no tienes que llevar foto para el pasaporte.
          </p>
          <p>
            <Link to="/foto-pasaporte">Preparar la foto del pasaporte (32 × 26 mm)</Link>
          </p>
          <Source url={pas.source!.url} label="Real Decreto 896/2003, artículo 4.1.c (BOE)" reviewed={pas.reviewed} />
          <Source url={INTERIOR_PASAPORTE} label="Ministerio del Interior: procedimiento de expedición del pasaporte" reviewed={pas.reviewed} />

          <h2>Foto para el permiso de conducir (DGT)</h2>
          <p>
            Cuando la DGT pide foto, la pide original y actual, de 32 × 26 mm, en color y con fondo liso, tomada de frente con la cabeza descubierta y sin gafas de cristales oscuros. A diferencia del DNI, no especifica que el fondo sea blanco.
          </p>
          <p>Pero muchas veces ya no hace falta. Según su sede electrónica:</p>
          <ul>
            <li>
              Desde el 6 de noviembre de 2024 no es necesario volver a presentar el talón-foto o fotografías en los trámites en los que la DGT ya tenga esa documentación.
            </li>
            <li>En el duplicado del permiso por cambio de datos, la foto se aporta si haces el trámite de forma presencial.</li>
            <li>
              En la solicitud de examen, el talón-foto se pide cuando el examen es para obtener una licencia de vehículo de movilidad reducida, y solo si es la primera vez que solicitas ese permiso.
            </li>
          </ul>
          <p>Antes de imprimirla, mira en la ficha de tu trámite concreto si te la van a pedir.</p>
          <p>
            <Link to="/foto-carnet-conducir">Preparar la foto para la DGT (32 × 26 mm)</Link>
          </p>
          <Source url={dgt.source!.url} label="Sede DGT: duplicado de permisos por cambio de datos" reviewed={dgt.reviewed} />
          <Source url={DGT_EXAMEN} label="Sede DGT: solicitud de examen" reviewed={dgt.reviewed} />

          <h2>Oposiciones, becas y otros formularios con límite de peso</h2>
          <p>
            Muchas sedes electrónicas piden subir una foto o un documento escaneado con un peso máximo (100 KB, 200 KB, 1 MB…) y un formato concreto, casi siempre JPG. No hay una norma común: cada convocatoria o cada formulario fija el suyo, así que el dato bueno es el que aparece en sus instrucciones. Por eso aquí no te damos una cifra «oficial», sino la forma de cumplir la que te pidan:
          </p>
          <ul>
            <li>
              Si el problema es el peso, <Link to="/comprimir-foto-a-100kb">comprime la foto a 100 KB</Link> o al límite que te indiquen. Apunta un poco por debajo (por ejemplo, 90-95 KB para un límite de 100 KB), porque no todos los sistemas cuentan los kilobytes igual.
            </li>
            <li>
              Si la foto es del iPhone (HEIC), <Link to="/convertir-heic-a-jpg">pásala a JPG</Link>: casi ninguna sede acepta HEIC.
            </li>
            <li>
              Si te dan medidas en píxeles, usa <Link to="/redimensionar-imagenes">redimensionar una imagen</Link> o <Link to="/recortar-imagen">recortar la imagen</Link> a esa proporción.
            </li>
          </ul>
          <p>
            Tienes los errores más frecuentes y cómo resolverlos en la guía <Link to="/subir-fotos-sede-electronica">cómo subir una foto a una sede electrónica sin errores</Link>.
          </p>

          <h2>Antes de imprimirla o subirla: comprueba tu foto</h2>
          <ul>
            <li>
              <b>Medida:</b> si es para imprimir, que el archivo tenga la proporción correcta (307 × 378 px para 32 × 26 mm) y que la tienda la imprima a esa medida. Comprueba la copia con una regla.
            </li>
            <li>
              <b>Fondo:</b> blanco y liso para el DNI; liso para la DGT. Sin sombras de tu cabeza en la pared: sepárate un paso.
            </li>
            <li>
              <b>Luz y postura:</b> luz de frente, sin brillos ni flash directo, mirando a la cámara y con la cámara a la altura de los ojos.
            </li>
            <li>
              <b>Sin gafas de sol ni prendas</b> que tapen la cara o la cabeza.
            </li>
            <li>
              <b>Peso y formato</b> (si se sube a una web): por debajo del límite y en el formato que admitan, normalmente JPG.
            </li>
          </ul>

          <h2>¿Por qué aquí tu foto no se sube a ningún servidor?</h2>
          <p>
            Una foto de carné es un dato personal: es tu cara. Por eso todas estas herramientas funcionan dentro de tu navegador. La foto se recorta, se encuadra y se comprime en tu propio móvil u ordenador, y el resultado se descarga directamente. No la recibimos ni la guardamos. Puedes comprobarlo tú mismo siguiendo los pasos de la <Link to="/privacidad#como-comprobarlo">política de privacidad</Link>.
          </p>

          <h2>Otros trámites</h2>
          <p>
            Iremos añadiendo trámites (tarjetas de residencia y otros) a medida que podamos comprobar sus requisitos en la fuente oficial. Mientras tanto, si el trámite te da unas medidas en milímetros, puedes prepararlas con <Link to="/redimensionar-imagen-en-cm">cambiar el tamaño de una imagen en cm</Link>, y si te da un peso máximo, con <Link to="/comprimir-imagenes">comprimir imágenes</Link>.
          </p>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <AdSlot position="sidebar" format="rectangle" />
          </div>
        </aside>
      </div>
      <div className="mx-auto max-w-4xl px-4 pb-14 md:px-6">
        <Faq items={faqsFor(PATH)} />
      </div>
    </>
  )
}
