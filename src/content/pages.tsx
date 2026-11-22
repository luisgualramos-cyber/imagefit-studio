import type { ReactNode } from 'react'
import { Link } from 'react-router'
import Studio from '../studio/Studio'
import ShopTool from '../tools/ShopTool'
import ExpandTool from '../tools/ExpandTool'
import { ALL_PRESETS, PRESET_GROUPS } from '../lib/presets'

export interface ToolPageContent {
  h1: string
  lead: string
  tool: ReactNode
  body: ReactNode
}

const social = PRESET_GROUPS.filter((g) => g.kind === 'social')
const preset = (group: string, name: string) => ALL_PRESETS.find((p) => p.group === group && p.name === name)!.id

function SocialSizesTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Red social</th>
          <th>Formato</th>
          <th>Tamaño</th>
        </tr>
      </thead>
      <tbody>
        {social.flatMap((g) =>
          g.presets.map((p, i) => (
            <tr key={p.id}>
              <td>{i === 0 ? <b>{g.label}</b> : ''}</td>
              <td>{p.name}</td>
              <td>
                {p.width}×{p.height} px{p.note ? <span className="text-muted"> · {p.note}</span> : null}
              </td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  )
}

function FormatTable() {
  return (
    <div className="table-scroll" role="region" aria-label="Comparativa de formatos de imagen" tabIndex={0}>
    <table>
      <thead>
        <tr>
          <th>Formato</th>
          <th>Compresión</th>
          <th>Transparencia</th>
          <th>Mejor para</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><b>JPG</b></td><td>Con pérdida</td><td>No</td><td>Fotografías donde importa la compatibilidad total</td></tr>
        <tr><td><b>PNG</b></td><td>Sin pérdida</td><td>Sí</td><td>Logotipos, capturas, gráficos y textos</td></tr>
        <tr><td><b>WEBP</b></td><td>Con o sin pérdida</td><td>Sí</td><td>Imágenes para webs y tiendas: buen equilibrio peso/calidad</td></tr>
        <tr><td><b>AVIF</b></td><td>Con pérdida (muy eficiente)</td><td>Sí</td><td>Webs que buscan el mínimo peso posible</td></tr>
      </tbody>
    </table>
    </div>
  )
}

/** Páginas para búsquedas concretas (enlazadas desde inicio y pie). */
export const QUICK_PAGES = [
  { to: '/fotos-tramites-espana', label: 'Fotos para trámites oficiales' },
  { to: '/foto-dni', label: 'Foto para el DNI' },
  { to: '/foto-pasaporte', label: 'Foto para el pasaporte' },
  { to: '/foto-carnet-conducir', label: 'Foto carné de conducir' },
  { to: '/comprimir-foto-a-100kb', label: 'Comprimir foto a 100 KB' },
  { to: '/redimensionar-foto-whatsapp', label: 'Foto de perfil de WhatsApp' },
  { to: '/miniatura-youtube', label: 'Miniatura de YouTube' },
  { to: '/reducir-fotos-para-email', label: 'Reducir fotos para email' },
  { to: '/convertir-heic-a-jpg', label: 'Convertir HEIC a JPG' },
  { to: '/convertir-webp-a-jpg', label: 'Convertir WEBP a JPG' },
  { to: '/convertir-png-a-jpg', label: 'Convertir PNG a JPG' },
  { to: '/recortar-imagen', label: 'Recortar imagen' },
  { to: '/redimensionar-imagen-en-cm', label: 'Cambiar tamaño en cm' },
]

export const TOOL_PAGES: Record<string, ToolPageContent> = {
  '/redimensionar-imagenes': {
    h1: 'Redimensionar imágenes online',
    lead: 'Cambia el tamaño de tus fotos en píxeles o en porcentaje sin deformarlas. Una imagen o cien, directamente en tu navegador.',
    tool: <Studio initial={{ sizeMode: 'custom', lockRatio: true, width: 1200 }} />,
    body: (
      <>
        <h2>Cómo cambiar el tamaño de una imagen</h2>
        <p>
          Sube la foto y elige «Píxeles». Con el candado cerrado solo tienes que escribir el ancho: el alto se calcula a partir de la proporción de la imagen, de modo que nada se estira. Si prefieres trabajar con porcentajes, «Escala %» reduce o amplía la imagen completa (por ejemplo, al 50 % una foto de 4000×3000 queda en 2000×1500).
        </p>
        <p>
          Cuando necesitas unas medidas exactas con otra proporción —por ejemplo, 1200×630 para una vista previa al compartir—, abre el candado. Entonces decides cómo llegar a esas medidas: <b>recortar</b> lo que sobra (con un marco que puedes mover), <b>encajar</b> la imagen completa con un fondo, o <b>estirar</b>, la única opción que deforma y que por eso nunca se aplica por defecto.
        </p>
        <h2>Tamaños recomendados según el uso</h2>
        <ul>
          <li><b>Imagen a ancho completo en una web:</b> 1600-1920 px de ancho.</li>
          <li><b>Imagen dentro de un artículo:</b> 800-1200 px de ancho.</li>
          <li><b>Enviar por email o WhatsApp:</b> 1280-1600 px en el lado mayor; suele quedar por debajo de 500 KB.</li>
          <li><b>Imprimir en A4 a buena calidad:</b> 2480×3508 px (300 ppp).</li>
        </ul>
        <h2>Calidad al reducir</h2>
        <p>
          Las reducciones grandes se hacen en varios pasos (dividiendo a la mitad sucesivamente) para evitar el efecto de dientes de sierra y el muaré que aparecen cuando una foto de 6000 px se reduce de golpe a 600 px. El resultado es más nítido que el de muchos redimensionadores rápidos.
        </p>
        <h2>Redimensionar varias imágenes a la vez</h2>
        <p>
          Sube hasta 100 imágenes juntas, configura el tamaño, el formato y la calidad una sola vez y pulsa procesar; la barra de progreso indica cuántas van listas. Las fotos se reparten entre varios procesos en segundo plano (Web Workers), así que se aprovechan todos los núcleos del procesador sin que la página se congele.
        </p>
        <ul>
          <li><b>Mismas medidas para todas:</b> con el candado cerrado, cada foto cabe dentro de las medidas indicadas sin deformarse, y las verticales y las horizontales conservan su proporción.</li>
          <li><b>Mismo formato exacto:</b> si eliges unas medidas fijas, todas salen iguales y cada una se recorta con su propio encuadre inteligente.</li>
          <li><b>Mismo formato de archivo, compresión y sufijo</b>, incluido un peso máximo por imagen, para no confundirlas con los originales.</li>
          <li><b>Revisión una a una:</b> haz clic en cualquier miniatura para ver o corregir su encuadre antes de descargar todo en un ZIP.</li>
        </ul>
        <h2>Errores típicos al cambiar el tamaño</h2>
        <ul>
          <li><b>Ampliar una foto pequeña esperando más nitidez.</b> Pasar de 800 a 2400 px no añade detalle: solo agranda los píxeles y la foto se ve blanda. Si la necesitas más grande para imprimir, parte siempre del original de la cámara.</li>
          <li><b>Abrir el candado y elegir «Estirar».</b> Las caras y los círculos se deforman. Si las medidas no encajan con la proporción de la foto, usa «Recortar» o «Encajar».</li>
          <li><b>Redimensionar una copia de una copia.</b> Cada vez que se guarda un JPG se pierde algo de calidad. Trabaja siempre desde el archivo original.</li>
          <li><b>Confundir píxeles con kilobytes.</b> Si un formulario pide «menos de 200 KB», reducir los píxeles ayuda, pero lo que fija el peso es la compresión: usa <Link to="/comprimir-foto-a-100kb">comprimir a un peso concreto</Link>.</li>
        </ul>
        <figure style={{ margin: '1.5rem 0' }}>
          <img src="/img/ejemplos/redimensionar-antes-despues.webp" width={1200} height={470} loading="lazy" decoding="async" alt="Antes y después: imagen de 4000 × 3000 px y 2,89 MB (el tamaño típico de una foto de móvil) reducida a 1600 × 1200 px y 109 KB con esta herramienta" style={{ width: '100%', height: 'auto', borderRadius: 12 }} />
          <figcaption style={{ fontSize: 14, opacity: 0.75, marginTop: 6 }}>Ejemplo real con esta herramienta: la misma foto a 1600 px de ancho pesa unas 27 veces menos y se sigue viendo nítida en pantalla.</figcaption>
        </figure>
      </>
    ),
  },
  '/comprimir-imagenes': {
    h1: 'Comprimir imágenes online sin perder calidad',
    lead: 'Reduce el peso de tus fotos eligiendo la calidad o un límite en KB. Verás el peso original, el final y el porcentaje ahorrado.',
    tool: <Studio initial={{ sizeMode: 'original', format: 'original', quality: 72 }} />,
    body: (
      <>
        <h2>Cómo reducir el peso de una foto</h2>
        <p>
          Sube una o varias imágenes, ajusta la calidad y pulsa procesar. Para fotografías, una calidad entre 70 y 85 consigue reducciones del 40-80 % sin diferencias visibles. Usa el comparador del resultado para comprobarlo en tu propia imagen antes de descargar.
        </p>
        <h3>Comprimir hasta un tamaño concreto</h3>
        <p>
          Muchos formularios piden fotos de menos de 200 KB, 500 KB o 1 MB. Escribe el límite en «Peso máximo (KB)»: la herramienta prueba varias calidades por búsqueda binaria y se queda con la más alta que cumple. Si ni la calidad mínima basta, te avisará y te sugerirá bajar las dimensiones, que es lo que más peso ahorra.
        </p>
        <h2>Tres trucos que reducen más que la calidad</h2>
        <ul>
          <li><b>Reduce las dimensiones.</b> Una foto de móvil tiene 12-50 megapíxeles; para una web o un correo bastan 2-3. Pasar de 4000 a 2000 px de ancho reduce el peso alrededor de un 75 %.</li>
          <li><b>Cambia a WEBP o AVIF.</b> Con la misma calidad visual pesan entre un 25 % y un 50 % menos que JPG. Ver <Link to="/convertir-imagenes">convertir formatos</Link>.</li>
          <li><b>No uses PNG para fotos.</b> PNG no tiene pérdida y en fotografías genera archivos enormes.</li>
        </ul>
        <h2>¿Qué se elimina al comprimir?</h2>
        <p>
          Los formatos con pérdida descartan información que el ojo apenas percibe: pequeñas variaciones de color y textura fina. Además, al generar el archivo nuevo se eliminan los metadatos EXIF, incluidos los datos de ubicación GPS, lo que ahorra unos KB y protege tu privacidad.
        </p>
        <h2>Qué calidad elegir según el uso</h2>
        <table>
          <thead>
            <tr>
              <th>Uso</th>
              <th>Formato</th>
              <th>Calidad orientativa</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Fotos para una web o una tienda online</td><td>WEBP o JPG</td><td>75-82</td></tr>
            <tr><td>Fotos para enviar por correo</td><td>JPG</td><td>80</td></tr>
            <tr><td>Fotos que se van a imprimir</td><td>JPG</td><td>90-95</td></tr>
            <tr><td>Capturas de pantalla con texto</td><td>PNG o WEBP</td><td>90 o sin pérdida</td></tr>
          </tbody>
        </table>
        <p>Son puntos de partida: el comparador te deja ver el resultado en tu propia foto antes de descargarla. Si las imágenes son para tu web, sigue también la <Link to="/optimizar-imagenes-para-web">guía para optimizar imágenes para la web</Link>.</p>
        <h2>Errores típicos al comprimir</h2>
        <ul>
          <li><b>Bajar la calidad por debajo de 60.</b> Aparecen bloques en cielos y degradados, y halos alrededor del texto. Si aún pesa demasiado, reduce las dimensiones en lugar de seguir bajando la calidad.</li>
          <li><b>Guardar capturas de pantalla en JPG.</b> El texto queda rodeado de manchas. Para capturas, PNG o WEBP con calidad alta.</li>
          <li><b>Volver a comprimir fotos ya comprimidas.</b> Una imagen que llega por WhatsApp o que descargas de una web ya está muy comprimida: comprimirla otra vez ahorra poco y empeora la calidad.</li>
        </ul>
      </>
    ),
  },
  '/convertir-imagenes': {
    h1: 'Convertir imágenes: JPG, PNG, WEBP y AVIF',
    lead: 'Conversión real entre formatos: la imagen se vuelve a codificar y obtienes un archivo válido, no un cambio de extensión.',
    tool: <Studio initial={{ format: 'image/webp', quality: 82 }} />,
    body: (
      <>
        <h2>Qué formato elegir</h2>
        <FormatTable />
        <p>
          Para la mayoría de las webs, <b>WEBP</b> es la mejor opción hoy: lo muestran todos los navegadores actuales, admite transparencia y pesa bastante menos que JPG. <b>AVIF</b> comprime aún más, pero tarda más en codificarse; si tu navegador no puede generarlo de forma nativa, ImageFit Studio usa un codificador libavif compilado a WebAssembly, también dentro de tu navegador.
        </p>
        <h2>Convertir JPG a PNG</h2>
        <p>Tiene sentido en tres casos:</p>
        <ul>
          <li>Vas a editar la imagen varias veces y no quieres que cada guardado degrade la calidad.</li>
          <li>Una plataforma o un programa solo acepta PNG.</li>
          <li>Necesitas añadir transparencia después, por ejemplo para recortar un logotipo.</li>
        </ul>
        <p>
          Ten en cuenta que PNG guarda todos los píxeles tal como están: en fotografías el archivo pesa normalmente entre 3 y 10 veces más que el JPG, y la conversión no recupera el detalle que el JPG ya perdió. Elige «PNG» en el paso 3.
        </p>
        <h2>Convertir PNG a WEBP</h2>
        <p>
          WEBP admite transparencia igual que PNG, pero comprime mucho mejor: en capturas y fotos guardadas como PNG la reducción suele superar el 70 %. Es la forma más rápida de aligerar logotipos e imágenes con fondo transparente en una web. Elige «WEBP» en el paso 3 con estas calidades:
        </p>
        <ul>
          <li><b>Fotos y capturas:</b> calidad 80-85.</li>
          <li><b>Logotipos y gráficos con bordes nítidos:</b> calidad 90-100, para evitar halos en los bordes.</li>
        </ul>
        <h2>Otras conversiones habituales</h2>
        <ul>
          <li>JPG a WEBP: reduce el peso de las fotos manteniendo la calidad visual.</li>
          <li><Link to="/convertir-webp-a-jpg">WEBP a JPG</Link>: para subir imágenes a plataformas que no aceptan WEBP.</li>
          <li><Link to="/convertir-png-a-jpg">PNG a JPG</Link>: para aligerar capturas y fotos.</li>
          <li><Link to="/convertir-heic-a-jpg">HEIC a JPG</Link>: para las fotos del iPhone.</li>
        </ul>
        <h2>Cómo funciona la conversión</h2>
        <p>
          El navegador decodifica tu imagen (aplicando la orientación EXIF) y la dibuja en un lienzo. Después la codifica en el nuevo formato con la calidad elegida. Todo ocurre en procesos en segundo plano para que la página no se bloquee aunque conviertas decenas de fotos.
        </p>
        <p>¿Dudas entre formatos? La <Link to="/guia-formatos-de-imagen">guía de formatos de imagen</Link> explica con ejemplos cuándo usar JPG, PNG, WEBP, AVIF o HEIC.</p>
      </>
    ),
  },
  '/convertir-heic-a-jpg': {
    h1: 'Convertir HEIC a JPG',
    lead: 'Pasa las fotos HEIC de tu iPhone a JPG en cualquier navegador, sin instalar nada y sin subirlas a ningún servidor.',
    tool: <Studio initial={{ format: 'image/jpeg', quality: 92 }} dropTitle="Arrastra tus fotos HEIC del iPhone" />,
    body: (
      <>
        <h2>Por qué tus fotos del iPhone son HEIC</h2>
        <p>
          Desde iOS 11, el iPhone guarda las fotos en formato HEIC (High Efficiency Image Container) cuando la cámara está en «Alta eficiencia», que es la opción por defecto. Ocupan aproximadamente la mitad que un JPG, pero Windows sin extensiones, muchas webs, formularios de la Administración y programas de edición no las abren.
        </p>
        <h2>Cómo convertirlas</h2>
        <ul>
          <li>Arrastra las fotos .HEIC (puedes subir muchas a la vez).</li>
          <li>La salida ya está configurada en JPG con calidad 92. Si las necesitas más ligeras, baja la calidad o cambia el tamaño en el paso 1.</li>
          <li>Pulsa «Procesar» y descarga cada foto o todas juntas en un ZIP.</li>
        </ul>
        <p>
          Si tu navegador sabe abrir HEIC (Safari en iPhone y Mac), se usa directamente. En Chrome, Edge o Firefox, la foto se decodifica con <b>libheif</b>, la librería de referencia del formato, compilada a WebAssembly y ejecutada en tu dispositivo. La orientación de la foto se respeta y los datos de ubicación GPS se eliminan del JPG resultante.
        </p>
        <h2>Pasar las fotos del iPhone al PC sin que cambien de formato</h2>
        <p>
          Al conectar el iPhone por cable, iOS puede convertir las fotos a JPG automáticamente. Si quieres conservar los originales HEIC (más ligeros), ve a <b>Ajustes → Fotos → Transferir a Mac o PC</b> y elige «Mantener originales». Si prefieres que el iPhone haga directamente fotos JPG, cambia <b>Ajustes → Cámara → Formatos</b> a «Más compatible».
        </p>
        <p>
          ¿Necesitas además reducir el peso para un formulario? Mira <Link to="/comprimir-foto-a-100kb">comprimir foto a 100 KB</Link>.
        </p>
        <h2>Errores típicos</h2>
        <ul>
          <li><b>Cambiar la extensión a mano.</b> Renombrar «IMG_1234.HEIC» a «IMG_1234.jpg» no convierte nada: el archivo sigue siendo HEIC por dentro y muchas webs lo rechazan o lo muestran roto.</li>
          <li><b>Esperar que se conserve el movimiento de una Live Photo.</b> Se convierte la imagen fija; el pequeño vídeo de la Live Photo es un archivo aparte.</li>
          <li><b>Exportar a calidad 100.</b> El JPG pesa bastante más sin diferencia visible. Con 90-92 es suficiente.</li>
        </ul>
        {/* CONTENIDO-PROPIO: vídeo corto (TikTok/Instagram) pasando fotos HEIC del iPhone a JPG en el ordenador (ver MEDIA-PENDIENTE.md) */}
      </>
    ),
  },
  '/convertir-webp-a-jpg': {
    h1: 'Convertir WEBP a JPG',
    lead: 'Pasa las imágenes WEBP que descargas de internet a JPG para abrirlas en cualquier programa o subirlas donde no aceptan WEBP.',
    tool: <Studio initial={{ format: 'image/jpeg', quality: 92, suffix: '' }} dropTitle="Arrastra tus imágenes WEBP" />,
    body: (
      <>
        <h2>Por qué tantas imágenes están en WEBP</h2>
        <p>
          WEBP es el formato que usan hoy la mayoría de webs porque pesa bastante menos que JPG con la misma calidad. Por eso, al guardar una imagen desde el navegador, muchas veces obtienes un archivo .webp. El problema llega después: algunos editores antiguos, formularios de la Administración, plataformas de empleo o tiendas online solo aceptan JPG o PNG.
        </p>
        <h2>Cómo convertir WEBP a JPG</h2>
        <ul>
          <li>Arrastra una o varias imágenes .webp.</li>
          <li>La salida ya está en JPG con calidad 92, suficiente para que no se note diferencia.</li>
          <li>Pulsa «Procesar» y descarga cada imagen o todas en un ZIP. El archivo conserva el nombre original con extensión .jpg.</li>
        </ul>
        <p>
          La conversión se hace en tu navegador: las imágenes no se suben a ningún servidor. Si la imagen WEBP tiene zonas transparentes, se rellenan de blanco porque JPG no admite transparencia; si las necesitas, conviértela a PNG desde <Link to="/convertir-imagenes">convertir imágenes</Link>.
        </p>
        <h2>Otras conversiones habituales</h2>
        <ul>
          <li><Link to="/convertir-png-a-jpg">PNG a JPG</Link>, para aligerar capturas y fotos.</li>
          <li><Link to="/convertir-heic-a-jpg">HEIC a JPG</Link>, para las fotos del iPhone.</li>
          <li><Link to="/convertir-imagenes">PNG a WEBP</Link>, si lo que quieres es lo contrario: imágenes ligeras para tu web.</li>
        </ul>
      </>
    ),
  },
  '/convertir-png-a-jpg': {
    h1: 'Convertir PNG a JPG',
    lead: 'Convierte capturas y fotos PNG a JPG para que pesen mucho menos, eligiendo el color con el que se rellenan las zonas transparentes.',
    tool: <Studio initial={{ format: 'image/jpeg', quality: 90, suffix: '' }} dropTitle="Arrastra tus imágenes PNG" />,
    body: (
      <>
        <h2>PNG o JPG: cuál usar</h2>
        <p>
          PNG guarda la imagen sin pérdida y admite transparencia, por eso es ideal para logotipos, iconos y capturas con texto. Pero en fotografías o capturas con muchos colores genera archivos muy pesados. Al pasarlos a JPG el peso suele bajar a una fracción del original, algo útil para enviar por correo, subir a una web o adjuntar en un formulario.
        </p>
        <h2>Cómo convertir PNG a JPG</h2>
        <ul>
          <li>Sube uno o varios PNG; puedes arrastrar una carpeta entera de capturas.</li>
          <li>La salida viene configurada en JPG con calidad 90. Si necesitas que pese menos, baja la calidad o indica un peso máximo en KB.</li>
          <li>Procesa y descarga las imágenes una a una o todas juntas en un ZIP.</li>
        </ul>
        <h2>Transparencia y fondo</h2>
        <p>
          JPG no admite transparencia: las zonas transparentes se rellenan de blanco. Si tu PNG es un logotipo y quieres otro color de fondo, elige unas medidas en el paso 1, «Encajar» en el paso 2 y el color que prefieras. Si necesitas conservar la transparencia con menos peso, usa <Link to="/convertir-imagenes">PNG a WEBP</Link>.
        </p>
        <p>
          ¿Además quieres reducirla a un tamaño concreto? Prueba <Link to="/comprimir-foto-a-100kb">comprimir foto a 100 KB</Link> o <Link to="/redimensionar-imagenes">cambiar el tamaño de la imagen</Link>.
        </p>
        <h2>Errores típicos</h2>
        <ul>
          <li><b>Pasar a JPG un logotipo que va sobre un fondo de color.</b> Aparecerá un recuadro blanco alrededor. Para logotipos, mantén PNG o usa WEBP.</li>
          <li><b>Usar calidad baja en capturas con texto pequeño.</b> El texto queda borroso y con halos. Para capturas, no bajes de 90.</li>
        </ul>
      </>
    ),
  },
  '/recortar-imagen': {
    h1: 'Recortar imagen online',
    lead: 'Recorta tus fotos a cuadrado, vertical o panorámico con un marco que mueves y amplías a tu gusto, o deja que el encuadre inteligente coloque el marco por ti.',
    tool: <Studio initial={{ sizeMode: 'preset', presetId: preset('ratios', 'Cuadrado 1:1'), fit: 'cover', smartCrop: true, format: 'original', quality: 90, suffix: '-recortada' }} presetFilter="web" />,
    body: (
      <>
        <h2>Cómo recortar una imagen</h2>
        <ul>
          <li><b>Elige la proporción</b> en el paso 1, dentro de «Formatos» → «Proporciones»: cuadrado 1:1, vertical 4:5, 3:4, 2:3 o 9:16, horizontal 3:2, 4:3 o panorámico 16:9. También puedes escribir medidas propias en «Medidas» con el candado abierto.</li>
          <li><b>Ajusta el marco</b>: arrástralo sobre la foto, usa el control de zoom o la rueda del ratón para recortar más ajustado, o las flechas del teclado para afinar.</li>
          <li><b>Descarga</b> la imagen recortada en su formato original, o cámbialo a JPG, PNG o WEBP en el paso 3.</li>
        </ul>
        <h2>Proporciones más usadas</h2>
        <table>
          <thead>
            <tr>
              <th>Proporción</th>
              <th>Para qué se usa</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1:1</td><td>Fotos de perfil, publicaciones cuadradas, catálogos de producto</td></tr>
            <tr><td>4:5</td><td>Publicaciones verticales de Instagram y Facebook</td></tr>
            <tr><td>2:3 y 3:2</td><td>Fotos impresas de 10×15 cm, la proporción de la mayoría de cámaras</td></tr>
            <tr><td>4:3 y 3:4</td><td>Fotos de móvil, presentaciones y tiendas como Etsy</td></tr>
            <tr><td>16:9</td><td>Miniaturas de YouTube, fondos de pantalla y cabeceras web</td></tr>
            <tr><td>9:16</td><td>Stories, Reels, TikTok y estados de WhatsApp</td></tr>
          </tbody>
        </table>
        <h2>Recorte inteligente con IA</h2>
        <p>
          Con el encuadre inteligente activado, la herramienta coloca el marco alrededor de lo importante. La foto se analiza en tres niveles, siempre dentro de tu navegador:
        </p>
        <ul>
          <li><b>Rostros</b>, con el detector BlazeFace de MediaPipe. Si hay varias personas, se tienen en cuenta los rostros principales.</li>
          <li><b>Personas y objetos</b>, con EfficientDet-Lite (80 categorías: personas, animales, vehículos, botellas, tazas, móviles…). Se elige el elemento más relevante por tamaño, confianza y posición.</li>
          <li><b>Contenido visual</b>, si no hay nada reconocible: un análisis de bordes, saturación y tonos de piel localiza la zona de más interés.</li>
        </ul>
        <p>
          La caja verde de la vista previa muestra lo que se ha detectado y con qué confianza. Si los modelos no se pueden cargar, se indica y la foto se centra para que la ajustes a mano. Es especialmente útil al recortar muchas fotos a la vez: cada una sale bien encuadrada sin tener que tocarla.
        </p>
        <h3>Cuando el sujeto no cabe</h3>
        <p>
          Si el elemento principal es más grande que el nuevo formato (una persona de cuerpo entero en un formato apaisado, por ejemplo), se prioriza el rostro y se deja algo de aire por encima de la cabeza. Aparece un aviso para que decidas si prefieres reducir el zoom o usar «Encajar», que coloca la foto completa sobre un fondo desenfocado.
        </p>
        <p>
          Si no quieres perder ninguna parte de la foto, en lugar de recortar puedes <Link to="/ampliar-imagen">ampliar el fondo</Link> hasta la proporción que necesitas.
        </p>
        <h2>Errores típicos al recortar</h2>
        <ul>
          <li><b>Recortar demasiado una foto pequeña.</b> Si la zona recortada tiene menos píxeles que el tamaño final, la imagen se amplía y pierde nitidez. Antes de descargar, comprueba las medidas del resultado.</li>
          <li><b>Cortar por las articulaciones.</b> Un corte justo en los tobillos, las rodillas o las muñecas da sensación de «miembro amputado». Corta un poco por encima o por debajo.</li>
          <li><b>Pegar la cabeza al borde superior.</b> Deja algo de aire por encima: con un recorte vertical para Stories, además, la parte de arriba queda tapada por el nombre de la cuenta.</li>
        </ul>
      </>
    ),
  },
  '/redimensionar-imagen-en-cm': {
    h1: 'Cambiar el tamaño de una imagen en cm o mm',
    lead: 'Indica las medidas en centímetros o milímetros y la resolución de impresión: la herramienta calcula los píxeles exactos y redimensiona la imagen.',
    tool: <Studio initial={{ sizeMode: 'custom', unit: 'cm', dpi: 300, width: 10, height: 15, lockRatio: false, fit: 'cover', smartCrop: true, format: 'image/jpeg', quality: 95, suffix: '-cm' }} />,
    body: (
      <>
        <h2>Píxeles, centímetros y ppp</h2>
        <p>
          Una imagen digital no tiene centímetros: tiene píxeles. Su tamaño impreso depende de cuántos píxeles se colocan en cada pulgada (2,54 cm), lo que se llama resolución o ppp (puntos por pulgada). La fórmula es sencilla: <b>píxeles = centímetros ÷ 2,54 × ppp</b>.
        </p>
        <table>
          <thead>
            <tr>
              <th>Medida</th>
              <th>150 ppp</th>
              <th>300 ppp</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Foto 10 × 15 cm</td><td>591 × 886 px</td><td>1181 × 1772 px</td></tr>
            <tr><td>Foto 13 × 18 cm</td><td>768 × 1063 px</td><td>1535 × 2126 px</td></tr>
            <tr><td>A5 (14,8 × 21 cm)</td><td>874 × 1240 px</td><td>1748 × 2480 px</td></tr>
            <tr><td>A4 (21 × 29,7 cm)</td><td>1240 × 1754 px</td><td>2480 × 3508 px</td></tr>
          </tbody>
        </table>
        <h2>Cómo usarla</h2>
        <ul>
          <li>En el paso 1, «Medidas», elige <b>cm</b> o <b>mm</b> y la resolución (300 ppp para fotos que se ven de cerca, 150 ppp para pósters).</li>
          <li>Escribe el ancho y el alto. Debajo verás los píxeles equivalentes.</li>
          <li>Con el candado cerrado, la imagen conserva su proporción y cabe dentro de esas medidas. Con el candado abierto obtienes la medida exacta: elige en el paso 2 si recortar o encajar.</li>
        </ul>
        <h2>Antes de imprimir</h2>
        <p>
          Comprueba que tu foto tiene al menos los píxeles que necesitas (aparecen en su miniatura). Si tiene muchos menos, se ampliará y perderá nitidez. Para documentos oficiales tienes herramientas con las medidas exactas y su fuente: <Link to="/foto-dni">foto para el DNI</Link> y <Link to="/foto-carnet-conducir">foto para el carné de conducir</Link>.
        </p>
        <p>
          Al guardar, la imagen se exporta con los píxeles calculados. La mayoría de servicios de impresión piden el tamaño en centímetros al hacer el pedido; algunos programas pueden mostrar otra resolución nominal, pero los píxeles serán los correctos para la medida elegida.
        </p>
        <h2>Errores típicos al preparar una imagen para imprimir</h2>
        <ul>
          <li><b>Cambiar solo los ppp en un programa.</b> Algunos editores permiten poner «300 ppp» sin tocar los píxeles: el tamaño de impresión cambia, pero la foto no gana detalle.</li>
          <li><b>Pedir más tamaño del que la foto da.</b> Una imagen de 1200 × 800 px a 300 ppp solo llega a unos 10 × 6,8 cm. Para un tamaño mayor, baja a 150-200 ppp o usa una foto con más resolución.</li>
          <li><b>Olvidar el sangrado.</b> Si el diseño llega hasta el borde del papel, muchas imprentas piden unos milímetros extra por cada lado (lo habitual son 3 mm). Pregunta antes de enviar el archivo.</li>
        </ul>
      </>
    ),
  },
  '/imagenes-para-redes-sociales': {
    h1: 'Adaptar imágenes para redes sociales',
    lead: 'Instagram, TikTok, YouTube, Facebook, X y LinkedIn al tamaño exacto, con encuadre inteligente que mantiene a las personas en la imagen.',
    tool: <Studio presetFilter="social" initial={{ sizeMode: 'preset', presetId: preset('instagram', 'Publicación vertical'), fit: 'cover', smartCrop: true, format: 'image/jpeg', quality: 88 }} />,
    body: (
      <>
        <h2>Tamaños de imagen para redes sociales</h2>
        <p>Estas son las medidas incluidas en la herramienta. Todas están pensadas para que la red social no vuelva a recortar ni a comprimir de más tu imagen.</p>
        <SocialSizesTable />
        <h2>De horizontal a vertical sin cortar a nadie</h2>
        <p>
          Al pasar una foto horizontal a 9:16 se pierde más de la mitad de la imagen. Con el encuadre inteligente activado, la herramienta detecta rostros, personas y objetos en tu navegador y coloca el recorte a su alrededor. Si el elemento principal no cabe entero, prioriza el rostro y te avisa. Siempre puedes arrastrar el marco o hacer zoom.
        </p>
        <h2>Consejos para cada red</h2>
        <ul>
          <li><b>Instagram:</b> el formato vertical 4:5 ocupa más pantalla en el feed que el cuadrado. En la cuadrícula del perfil se muestra un recorte 3:4.</li>
          <li><b>Stories, Reels y TikTok:</b> deja libres unos 250 px arriba y abajo; ahí aparecen el nombre, los botones y el texto.</li>
          <li><b>YouTube:</b> la miniatura debe pesar menos de 2 MB. Pon «2000» en peso máximo si tu imagen tiene mucho detalle.</li>
          <li><b>Banner de YouTube:</b> el contenido importante debe ir en la zona central de 1546×423 px, que es lo que se ve en móviles.</li>
        </ul>
        <h2>Errores típicos</h2>
        <ul>
          <li><b>Subir la misma imagen a todas las redes.</b> Una foto apaisada en el feed de Instagram o en una Story se ve pequeña o recortada. Prepara una versión para cada formato: aquí se hace en un solo paso.</li>
          <li><b>Poner texto pegado a los bordes.</b> En Stories, Reels y TikTok los bordes superior e inferior quedan tapados por la interfaz.</li>
          <li><b>Subir PNG enormes «para que no pierdan calidad».</b> Las redes vuelven a comprimir todo lo que subes. Un JPG de calidad alta con las medidas exactas suele verse igual o mejor.</li>
        </ul>
        <figure style={{ margin: '1.5rem 0' }}>
          <img src="/img/ejemplos/redes-antes-despues.webp" width={1200} height={560} loading="lazy" decoding="async" alt="Antes y después: imagen horizontal de un soporte de móvil sobre una mesa y el mismo soporte encuadrado en vertical 9:16 para Stories" style={{ width: '100%', height: 'auto', borderRadius: 12 }} />
          <figcaption style={{ fontSize: 14, opacity: 0.75, marginTop: 6 }}>Ejemplo real: el encuadre inteligente detecta el objeto, aunque esté a un lado, y lo mantiene dentro del formato 9:16.</figcaption>
        </figure>
      </>
    ),
  },
  '/fotos-para-tienda-online': {
    h1: 'Fotos de producto para tiendas online',
    lead: 'Elimina el fondo con IA en tu navegador, ponlo blanco o del color de tu marca, centra el producto y exporta imágenes ligeras para tu catálogo.',
    tool: <ShopTool />,
    body: (
      <>
        <h2>Fotos de catálogo homogéneas en minutos</h2>
        <p>
          Un catálogo con fotos del mismo tamaño, el mismo fondo y el producto siempre centrado transmite profesionalidad y convierte más. Esta herramienta automatiza los pasos que normalmente harías uno a uno en un editor:
        </p>
        <ul>
          <li><b>Eliminación de fondo real</b> con el modelo de segmentación IS-Net, ejecutado en tu dispositivo con ONNX Runtime y WebAssembly.</li>
          <li><b>Detección de los límites del producto</b> para recortar el espacio vacío y centrarlo.</li>
          <li><b>Margen uniforme</b> configurable para que todas las fotos respiren igual.</li>
          <li><b>Exportación optimizada</b> en JPG, WEBP o PNG con límite de peso opcional.</li>
        </ul>
        <h2>Requisitos de las principales plataformas</h2>
        <ul>
          <li><b>Amazon:</b> fondo blanco puro (RGB 255, 255, 255), el producto debe ocupar al menos el 85 % de la imagen y un mínimo de 1000 px en el lado mayor para activar el zoom. Usa margen 5-7 %.</li>
          <li><b>Shopify:</b> recomienda 2048×2048 px cuadradas. Mantén el mismo tamaño en todo el catálogo.</li>
          <li><b>Etsy:</b> la miniatura usa proporción 4:3; 2000×1500 px funciona bien.</li>
          <li><b>WooCommerce:</b> depende del tema, pero 1200×1200 px cubre la mayoría.</li>
        </ul>
        <h2>Para un mejor recorte</h2>
        <p>
          La IA funciona mejor con el producto bien iluminado y contrastado con el fondo. Los objetos transparentes (vidrio) o con pelo muy fino pueden necesitar un repaso. Si tus fotos ya tienen fondo liso, puedes desactivar la IA: la detección de bordes centrará el producto igualmente y será instantánea.
        </p>
        <figure style={{ margin: '1.5rem 0' }}>
          <img src="/img/ejemplos/tienda-antes-despues.webp" width={1200} height={470} loading="lazy" decoding="async" alt="Antes y después: soporte de móvil sobre una mesa de madera y el mismo producto recortado sobre fondo blanco con sombra suave" style={{ width: '100%', height: 'auto', borderRadius: 12 }} />
          <figcaption style={{ fontSize: 14, opacity: 0.75, marginTop: 6 }}>Ejemplo real: fondo eliminado con la IA en el navegador, producto centrado con un 8 % de margen y sombra suave.</figcaption>
        </figure>
      </>
    ),
  },
  '/ampliar-imagen': {
    h1: 'Ampliar imagen y extender el fondo',
    lead: 'Convierte una foto cuadrada en horizontal o vertical ampliando el fondo, en lugar de dejar bandas vacías.',
    tool: <ExpandTool />,
    body: (
      <>
        <h2>Tres formas de ampliar el fondo</h2>
        <ul>
          <li><b>Desenfocado (local):</b> la propia foto, ampliada y desenfocada, rellena la zona nueva. Es el estilo habitual en Stories y vídeos verticales.</li>
          <li><b>Espejo (local):</b> refleja los bordes de la imagen y los suaviza; funciona bien con cielos, paredes, césped o fondos de estudio.</li>
          <li><b>IA generativa (servicio externo):</b> Stability AI genera contenido nuevo coherente con la escena. Es la opción más realista, pero es un servicio de pago y solo está disponible si se ha activado en el servidor.</li>
        </ul>
        <h2>Cómo usarla</h2>
        <p>
          Elige una proporción (16:9, 1:1, 4:5, 9:16…) o escribe las medidas finales. Coloca el original con la cuadrícula de posición y, si quieres dejar más espacio, reduce su tamaño. La vista previa se actualiza al momento con los rellenos locales y puedes compararla con el original.
        </p>
        <h2>Privacidad</h2>
        <p>
          Los rellenos desenfocado, espejo y color se calculan en tu navegador. La ampliación con IA envía una copia reducida de la imagen a Stability AI a través de nuestro servidor, sin almacenarla, y solo después de que lo confirmes.
        </p>
      </>
    ),
  },
  '/comprimir-foto-a-100kb': {
    h1: 'Comprimir foto a 100 KB',
    lead: 'Reduce una foto a menos de 100 KB, o al límite que te pidan, para formularios, sedes electrónicas, solicitudes de empleo o tu web.',
    tool: <Studio initial={{ sizeMode: 'custom', lockRatio: true, noUpscale: true, width: 1280, height: 1280, format: 'image/jpeg', quality: 85, maxKB: 100, suffix: '-100kb' }} />,
    body: (
      <>
        <h2>Para qué sirve reducir una foto a 100 KB</h2>
        <p>
          Muchos formularios online limitan el tamaño de las imágenes: sedes electrónicas de la Administración, portales de empleo, matrículas, oposiciones o plataformas de alquiler. Los límites más habituales son 50 KB, 100 KB, 200 KB, 500 KB y 1 MB. Una foto hecha con el móvil ocupa entre 2 y 8 MB, entre 20 y 80 veces más de lo permitido.
        </p>
        <p>
          Si es para un documento oficial (DNI, permiso de conducir…), mira antes qué medida y fondo te piden en <Link to="/fotos-tramites-espana">fotos para trámites oficiales en España</Link>.
        </p>
        <img src="/img/ejemplos/100kb-antes-despues.webp" width={1200} height={470} loading="lazy" decoding="async" alt="Antes y después: foto de móvil de 4000 × 3000 px y 2,89 MB reducida con esta herramienta a 1280 × 960 px y 92 KB, por debajo del límite de 100 KB" style={{ width: '100%', height: 'auto', borderRadius: 12 }} />
        <h2>Cómo lo consigue sin estropear la foto</h2>
        <p>La herramienta combina los dos ajustes que más peso ahorran:</p>
        <ul>
          <li><b>Reduce las dimensiones</b> a 1280 px en el lado mayor. Es suficiente para ver la foto con nitidez en cualquier pantalla y elimina el 80-90 % de los píxeles.</li>
          <li><b>Ajusta la calidad automáticamente</b>. Prueba varias calidades JPG y se queda con la más alta que no supera el límite, en lugar de usar una calidad fija que podría quedarse corta o pasarse.</li>
        </ul>
        <h2>Otros límites habituales</h2>
        <table>
          <thead>
            <tr>
              <th>Límite</th>
              <th>Escribe en «Peso máximo (KB)»</th>
              <th>Ancho recomendado</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>50 KB</td><td>50</td><td>800-1000 px</td></tr>
            <tr><td>100 KB</td><td>100</td><td>1280 px</td></tr>
            <tr><td>200 KB</td><td>200</td><td>1600 px</td></tr>
            <tr><td>500 KB</td><td>500</td><td>2000-2500 px</td></tr>
            <tr><td>1 MB</td><td>1000</td><td>3000 px o tamaño original</td></tr>
          </tbody>
        </table>
        <p>
          Si el formulario también exige unas medidas concretas en píxeles, ajústalas en el paso 1. Para fotos de documentos oficiales, mira la <Link to="/foto-dni">foto para el DNI</Link> o la <Link to="/foto-carnet-conducir">foto para el carné de conducir</Link>.
        </p>
        <h2>Errores típicos con los límites de peso</h2>
        <ul>
          <li><b>Fijarse solo en el peso.</b> Algunos formularios piden también unas medidas mínimas o máximas en píxeles. Revisa las dos condiciones antes de subir la foto.</li>
          <li><b>Convertir la foto a PNG «para no perder calidad».</b> En fotografías, PNG pesa varias veces más que JPG: es justo lo contrario de lo que necesitas.</li>
          <li><b>Fotografiar un documento de lejos y recortarlo después.</b> Se pierden píxeles útiles. Acércate para que el documento llene la imagen, con buena luz y sin sombras.</li>
        </ul>
      </>
    ),
  },
  '/redimensionar-foto-whatsapp': {
    h1: 'Foto para WhatsApp: perfil y estados',
    lead: 'Haz que tu foto de perfil no se corte en el círculo y prepara estados a pantalla completa, con la cara siempre en el encuadre.',
    tool: <Studio presetFilter="social" initial={{ sizeMode: 'preset', presetId: preset('whatsapp', 'Foto de perfil'), fit: 'cover', smartCrop: true, format: 'image/jpeg', quality: 90, suffix: '-whatsapp' }} />,
    body: (
      <>
        <h2>Foto de perfil de WhatsApp</h2>
        <p>
          WhatsApp guarda la foto de perfil como un cuadrado y la muestra recortada en un círculo. Si subes una foto vertical, la app te obliga a elegir un recorte, y a menudo la cara queda descentrada o se pierde parte de la cabeza. Aquí se recorta a 640×640 píxeles centrado en tu cara, y puedes ajustar el marco antes de descargarla.
        </p>
        <p>
          Consejo: deja algo de margen alrededor de la cara. Las esquinas del cuadrado no se ven en el círculo, así que lo importante debe quedar en el centro.
        </p>
        <h2>Estados de WhatsApp</h2>
        <p>
          Los estados se ven a pantalla completa en vertical: 1080×1920 píxeles (9:16). Selecciona «Estado» en el grupo WhatsApp del paso 1. Si tu foto es horizontal tienes dos opciones:
        </p>
        <ul>
          <li><b>Recortar:</b> rellena toda la pantalla y mantiene a las personas en el encuadre.</li>
          <li><b>Encajar:</b> la foto se ve entera y el espacio sobrante se rellena con la misma foto desenfocada.</li>
        </ul>
        <h2>Fotos para enviar por chat</h2>
        <p>
          Si solo quieres que tus fotos ocupen menos al enviarlas, reduce su tamaño con la herramienta de <Link to="/reducir-fotos-para-email">reducir fotos</Link>: lo que funciona para el correo también sirve para WhatsApp o Telegram.
        </p>
      </>
    ),
  },
  '/miniatura-youtube': {
    h1: 'Miniatura de YouTube a 1280×720',
    lead: 'Convierte cualquier imagen en una miniatura válida para YouTube: 16:9, 1280×720 píxeles y siempre por debajo de 2 MB.',
    tool: <Studio presetFilter="social" initial={{ sizeMode: 'preset', presetId: preset('youtube', 'Miniatura'), fit: 'cover', smartCrop: true, format: 'image/jpeg', quality: 92, maxKB: 1950, suffix: '-miniatura' }} />,
    body: (
      <>
        <h2>Requisitos de las miniaturas de YouTube</h2>
        <ul>
          <li><b>Tamaño:</b> 1280×720 píxeles, con un ancho mínimo de 640 px.</li>
          <li><b>Proporción:</b> 16:9, la misma que el reproductor.</li>
          <li><b>Peso máximo:</b> 2 MB.</li>
          <li><b>Formatos:</b> JPG, PNG o GIF.</li>
        </ul>
        <p>
          La herramienta ya viene configurada para cumplirlos: JPG con calidad alta y un límite de 1950 KB para quedar siempre por debajo de los 2 MB. Si diseñas la miniatura en PNG con mucho detalle, suele superar ese límite; conviértela aquí a JPG sin pérdida visible.
        </p>
        <h2>Consejos para que tu miniatura destaque</h2>
        <ul>
          <li><b>Pocas palabras y grandes.</b> En el móvil la miniatura mide unos 2-3 cm; un texto pequeño no se lee.</li>
          <li><b>Una cara expresiva</b> suele atraer más clics que un plano general.</li>
          <li><b>Deja libre la esquina inferior derecha:</b> ahí YouTube muestra la duración del vídeo.</li>
          <li><b>Contraste alto</b> entre el sujeto y el fondo para que se distinga en el modo claro y en el oscuro.</li>
        </ul>
        <h2>Banner del canal</h2>
        <p>
          El banner se sube a 2560×1440 px, pero en móviles solo se ve la franja central de 1546×423 px. Lo encontrarás en el grupo YouTube del paso 1, y más formatos en <Link to="/imagenes-para-redes-sociales">imágenes para redes sociales</Link>.
        </p>
      </>
    ),
  },
  '/reducir-fotos-para-email': {
    h1: 'Reducir fotos para enviar por email',
    lead: 'Reduce el peso de muchas fotos a la vez para que quepan en un correo, sin que se note al verlas en pantalla.',
    tool: (
      <Studio
        initial={{ sizeMode: 'custom', lockRatio: true, noUpscale: true, width: 1600, height: 1600, format: 'image/jpeg', quality: 80, maxKB: 400, suffix: '-email' }}
        dropTitle="Arrastra las fotos que quieres enviar"
      />
    ),
    body: (
      <>
        <h2>El problema: los adjuntos tienen límite</h2>
        <p>
          Gmail y Outlook permiten adjuntar unos 20-25 MB por correo, y muchos servidores de empresa todavía menos. Una foto de un móvil actual ocupa entre 3 y 8 MB, así que con cuatro o cinco fotos el correo ya no se envía o el destinatario no lo recibe.
        </p>
        <h2>La solución: 1600 px y menos de 400 KB por foto</h2>
        <p>
          A 1600 píxeles en el lado mayor una foto se ve perfectamente en un ordenador o un móvil, y con calidad JPG alta pesa entre 250 y 400 KB. Así caben más de 50 fotos en un solo correo. Las fotos verticales y horizontales conservan su proporción.
        </p>
        <h2>Paso a paso</h2>
        <ul>
          <li>Arrastra todas las fotos a la vez (hasta 100).</li>
          <li>Pulsa «Procesar» y espera a que termine la barra de progreso.</li>
          <li>Pulsa «Descargar todo (ZIP)» y adjunta el ZIP o las fotos sueltas al correo.</li>
        </ul>
        <h2>¿Y si las quieren imprimir?</h2>
        <p>
          Para imprimir conviene enviar más resolución. Sube el ancho a 3000 px y quita el límite de peso, o comparte los originales con un servicio de almacenamiento. Para enviarlas solo para verlas, la configuración de esta página es ideal. Más opciones en <Link to="/redimensionar-imagenes">redimensionar varias imágenes a la vez</Link>.
        </p>
      </>
    ),
  },
  '/foto-dni': {
    h1: 'Foto para el DNI: 32 × 26 mm',
    lead: 'Recorta tu foto al tamaño oficial del DNI español, centrada en tu cara y lista para imprimir en papel fotográfico. Sin subirla a ningún servidor.',
    tool: <Studio initial={{ sizeMode: 'preset', presetId: preset('docs', 'DNI España 26×32 mm'), fit: 'cover', smartCrop: true, format: 'image/jpeg', quality: 95, suffix: '-dni' }} dropTitle="Arrastra tu foto para el DNI" />,
    body: (
      <>
        <h2>Requisitos oficiales de la foto del DNI</h2>
        <p>
          La norma que regula el DNI pide «una fotografía reciente del rostro de la persona solicitante en color, tamaño 32 por 26 milímetros, con fondo uniforme blanco y liso, tomada de frente, con la cabeza totalmente descubierta y sin gafas de cristales oscuros o cualquier otra prenda que pueda impedir o dificultar la identificación de la persona».
        </p>
        <table>
          <thead>
            <tr>
              <th>Requisito</th>
              <th>Qué significa en la práctica</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>32 × 26 mm</td><td>32 mm de alto por 26 mm de ancho (vertical). A 300 ppp son 307 × 378 píxeles, que es lo que genera esta herramienta.</td></tr>
            <tr><td>En color y reciente</td><td>Nada de blanco y negro ni de fotos antiguas.</td></tr>
            <tr><td>Fondo uniforme blanco y liso</td><td>Una pared blanca sin sombras, cuadros ni texturas detrás.</td></tr>
            <tr><td>De frente y cabeza descubierta</td><td>Mirando a la cámara, sin gorra, gorro ni capucha.</td></tr>
            <tr><td>Sin gafas oscuras ni prendas que dificulten la identificación</td><td>La cara tiene que verse bien.</td></tr>
          </tbody>
        </table>
        <p>
          La renovación exige la misma foto: el artículo 8.2 pide «aportar una fotografía con las características señaladas en el artículo 6.2.d)».
        </p>
        <p className="text-sm text-muted">
          Fuente oficial:{' '}
          <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2025-6601" target="_blank" rel="noopener noreferrer">
            Real Decreto 255/2025, de 1 de abril, por el que se regula el Documento Nacional de Identidad (BOE núm. 80, de 2 de abril de 2025)
          </a>
          , artículos 6.2.d y 8.2. Última revisión: 21/11/2026.
        </p>
        <p>
          ¿Necesitas la foto para otro trámite? Consulta el resumen de <Link to="/fotos-tramites-espana">fotos para trámites oficiales en España</Link>.
        </p>
        <h2>Cómo usar la herramienta</h2>
        <ul>
          <li>Sube una foto hecha delante de una pared blanca, con luz de frente y sin sombras. <b>La herramienta no cambia el fondo</b>: si la pared no es blanca, la foto no cumplirá.</li>
          <li>El tamaño ya está en «DNI España 26×32 mm». El encuadre inteligente detecta tu cara y la centra; ajusta el marco y el zoom si quieres más o menos aire alrededor de la cabeza.</li>
          <li>Descarga el JPG y encarga la impresión en una tienda de revelado indicando que la foto debe medir 32 × 26 mm.</li>
        </ul>
        <h2>Consejos para hacer la foto en casa</h2>
        <ul>
          <li><b>Luz de frente y uniforme</b>, mejor junto a una ventana que con flash directo, que crea brillos y sombras en el fondo.</li>
          <li><b>Cámara a la altura de los ojos y a 1-1,5 metros.</b> Desde muy cerca, el objetivo del móvil deforma la cara (la nariz parece más grande).</li>
          <li><b>Pared blanca lisa detrás</b> y un paso de distancia para que tu sombra no caiga sobre ella.</li>
        </ul>
        <h2>Errores que suelen invalidar la foto</h2>
        <ul>
          <li><b>Fondo gris, beige o con sombra</b> detrás de la cabeza. Aléjate un paso de la pared para que tu sombra no caiga sobre ella.</li>
          <li><b>Foto de lado o mirando hacia abajo</b>, típica de un selfi con el móvil bajo. Pide a otra persona que te haga la foto con el móvil a la altura de tus ojos.</li>
          <li><b>Gafas de sol, gorra o capucha.</b> La norma pide la cabeza totalmente descubierta y sin gafas de cristales oscuros.</li>
          <li><b>Imprimir con otra medida.</b> Si la tienda la imprime «tamaño carné» sin más, comprueba con una regla que mide 32 × 26 mm.</li>
        </ul>
        <p>
          ¿Es para el carné de conducir? Mira la <Link to="/foto-carnet-conducir">foto para el permiso de conducir (DGT)</Link>, que tiene el mismo tamaño pero no exige fondo blanco.
        </p>
      </>
    ),
  },
  '/foto-carnet-conducir': {
    h1: 'Foto para el carné de conducir (DGT): 32 × 26 mm',
    lead: 'Prepara la foto de 32 × 26 mm que pide la DGT para el permiso de conducir, centrada en tu cara y lista para imprimir. En tu navegador, sin subirla a ningún servidor.',
    tool: <Studio initial={{ sizeMode: 'preset', presetId: preset('docs', 'Permiso de conducir (DGT) 26×32 mm'), fit: 'cover', smartCrop: true, format: 'image/jpeg', quality: 95, suffix: '-dgt' }} dropTitle="Arrastra tu foto para el carné de conducir" />,
    body: (
      <>
        <h2>Qué foto pide la DGT</h2>
        <p>
          En su sede electrónica, la DGT pide «una fotografía original actual de 32 x 26 mm., en color y con fondo liso, tomada de frente con la cabeza descubierta», sin gafas de cristales oscuros ni otras prendas que dificulten la identificación.
        </p>
        <table>
          <thead>
            <tr>
              <th>Requisito</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Tamaño</td><td>32 × 26 mm (307 × 378 píxeles a 300 ppp)</td></tr>
            <tr><td>Color</td><td>En color, original y actual</td></tr>
            <tr><td>Fondo</td><td>Liso (la DGT no indica que tenga que ser blanco; para el DNI, en cambio, sí)</td></tr>
            <tr><td>Postura</td><td>De frente, con la cabeza descubierta y sin gafas de cristales oscuros</td></tr>
            <tr><td>Velo por motivos religiosos</td><td>Se admite si el óvalo de la cara queda totalmente descubierto, desde el nacimiento del pelo hasta el mentón (indicado en la ficha de solicitud de examen)</td></tr>
          </tbody>
        </table>
        <h2>¿Cuándo hace falta?</h2>
        <p>
          La DGT indica que, dentro de su proceso de modernización, «desde el 6 de noviembre 2024 ya no es necesario volver a presentar el talón-foto y/o fotografías» en los trámites en los que ya tiene esa documentación. Según su sede, la foto se sigue pidiendo, por ejemplo, en el duplicado del permiso por cambio de datos si el trámite se hace de forma presencial, y en el talón-foto de la solicitud de examen cuando es para obtener una licencia de vehículo de movilidad reducida, solo la primera vez que solicitas ese permiso. Antes de imprimirla, revisa en la sede de la DGT si tu trámite concreto la pide.
        </p>
        <p className="text-sm text-muted">
          Fuentes oficiales (sede electrónica de la DGT):{' '}
          <a href="https://sede.dgt.gob.es/es/permisos-de-conducir/obtencion-y-gestion-de-permisos/duplicado-de-permisos-por-cambio-de-datos/index.html" target="_blank" rel="noopener noreferrer">
            duplicado de permisos por cambio de datos
          </a>{' '}
          y{' '}
          <a href="https://sede.dgt.gob.es/es/permisos-de-conducir/obtencion-y-gestion-de-permisos/solicitud-de-prueba-de-aptitud-de-examen/" target="_blank" rel="noopener noreferrer">
            solicitud de examen
          </a>
          . Última revisión: 21/11/2026.
        </p>
        <p>
          Tienes un resumen de todos los trámites en <Link to="/fotos-tramites-espana">fotos para trámites oficiales en España</Link>.
        </p>
        <h2>Cómo usar la herramienta</h2>
        <ul>
          <li>Hazte la foto delante de una pared lisa y clara, con luz de frente. La herramienta no cambia el fondo.</li>
          <li>El tamaño ya está seleccionado («Permiso de conducir (DGT) 26×32 mm») y el encuadre inteligente centra tu cara. Ajusta el zoom si hace falta.</li>
          <li>Descarga el JPG e imprímelo en papel fotográfico indicando la medida de 32 × 26 mm.</li>
        </ul>
        <p>
          Si además vas a renovar el DNI, la <Link to="/foto-dni">foto para el DNI</Link> tiene la misma medida, pero allí el fondo tiene que ser blanco: con una sola foto sobre fondo blanco te sirve para los dos trámites.
        </p>
      </>
    ),
  },
  '/foto-pasaporte': {
    h1: 'Foto para el pasaporte español: 32 × 26 mm',
    lead: 'Prepara la foto que pide el pasaporte ordinario, centrada en tu cara y lista para imprimir en papel fotográfico. En tu navegador, sin subirla a ningún servidor.',
    tool: <Studio initial={{ sizeMode: 'preset', presetId: preset('docs', 'Pasaporte España 26×32 mm'), fit: 'cover', smartCrop: true, format: 'image/jpeg', quality: 95, suffix: '-pasaporte' }} dropTitle="Arrastra tu foto para el pasaporte" />,
    body: (
      <>
        <h2>Requisitos oficiales de la foto del pasaporte</h2>
        <p>
          El Real Decreto 896/2003, que regula el pasaporte ordinario, pide en su artículo 4.1.c «una fotografía reciente en color del rostro del solicitante, tamaño 32 x 26 milímetros, con fondo uniforme blanco y liso, tomada de frente y sin gafas de cristales oscuros o cualquier otra prenda que pueda impedir la identificación de la persona».
        </p>
        <p>
          El Ministerio del Interior añade en su información del trámite que la foto debe mostrar claramente el óvalo de la cara (cejas, ojos, nariz, boca y mentón), tener alta resolución y estar impresa en papel fotográfico de buena calidad.
        </p>
        <table>
          <thead>
            <tr>
              <th>Requisito</th>
              <th>Qué significa en la práctica</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>32 × 26 mm</td><td>32 mm de alto por 26 mm de ancho (vertical). A 300 ppp son 307 × 378 píxeles, que es lo que genera esta herramienta.</td></tr>
            <tr><td>Reciente y en color</td><td>Nada de blanco y negro ni de fotos antiguas en las que ya no te pareces.</td></tr>
            <tr><td>Fondo uniforme, blanco y liso</td><td>Una pared blanca sin sombras, dibujos ni texturas detrás de ti.</td></tr>
            <tr><td>De frente, con la cara bien visible</td><td>Cejas, ojos, nariz, boca y mentón tienen que verse con claridad.</td></tr>
            <tr><td>Sin gafas oscuras ni prendas que impidan identificarte</td><td>Fuera gafas de sol, gorras o cualquier cosa que tape la cara.</td></tr>
            <tr><td>Alta resolución y buen papel</td><td>Imprímela en papel fotográfico de calidad, no en papel normal de impresora.</td></tr>
          </tbody>
        </table>
        <h2>¿Cuándo no hace falta llevar foto?</h2>
        <p>
          Según el Ministerio del Interior, no es necesario aportar fotografía si has obtenido o renovado el DNI ese mismo día. Si vas a hacer los dos documentos, pide cita para el mismo día y te ahorras la foto del pasaporte.
        </p>
        <p className="text-sm text-muted">
          Fuentes oficiales:{' '}
          <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2003-13978" target="_blank" rel="noopener noreferrer">
            Real Decreto 896/2003, de 11 de julio, por el que se regula la expedición del pasaporte ordinario (BOE), artículo 4.1.c
          </a>{' '}
          y{' '}
          <a href="https://www.interior.gob.es/opencms/es/servicios-al-ciudadano/tramites-y-gestiones/pasaporte/procedimiento-de-expedicion/" target="_blank" rel="noopener noreferrer">
            Ministerio del Interior: procedimiento de expedición del pasaporte
          </a>
          . Última revisión: 22/11/2026.
        </p>
        <h2>Cómo preparar la foto con esta herramienta</h2>
        <ol>
          <li>Hazte la foto delante de una pared blanca y lisa, con luz de frente y sin sombras. <b>La herramienta no cambia el fondo</b>: si la pared no es blanca, la foto no cumplirá.</li>
          <li>Sube la foto. El tamaño ya está en «Pasaporte España 26×32 mm» y el encuadre inteligente detecta tu cara y la centra.</li>
          <li>Revisa el encuadre: la cara tiene que verse entera, de las cejas al mentón. Si quieres más o menos aire alrededor de la cabeza, ajusta el marco y el zoom.</li>
          <li>Descarga el JPG y encarga la impresión en papel fotográfico indicando que la foto debe medir 32 × 26 mm. Comprueba la copia con una regla.</li>
        </ol>
        <p>
          Todo el proceso ocurre en tu propio móvil u ordenador: la foto de tu cara no se envía a ningún servidor.
        </p>
        <h2>Errores que suelen hacer repetir la foto</h2>
        <ul>
          <li><b>Fondo que no es blanco liso:</b> paredes beige o grises, puertas, azulejos o tu propia sombra detrás de la cabeza. Sepárate un paso de la pared.</li>
          <li><b>Selfi con el brazo estirado:</b> la cara sale girada o desde abajo y el objetivo la deforma. Que te la haga otra persona con el móvil a la altura de tus ojos, a 1-1,5 metros.</li>
          <li><b>Cara cortada o demasiado pequeña:</b> si se ve el pelo pero el mentón queda fuera, o si la cara ocupa muy poco espacio, no se aprecia bien el óvalo de la cara.</li>
          <li><b>Imprimir en papel normal:</b> el Ministerio pide papel fotográfico de buena calidad. Una impresión doméstica en folio no sirve.</li>
          <li><b>Imprimir a otra medida:</b> «tamaño carné» no siempre significa 32 × 26 mm. Indícalo expresamente en la tienda.</li>
        </ul>
        <h2>Pasaporte y DNI: la misma foto</h2>
        <p>
          La foto del pasaporte tiene la misma medida y el mismo fondo que la del DNI. Si ya tienes una <Link to="/foto-dni">foto para el DNI</Link> reciente, te sirve también para el pasaporte. Tienes el resumen de todos los trámites en <Link to="/fotos-tramites-espana">fotos para trámites oficiales en España</Link>.
        </p>
      </>
    ),
  },
}
