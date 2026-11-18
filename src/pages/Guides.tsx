import type { ReactNode } from 'react'
import { Link } from 'react-router'
import AdSlot from '../components/AdSlot'

const UPDATED = 'noviembre de 2026'

function Article({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <article className="prose-if max-w-3xl">
        <h1 className="text-4xl font-extrabold">{title}</h1>
        <p>Última actualización: {UPDATED}.</p>
        {children}
      </article>
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <AdSlot position="sidebar" format="rectangle" />
        </div>
      </aside>
    </div>
  )
}

export function About() {
  return (
    <Article title="Acerca de ImageFit Studio">
      <p>
        ImageFit Studio es un conjunto de herramientas gratuitas para preparar imágenes: cambiar su tamaño, recortarlas, comprimirlas, convertirlas de formato y adaptarlas a redes sociales, tiendas online o documentos. Todo funciona desde el navegador, sin registro y sin instalar programas.
      </p>
      <h2>Por qué existe</h2>
      <p>
        Casi todo el mundo necesita, de vez en cuando, ajustar una foto: reducirla para enviarla por correo, dejarla en 100 KB para un formulario de la administración, pasar una foto del iPhone de HEIC a JPG o recortarla al formato de Instagram. Los programas de edición profesionales son excesivos para eso, y muchas webs gratuitas obligan a subir las fotos a sus servidores, ponen marcas de agua o limitan el número de imágenes.
      </p>
      <p>
        ImageFit Studio se creó para hacer estas tareas en pocos segundos, en español, con la configuración más habitual ya preparada en cada herramienta y sin que tus fotos salgan de tu dispositivo.
      </p>
      <h2>Tus imágenes no se suben a ningún servidor</h2>
      <p>
        El procesamiento se hace con tecnologías del propio navegador (Canvas, WebAssembly y modelos de IA que se ejecutan en local). Cuando redimensionas, comprimes o conviertes una foto, el resultado se calcula en tu ordenador o en tu móvil y se descarga directamente. Por eso funciona rápido incluso con lotes de muchas imágenes y por eso puedes usarlo con fotos personales o documentos sin preocuparte de dónde acaban.
      </p>
      <p>
        Además, las imágenes generadas no conservan los metadatos EXIF del original, como la ubicación GPS, algo útil antes de publicar fotos en internet. Lo explicamos con detalle en la <Link to="/privacidad">política de privacidad</Link>.
      </p>
      <h2>Qué puedes hacer</h2>
      <ul>
        <li>
          <Link to="/redimensionar-imagenes">Redimensionar imágenes</Link> en píxeles, porcentaje o <Link to="/redimensionar-imagen-en-cm">centímetros para imprimir</Link>, una o <Link to="/redimensionar-imagenes">muchas a la vez</Link>.
        </li>
        <li>
          <Link to="/comprimir-imagenes">Comprimir imágenes</Link> eligiendo la calidad o un peso máximo, por ejemplo para <Link to="/comprimir-foto-a-100kb">dejar una foto en 100 KB</Link>.
        </li>
        <li>
          <Link to="/convertir-imagenes">Convertir entre JPG, PNG, WEBP y AVIF</Link>, y pasar <Link to="/convertir-heic-a-jpg">fotos HEIC del iPhone a JPG</Link>.
        </li>
        <li>
          Adaptar fotos a <Link to="/imagenes-para-redes-sociales">redes sociales</Link> con <Link to="/recortar-imagen">encuadre inteligente</Link> que evita cortar a las personas.
        </li>
        <li>
          Preparar <Link to="/fotos-para-tienda-online">fotos de producto para tiendas online</Link> y <Link to="/foto-carnet-dni-pasaporte">fotos de carné</Link>.
        </li>
      </ul>
      <p>
        Si no sabes qué formato elegir, empieza por nuestra <Link to="/guia-formatos-de-imagen">guía de formatos de imagen</Link>. Si tienes una web o una tienda, te interesará la guía para <Link to="/optimizar-imagenes-para-web">optimizar imágenes para la web</Link>.
      </p>
      <h2>Quién lo mantiene</h2>
      <p>
        ImageFit Studio es un proyecto independiente desarrollado y mantenido por una sola persona. Los datos del titular figuran en el <Link to="/aviso-legal">aviso legal</Link>. El código fuente está publicado bajo licencia AGPL-3.0 y puede descargarse desde el pie de página.
      </p>
      <h2>Cómo se financia</h2>
      <p>
        Las herramientas son gratuitas y se mantienen gracias a la publicidad de Google AdSense, que se muestra en espacios separados de las herramientas. Los anuncios personalizados solo se activan si los aceptas en el aviso de cookies.
      </p>
      <h2>Sugerencias</h2>
      <p>
        ¿Echas en falta un formato, un tamaño predefinido o una herramienta? ¿Has encontrado un error? Escríbenos desde la página de <Link to="/contacto">contacto</Link>. Las mejoras de la web salen en gran parte de esos mensajes.
      </p>
    </Article>
  )
}

export function FormatsGuide() {
  return (
    <Article title="JPG, PNG, WEBP, AVIF o HEIC: qué formato de imagen usar en cada caso">
      <p>
        Elegir bien el formato de una imagen puede reducir su peso a la mitad sin que se note ninguna diferencia, o evitar que un logotipo quede con bordes sucios. En esta guía repasamos los formatos más comunes, cómo funcionan por dentro y cuál conviene usar según para qué vayas a utilizar la imagen.
      </p>
      <h2>Compresión con pérdida y sin pérdida</h2>
      <p>
        Antes de comparar formatos conviene entender la diferencia clave. La <b>compresión sin pérdida</b> reduce el tamaño del archivo sin alterar ni un solo píxel: al abrirlo, la imagen es idéntica a la original. La <b>compresión con pérdida</b> elimina información que el ojo humano apenas percibe (pequeñas variaciones de color, detalles finos en zonas con textura) a cambio de archivos mucho más ligeros.
      </p>
      <p>
        Para fotografías, la compresión con pérdida bien ajustada es casi siempre la mejor opción: con una calidad del 75–85 % la diferencia es invisible y el archivo pesa una fracción. Para capturas de pantalla, textos, logotipos e ilustraciones con colores planos, la compresión con pérdida genera halos y manchas alrededor de los bordes, y ahí gana la compresión sin pérdida.
      </p>
      <h2>JPG (JPEG): el estándar universal para fotos</h2>
      <p>
        El JPG existe desde 1992 y lo abre cualquier dispositivo, programa o web. Usa compresión con pérdida y está pensado para fotografías. No admite transparencia: las zonas transparentes se rellenan con un color de fondo (normalmente blanco).
      </p>
      <ul>
        <li><b>Úsalo para:</b> fotos que vas a enviar, imprimir o subir a sitios donde no sabes qué formatos aceptan.</li>
        <li><b>Evítalo para:</b> logotipos, capturas con texto e imágenes que vayas a editar y guardar muchas veces, porque cada guardado vuelve a perder calidad.</li>
      </ul>
      <h2>PNG: nitidez y transparencia</h2>
      <p>
        El PNG comprime sin pérdida y admite transparencia con bordes suaves. Es perfecto para logotipos, iconos, capturas de pantalla y gráficos. Su punto débil son las fotografías: una foto en PNG puede pesar de 5 a 10 veces más que la misma foto en JPG sin verse mejor.
      </p>
      <ul>
        <li><b>Úsalo para:</b> logotipos, capturas, diagramas, imágenes con texto y cualquier cosa que necesite fondo transparente.</li>
        <li><b>Evítalo para:</b> fotos que vayan a publicarse en una web o enviarse por correo.</li>
      </ul>
      <h2>WEBP: el formato recomendado para la web</h2>
      <p>
        Desarrollado por Google, el WEBP admite compresión con y sin pérdida, transparencia e incluso animación. A igual calidad visual, un WEBP suele pesar entre un 25 % y un 35 % menos que un JPG, y bastante menos que un PNG con transparencia. Todos los navegadores actuales lo muestran sin problemas.
      </p>
      <ul>
        <li><b>Úsalo para:</b> imágenes de páginas web, blogs y tiendas online.</li>
        <li><b>Ten en cuenta:</b> algunos programas antiguos de escritorio y ciertos formularios oficiales todavía no lo aceptan. Si tienes dudas, <Link to="/convertir-webp-a-jpg">conviértelo a JPG</Link>.</li>
      </ul>
      <h2>AVIF: máxima compresión</h2>
      <p>
        El AVIF es el formato más moderno de la lista. Consigue archivos todavía más pequeños que WEBP con la misma calidad, sobre todo en fotos con degradados suaves como cielos. Su codificación es más lenta y el soporte fuera de los navegadores es menor.
      </p>
      <ul>
        <li><b>Úsalo para:</b> webs donde cada kilobyte cuenta, como portadas con imágenes grandes.</li>
        <li><b>Evítalo para:</b> enviar archivos a otras personas o subirlos a plataformas que no lo admitan.</li>
      </ul>
      <h2>HEIC: el formato de las fotos del iPhone</h2>
      <p>
        Los iPhone guardan las fotos en HEIC (HEIF) por defecto porque ocupa aproximadamente la mitad que un JPG equivalente. El problema es la compatibilidad: muchos ordenadores con Windows, webs y formularios no lo abren. Lo más práctico es <Link to="/convertir-heic-a-jpg">convertir las fotos HEIC a JPG</Link> antes de compartirlas o subirlas.
      </p>
      <h2>Qué formato elegir: resumen por casos</h2>
      <table>
        <thead>
          <tr>
            <th>Situación</th>
            <th>Formato recomendado</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Enviar fotos por correo o WhatsApp</td><td>JPG</td></tr>
          <tr><td>Foto para un trámite online (DNI, solicitud)</td><td>JPG, respetando el peso máximo que pidan</td></tr>
          <tr><td>Imágenes de una web o un blog</td><td>WEBP (o AVIF si buscas el mínimo peso)</td></tr>
          <tr><td>Fotos de producto con fondo transparente</td><td>WEBP o PNG</td></tr>
          <tr><td>Logotipo o icono</td><td>PNG (o SVG si lo tienes en vectorial)</td></tr>
          <tr><td>Captura de pantalla con texto</td><td>PNG</td></tr>
          <tr><td>Imprimir</td><td>JPG a calidad alta o PNG</td></tr>
        </tbody>
      </table>
      <h2>Errores habituales</h2>
      <ul>
        <li>
          <b>Cambiar la extensión del archivo a mano.</b> Renombrar «foto.png» a «foto.jpg» no convierte la imagen: solo confunde a los programas. Hay que hacer una conversión real, como la de nuestra herramienta de <Link to="/convertir-imagenes">convertir imágenes</Link>.
        </li>
        <li>
          <b>Pasar un JPG a PNG esperando que mejore.</b> La calidad perdida al guardar en JPG no se recupera; el PNG solo evitará perder más.
        </li>
        <li>
          <b>Guardar fotos en PNG para la web.</b> Es uno de los motivos más frecuentes de páginas lentas. <Link to="/convertir-imagenes">Pasar de PNG a WEBP</Link> suele reducir el peso drásticamente.
        </li>
      </ul>
      <p>
        ¿Quieres aplicar todo esto? En la guía para <Link to="/optimizar-imagenes-para-web">optimizar imágenes para la web</Link> verás cómo combinar el formato con el tamaño y la compresión adecuados.
      </p>
    </Article>
  )
}

export function WebGuide() {
  return (
    <Article title="Cómo optimizar imágenes para la web sin perder calidad">
      <p>
        Las imágenes suelen ser lo que más pesa en una página web. Una sola foto sacada con el móvil puede ocupar 4–6 MB y tardar varios segundos en cargarse con una conexión móvil. Optimizarlas mejora la velocidad, la experiencia de quien visita la web y también el posicionamiento en buscadores, porque Google tiene en cuenta los tiempos de carga. Estos son los pasos, en el orden en que conviene aplicarlos.
      </p>
      <h2>1. Ajusta las dimensiones al espacio real</h2>
      <p>
        El error más común es subir una foto de 4000 píxeles de ancho para mostrarla en un hueco de 800. El navegador la descarga entera y luego la reduce, de modo que se transfieren millones de píxeles que nadie ve. Antes que nada, <Link to="/redimensionar-imagenes">redimensiona</Link> la imagen al tamaño en que se va a mostrar.
      </p>
      <ul>
        <li><b>Imagen a todo el ancho (portada):</b> 1600–1920 px de ancho.</li>
        <li><b>Imagen dentro de un artículo:</b> 1000–1200 px.</li>
        <li><b>Fotos de producto:</b> 1000–1500 px en formato cuadrado, para que el zoom se vea nítido.</li>
        <li><b>Miniaturas y tarjetas:</b> 400–600 px.</li>
      </ul>
      <p>
        Para pantallas de alta densidad (las llamadas retina) puede compensar usar el doble del tamaño mostrado, pero solo en imágenes importantes y siempre bien comprimidas.
      </p>
      <h2>2. Elige el formato adecuado</h2>
      <p>
        Para la mayoría de imágenes de una web, <b>WEBP</b> es la mejor opción hoy: menos peso que JPG y transparencia como PNG. Reserva PNG para logotipos e imágenes con texto, y valora AVIF si quieres apurar al máximo. Lo explicamos en detalle en la <Link to="/guia-formatos-de-imagen">guía de formatos de imagen</Link>.
      </p>
      <h2>3. Comprime con una calidad razonable</h2>
      <p>
        Con una calidad entre el 75 % y el 85 %, la diferencia frente al original es imperceptible en fotos, y el peso cae mucho. Como referencia orientativa:
      </p>
      <ul>
        <li>Portadas a todo el ancho: menos de 200–300 KB.</li>
        <li>Imágenes de artículos: menos de 100–150 KB.</li>
        <li>Miniaturas: menos de 30–50 KB.</li>
      </ul>
      <p>
        La herramienta de <Link to="/comprimir-imagenes">comprimir imágenes</Link> te permite comparar el antes y el después y fijar un peso máximo en KB, así que puedes buscar el punto exacto donde la calidad sigue siendo buena.
      </p>
      <h2>4. Elimina los metadatos</h2>
      <p>
        Las fotos de cámaras y móviles incluyen metadatos EXIF: modelo de cámara, fecha, ajustes y, a menudo, la ubicación GPS exacta donde se tomó. Además de ocupar espacio, pueden revelar información privada. Las imágenes exportadas con ImageFit Studio no conservan estos metadatos.
      </p>
      <h2>5. Recorta y encuadra con intención</h2>
      <p>
        Una imagen bien encuadrada comunica más y permite usar un tamaño menor. <Link to="/recortar-imagen">Recorta</Link> los bordes que no aportan y usa proporciones coherentes en toda la web (por ejemplo, 16:9 para cabeceras y 1:1 para productos). El <Link to="/recortar-imagen">encuadre inteligente</Link> detecta personas y caras para no cortarlas al cambiar de proporción.
      </p>
      <h2>6. Procesa todas las imágenes a la vez</h2>
      <p>
        Si vas a subir una galería o un catálogo, no hace falta repetir el proceso foto a foto. Con la opción de <Link to="/redimensionar-imagenes">redimensionar varias imágenes</Link> puedes aplicar el mismo tamaño, formato y compresión a todo el lote y descargarlo en un ZIP.
      </p>
      <h2>Buenas prácticas al publicarlas</h2>
      <ul>
        <li><b>Nombres de archivo descriptivos:</b> «zapatillas-running-azules.webp» es mejor que «IMG_4021.webp», tanto para buscadores como para ti.</li>
        <li><b>Texto alternativo (alt):</b> describe brevemente la imagen; ayuda a personas con lectores de pantalla y a los buscadores.</li>
        <li><b>Carga diferida:</b> en imágenes que están más abajo de la primera pantalla, el atributo <code>loading=&quot;lazy&quot;</code> evita descargarlas hasta que hacen falta.</li>
        <li><b>Indica ancho y alto:</b> declarar las dimensiones en el HTML evita que el contenido «salte» mientras la imagen se carga.</li>
      </ul>
      <h2>Lista de comprobación rápida</h2>
      <ul>
        <li>¿La imagen tiene, como mucho, el tamaño en que se va a mostrar?</li>
        <li>¿Está en WEBP (o JPG si necesitas máxima compatibilidad)?</li>
        <li>¿La calidad está entre el 75 % y el 85 % y el peso dentro de lo razonable?</li>
        <li>¿Tiene un nombre de archivo y un texto alternativo descriptivos?</li>
      </ul>
      <p>
        Si vendes por internet, consulta también la página de <Link to="/fotos-para-tienda-online">fotos para tiendas online</Link>, con los tamaños habituales de las principales plataformas.
      </p>
    </Article>
  )
}
