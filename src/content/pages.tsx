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
  )
}

/** Páginas para búsquedas concretas (enlazadas desde inicio y pie). */
export const QUICK_PAGES = [
  { to: '/comprimir-foto-a-100kb', label: 'Comprimir foto a 100 KB' },
  { to: '/foto-carnet-dni-pasaporte', label: 'Foto para DNI y pasaporte' },
  { to: '/redimensionar-foto-whatsapp', label: 'Foto de perfil de WhatsApp' },
  { to: '/miniatura-youtube', label: 'Miniatura de YouTube' },
  { to: '/reducir-fotos-para-email', label: 'Reducir fotos para email' },
  { to: '/convertir-jpg-a-png', label: 'Convertir JPG a PNG' },
  { to: '/convertir-png-a-webp', label: 'Convertir PNG a WEBP' },
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
        <p>
          ¿Quieres hacerlo con muchas fotos? Puedes subir varias a la vez: las fotos verticales y horizontales conservan cada una su proporción. Más detalles en <Link to="/redimensionar-varias-imagenes">procesar varias imágenes</Link>.
        </p>
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
        <h2>Conversiones más habituales</h2>
        <ul>
          <li><Link to="/convertir-jpg-a-png">Convertir JPG a PNG</Link>: para editar sin añadir más pérdida o para trabajar con programas que lo exigen.</li>
          <li><Link to="/convertir-png-a-webp">Convertir PNG a WEBP</Link>: para aligerar logotipos e imágenes con transparencia en tu web.</li>
          <li>JPG a WEBP: reduce el peso de fotos manteniendo la calidad visual.</li>
          <li>WEBP a JPG: para subir imágenes a plataformas antiguas que no aceptan WEBP.</li>
        </ul>
        <h2>Cómo funciona la conversión</h2>
        <p>
          El navegador decodifica tu imagen (aplicando la orientación EXIF) y la dibuja en un lienzo. Después la codifica en el nuevo formato con la calidad elegida. Todo ocurre en procesos en segundo plano para que la página no se bloquee aunque conviertas decenas de fotos.
        </p>
      </>
    ),
  },
  '/convertir-jpg-a-png': {
    h1: 'Convertir JPG a PNG',
    lead: 'Pasa tus JPG a PNG sin añadir más pérdida de calidad. Varias imágenes a la vez y descarga en ZIP.',
    tool: <Studio initial={{ format: 'image/png' }} />,
    body: (
      <>
        <h2>¿Cuándo tiene sentido pasar de JPG a PNG?</h2>
        <ul>
          <li>Vas a editar la imagen varias veces y no quieres que cada guardado degrade la calidad.</li>
          <li>Una plataforma o un programa solo acepta PNG.</li>
          <li>Necesitas añadir transparencia después (por ejemplo, para recortar un logotipo).</li>
        </ul>
        <h2>Lo que conviene saber</h2>
        <p>
          PNG guarda todos los píxeles tal como están, así que el archivo será más pesado que el JPG original, normalmente entre 3 y 10 veces en fotografías. La conversión no recupera el detalle que el JPG ya perdió al guardarse. Si tu objetivo es una imagen ligera para la web, te conviene más <Link to="/convertir-png-a-webp">WEBP</Link>.
        </p>
        <p>Si además necesitas otro tamaño, ajusta el paso 1 antes de procesar: redimensionar y convertir se hacen a la vez.</p>
      </>
    ),
  },
  '/convertir-png-a-webp': {
    h1: 'Convertir PNG a WEBP',
    lead: 'Convierte PNG a WEBP conservando la transparencia y reduciendo drásticamente el peso. Ideal para acelerar tu web.',
    tool: <Studio initial={{ format: 'image/webp', quality: 85 }} />,
    body: (
      <>
        <h2>Por qué usar WEBP en lugar de PNG</h2>
        <p>
          WEBP admite transparencia igual que PNG, pero con una compresión mucho más eficiente. En capturas de pantalla y fotos guardadas como PNG la reducción suele superar el 70 %. Imágenes más ligeras significan páginas más rápidas, mejores métricas de Core Web Vitals y menos datos móviles para tus visitantes.
        </p>
        <h2>Calidad recomendada</h2>
        <ul>
          <li><b>Fotos y capturas:</b> calidad 80-85.</li>
          <li><b>Logotipos y gráficos con bordes nítidos:</b> calidad 90-100 para evitar halos en los bordes.</li>
          <li><b>Límite de peso:</b> escribe un peso máximo si tu CMS o tema lo exige.</li>
        </ul>
        <p>¿Tu imagen no necesita transparencia? Compara también con AVIF en <Link to="/convertir-imagenes">convertir formatos</Link>.</p>
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
      </>
    ),
  },
  '/redimensionar-varias-imagenes': {
    h1: 'Redimensionar varias imágenes a la vez',
    lead: 'Aplica el mismo tamaño, formato y compresión a decenas de fotos y descárgalas juntas en un ZIP.',
    tool: (
      <Studio
        initial={{ sizeMode: 'custom', lockRatio: true, noUpscale: true, width: 1600, height: 1600, format: 'image/jpeg', quality: 82 }}
        dropTitle="Arrastra todas tus imágenes a la vez"
      />
    ),
    body: (
      <>
        <h2>Procesamiento por lotes, sin instalar nada</h2>
        <p>
          Sube hasta 100 imágenes de una vez. Configura el tamaño, el formato y la calidad una sola vez y pulsa procesar: la barra de progreso te muestra cuántas van listas. Las imágenes se reparten entre varios procesos en paralelo (Web Workers), así que se aprovechan todos los núcleos de tu procesador sin congelar la página.
        </p>
        <h2>Qué se aplica a todas por igual</h2>
        <ul>
          <li><b>Mismas dimensiones:</b> con el candado cerrado, cada foto cabe dentro de las medidas indicadas sin deformarse (las verticales y las horizontales conservan su proporción).</li>
          <li><b>Mismas proporciones:</b> si eliges un formato exacto, todas salen con las mismas medidas y cada una se recorta con su propio encuadre inteligente.</li>
          <li><b>Mismo formato y compresión</b>, incluido el peso máximo por imagen.</li>
          <li><b>Mismo sufijo</b> en el nombre del archivo, para no confundirlas con los originales.</li>
        </ul>
        <h2>Revisar una a una antes de descargar</h2>
        <p>
          Haz clic en cualquier miniatura para ver su encuadre o su resultado. El encuadre manual es individual: puedes corregir solo la foto que lo necesite. Al terminar, descarga todo en un ZIP o cada imagen desde su miniatura.
        </p>
      </>
    ),
  },
  '/encuadre-inteligente': {
    h1: 'Encuadre inteligente con IA',
    lead: 'Cambia la proporción de tus fotos sin cortar lo importante: detección de rostros, personas y objetos en tu navegador, con ajuste manual.',
    tool: <Studio initial={{ sizeMode: 'preset', presetId: preset('instagram', 'Stories y Reels'), fit: 'cover', smartCrop: true }} />,
    body: (
      <>
        <h2>Cómo decide dónde recortar</h2>
        <p>Cuando subes una foto, se analiza en tres niveles, siempre dentro de tu navegador:</p>
        <ul>
          <li><b>Rostros</b> con el detector BlazeFace de MediaPipe. Si hay varias personas, se tienen en cuenta los rostros principales.</li>
          <li><b>Personas y objetos</b> con EfficientDet-Lite (80 categorías: personas, animales, vehículos, botellas, tazas, móviles…). Se elige el elemento más relevante por tamaño, confianza y posición.</li>
          <li><b>Contenido visual</b> si no hay nada reconocible: un análisis de bordes, saturación y tonos de piel localiza la zona de más interés.</li>
        </ul>
        <p>
          La caja verde de la vista previa muestra exactamente lo que se ha detectado y con qué confianza. No hay resultados inventados: si los modelos no se pueden cargar, se indica y la foto se centra para que la ajustes a mano.
        </p>
        <h2>Cuando el sujeto no cabe</h2>
        <p>
          Si el elemento principal es más grande que el nuevo formato (una persona de cuerpo entero en un formato apaisado, por ejemplo), se prioriza el rostro y se deja algo de aire por encima de la cabeza. Aparece un aviso para que decidas si prefieres reducir el zoom o usar «Encajar», que coloca la foto completa sobre un fondo desenfocado.
        </p>
        <p>Prueba también los formatos de <Link to="/imagenes-para-redes-sociales">redes sociales</Link>, donde el encuadre inteligente viene activado.</p>
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
          Si el formulario también exige unas medidas concretas en píxeles, ajústalas en el paso 1. Para fotos de documentos oficiales, mira la herramienta de <Link to="/foto-carnet-dni-pasaporte">foto para DNI y pasaporte</Link>.
        </p>
      </>
    ),
  },
  '/foto-carnet-dni-pasaporte': {
    h1: 'Foto de carné para DNI, pasaporte o visado',
    lead: 'Recorta tu foto al tamaño oficial, centrada automáticamente en tu cara, lista para imprimir o subir a un trámite online.',
    tool: <Studio initial={{ sizeMode: 'preset', presetId: preset('docs', 'DNI / pasaporte España 26×32 mm'), fit: 'cover', smartCrop: true, format: 'image/jpeg', quality: 95, suffix: '-carne' }} />,
    body: (
      <>
        <h2>Tamaños de foto de carné</h2>
        <table>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Medidas</th>
              <th>Píxeles (300 ppp)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>DNI y pasaporte (España)</td><td>26 × 32 mm</td><td>307 × 378 px</td></tr>
            <tr><td>Visado Schengen y la mayoría de países de la UE</td><td>35 × 45 mm</td><td>413 × 531 px</td></tr>
            <tr><td>Pasaporte y visado de EE. UU.</td><td>2 × 2 pulgadas (51 × 51 mm)</td><td>600 × 600 px</td></tr>
          </tbody>
        </table>
        <p>Los tres formatos están en el paso 1, dentro de «Formatos» → «Documentos».</p>
        <h2>Cómo hacer la foto para que sirva</h2>
        <ul>
          <li><b>Fondo liso, blanco o muy claro</b>, sin sombras. Esta herramienta no cambia el fondo, así que conviene hacerse la foto delante de una pared clara.</li>
          <li><b>Luz de frente y uniforme</b>, mejor junto a una ventana que con flash directo.</li>
          <li><b>Mirada a la cámara</b>, expresión neutra, boca cerrada y sin gafas de sol ni gorra.</li>
          <li><b>Cámara a la altura de los ojos</b> y a 1-1,5 metros. Si la haces desde muy cerca, la cara se deforma.</li>
        </ul>
        <h2>Cómo encuadra tu cara</h2>
        <p>
          El <Link to="/encuadre-inteligente">encuadre inteligente</Link> detecta tu cara con IA dentro de tu navegador y centra el recorte en ella, dejando aire por encima de la cabeza. Puedes arrastrar el marco y ajustar el zoom para que la cabeza ocupe la proporción que pide cada organismo, normalmente entre el 70 % y el 80 % del alto de la foto.
        </p>
        <h2>Importante</h2>
        <p>
          Para tramitar el DNI o el pasaporte en España se suele pedir la foto impresa en papel fotográfico, y cada organismo puede tener requisitos propios. Consulta siempre los requisitos oficiales de tu trámite. Para imprimirla, descarga la imagen y encárgala en una tienda de revelado indicando el tamaño en milímetros.
        </p>
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
          Para imprimir conviene enviar más resolución. Sube el ancho a 3000 px y quita el límite de peso, o comparte los originales con un servicio de almacenamiento. Para enviarlas solo para verlas, la configuración de esta página es ideal. Más opciones en <Link to="/redimensionar-varias-imagenes">procesar varias imágenes</Link>.
        </p>
      </>
    ),
  },
}
