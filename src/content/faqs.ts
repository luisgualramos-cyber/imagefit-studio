import type { FaqItem } from '../seo/routes'

export const HOME_FAQS: FaqItem[] = [
  {
    q: '¿Mis fotos se suben a algún servidor?',
    a: 'No. Redimensionar, comprimir, convertir, adaptar a redes sociales, el procesamiento por lotes, el encuadre inteligente y la eliminación de fondo se ejecutan dentro de tu navegador. Las imágenes no salen de tu dispositivo. La única excepción es la ampliación con IA generativa, que solo funciona si está activada y te lo indicamos antes de usarla.',
  },
  {
    q: '¿Es gratis? ¿Necesito registrarme?',
    a: 'Es gratis y no necesitas cuenta. Abres la página, subes tus imágenes y descargas el resultado. La web se mantiene con publicidad que nunca bloquea las herramientas.',
  },
  {
    q: '¿Qué formatos de imagen puedo usar?',
    a: 'Puedes abrir JPG, PNG, WEBP, AVIF, GIF (primer fotograma) y BMP. Puedes exportar a JPG, PNG, WEBP y AVIF. Las fotos HEIC del iPhone se abren en Safari; en otros navegadores conviene exportarlas antes como JPG.',
  },
  {
    q: '¿Pierdo calidad al comprimir o cambiar el tamaño?',
    a: 'Reducir dimensiones y comprimir con calidad 75-85 suele ser imperceptible a simple vista. Puedes comparar el original y el resultado con el deslizador antes de descargar. Ampliar una imagen por encima de su tamaño original no añade detalle real.',
  },
  {
    q: '¿Cuántas imágenes puedo procesar a la vez?',
    a: 'Hasta 100 imágenes por tanda, de hasta 60 MB cada una. El límite real depende de la memoria de tu dispositivo: en móviles es recomendable trabajar en grupos más pequeños.',
  },
  {
    q: '¿Cómo descargo varias imágenes juntas?',
    a: 'Cuando proceses más de una imagen aparecerá el botón «Descargar todo (ZIP)». También puedes descargar cada imagen individualmente desde su miniatura.',
  },
  {
    q: '¿Se conservan los datos EXIF (ubicación, cámara)?',
    a: 'No. Al generar la imagen nueva se eliminan los metadatos, incluida la ubicación GPS. Es más privado y reduce algo el peso. La orientación de la foto sí se aplica correctamente.',
  },
]

export const PAGE_FAQS: Record<string, FaqItem[]> = {
  '/redimensionar-imagenes': [
    {
      q: '¿Cómo cambio el tamaño de una imagen sin deformarla?',
      a: 'Deja activado el candado de proporción. Al escribir el ancho, el alto se calcula solo y la imagen se escala completa. Si necesitas unas medidas exactas con otra proporción, desbloquea el candado y elige «Recortar» o «Encajar» en lugar de «Estirar».',
    },
    {
      q: '¿Qué diferencia hay entre redimensionar y recortar?',
      a: 'Redimensionar cambia el número de píxeles de toda la imagen. Recortar elimina parte de la imagen para cambiar su proporción. ImageFit Studio combina ambas cosas cuando eliges un formato con una proporción distinta.',
    },
    {
      q: '¿Puedo agrandar una foto pequeña?',
      a: 'Sí, con la escala por encima del 100 % o escribiendo medidas mayores, pero el resultado no tendrá más detalle: los píxeles se interpolan y la imagen puede verse más suave.',
    },
    {
      q: '¿Qué tamaño debe tener una imagen para una web?',
      a: 'Para imágenes a ancho completo bastan 1600-1920 px de ancho; para imágenes dentro de un artículo, entre 800 y 1200 px. Combínalo con WEBP y calidad 75-80 para que carguen rápido.',
    },
  ],
  '/comprimir-imagenes': [
    {
      q: '¿Cómo reduzco el peso de una foto sin perder calidad visible?',
      a: 'Usa una calidad de 75-85 en JPG o WEBP y, si la foto es más grande de lo necesario, reduce también sus dimensiones. Esa combinación suele reducir el peso entre un 60 % y un 90 % sin diferencias apreciables.',
    },
    {
      q: '¿Puedo comprimir una imagen a un tamaño concreto, como 200 KB?',
      a: 'Sí. Escribe el valor en «Peso máximo (KB)». La herramienta prueba varias calidades y se queda con la mejor que no supera el límite. Si ni con la calidad mínima se alcanza, te avisará para que reduzcas las dimensiones.',
    },
    {
      q: '¿Por qué mi PNG apenas se comprime?',
      a: 'PNG es un formato sin pérdida. Con calidad inferior a 95, ImageFit Studio reduce la paleta a 256 colores o menos, lo que suele ahorrar un 50-70 % en logotipos y capturas. En fotografías conviene convertir a JPG o WEBP; si necesitas transparencia, WEBP o AVIF la conservan con mucho menos peso.',
    },
    {
      q: '¿Por qué a veces el archivo comprimido pesa más?',
      a: 'Ocurre si la foto ya estaba muy optimizada y la vuelves a guardar con una calidad más alta, o si conviertes una foto a PNG. La herramienta te muestra el porcentaje para que lo detectes al momento.',
    },
  ],
  '/convertir-imagenes': [
    {
      q: '¿La conversión es real o solo cambia la extensión?',
      a: 'Es real. La imagen se decodifica y se vuelve a codificar en el formato elegido, por lo que el archivo resultante es un JPG, PNG, WEBP o AVIF válido que cualquier programa reconoce.',
    },
    {
      q: '¿Qué formato elijo para mi web?',
      a: 'WEBP es la opción más equilibrada: lo soportan todos los navegadores actuales y pesa bastante menos que JPG. AVIF comprime todavía más, aunque tarda más en generarse.',
    },
    {
      q: '¿Se mantiene la transparencia?',
      a: 'Sí en PNG, WEBP y AVIF. JPG no admite transparencia, así que las zonas transparentes se rellenan de blanco.',
    },
    {
      q: '¿Puedo convertir HEIC a JPG?',
      a: 'Solo si tu navegador puede abrir HEIC (Safari en iPhone y Mac). En Chrome o Firefox, configura la cámara del móvil en «Más compatible» o exporta la foto como JPG antes.',
    },
  ],
  '/convertir-jpg-a-png': [
    {
      q: '¿Mejora la calidad al pasar de JPG a PNG?',
      a: 'No. PNG guarda la imagen sin añadir más pérdida, pero no recupera el detalle que ya perdió el JPG. Lo que sí consigues es que futuras ediciones no degraden más la imagen.',
    },
    {
      q: '¿Por qué el PNG pesa más que el JPG?',
      a: 'Porque PNG no descarta información. En fotografías el archivo puede ser de 3 a 10 veces más pesado. Si buscas ligereza con transparencia, usa WEBP.',
    },
    {
      q: '¿Puedo convertir varios JPG a PNG a la vez?',
      a: 'Sí, súbelos todos juntos, pulsa procesar y descárgalos en un único ZIP.',
    },
  ],
  '/convertir-png-a-webp': [
    {
      q: '¿WEBP conserva la transparencia del PNG?',
      a: 'Sí. WEBP admite canal alfa, así que logotipos y recortes mantienen su fondo transparente con un peso mucho menor.',
    },
    {
      q: '¿Cuánto se reduce el peso?',
      a: 'En fotografías guardadas como PNG la reducción suele superar el 70-80 %. En gráficos sencillos depende del contenido; la herramienta te muestra el porcentaje exacto de cada imagen.',
    },
    {
      q: '¿Todos los navegadores muestran WEBP?',
      a: 'Sí, todos los navegadores modernos (Chrome, Safari, Firefox y Edge) muestran WEBP desde hace años.',
    },
  ],
  '/imagenes-para-redes-sociales': [
    {
      q: '¿Qué tamaño tiene una publicación de Instagram?',
      a: 'Cuadrada 1080×1080 px, vertical 1080×1350 px (4:5) y Stories o Reels 1080×1920 px (9:16). La vertical 4:5 es la que más espacio ocupa en el feed.',
    },
    {
      q: '¿Qué tamaño tiene una miniatura de YouTube?',
      a: '1280×720 px (16:9) y menos de 2 MB. Si tu miniatura pesa más, usa la opción de peso máximo.',
    },
    {
      q: '¿Cómo convierto una foto horizontal en vertical sin cortar a la persona?',
      a: 'Elige el formato vertical y deja activado el encuadre inteligente: la herramienta detecta rostros y personas y coloca el recorte a su alrededor. Si quieres, puedes mover el marco a mano.',
    },
    {
      q: '¿Y si no quiero recortar nada?',
      a: 'Elige «Encajar»: la foto completa se coloca dentro del formato y el espacio sobrante se rellena con un fondo desenfocado de la propia imagen o con un color.',
    },
  ],
  '/fotos-para-tienda-online': [
    {
      q: '¿Cómo pongo el fondo blanco a la foto de un producto?',
      a: 'Activa «Eliminar fondo con IA», elige el color blanco y procesa. El modelo separa el producto en tu navegador y lo coloca centrado sobre el fondo elegido.',
    },
    {
      q: '¿Qué tamaño recomiendan Shopify y Amazon?',
      a: 'Shopify recomienda imágenes cuadradas de 2048×2048 px. Amazon pide al menos 1000 px en el lado mayor para permitir el zoom; 2000×2000 px con fondo blanco puro es una apuesta segura.',
    },
    {
      q: '¿La eliminación de fondo sube mis fotos?',
      a: 'No. El modelo de IA se descarga una vez (unos 95 MB, queda en caché) y se ejecuta en tu dispositivo. La primera vez tarda más; después es mucho más rápido.',
    },
    {
      q: '¿Para qué sirve el margen?',
      a: 'Deja aire alrededor del producto para que no toque los bordes. Un margen del 8-12 % da un aspecto uniforme en las cuadrículas de catálogo.',
    },
  ],
  '/redimensionar-varias-imagenes': [
    {
      q: '¿Cómo redimensiono muchas fotos a la vez?',
      a: 'Arrastra todas las fotos juntas, elige el tamaño, el formato y la calidad una sola vez y pulsa procesar. Al terminar, descárgalas en un ZIP.',
    },
    {
      q: '¿Qué pasa si las fotos tienen proporciones distintas?',
      a: 'Con la proporción bloqueada, cada foto se escala para caber en las medidas sin deformarse. Si eliges un formato exacto, cada foto se recorta con su propio encuadre inteligente, que puedes revisar una a una.',
    },
    {
      q: '¿Se procesan en paralelo?',
      a: 'Sí. Las imágenes se reparten entre varios procesos en segundo plano (Web Workers) para aprovechar los núcleos de tu procesador sin bloquear la página.',
    },
  ],
  '/encuadre-inteligente': [
    {
      q: '¿Cómo detecta el elemento principal?',
      a: 'Usa dos modelos de IA de MediaPipe que se ejecutan en tu navegador: uno detecta rostros y otro reconoce 80 tipos de objetos, como personas, animales, vehículos o productos. Si no encuentra nada reconocible, analiza bordes, color y tonos de piel para localizar la zona más interesante.',
    },
    {
      q: '¿Puedo corregir el encuadre?',
      a: 'Sí. Arrastra el marco, usa la rueda del ratón o el control de zoom, o las flechas del teclado. El botón «Volver al encuadre inteligente» deshace tus cambios.',
    },
    {
      q: '¿Qué ocurre si el elemento no cabe en el nuevo formato?',
      a: 'La herramienta te avisa y prioriza el rostro o la parte superior del sujeto. También puedes elegir «Encajar» para no recortar nada.',
    },
  ],
  '/ampliar-imagen': [
    {
      q: '¿Cómo convierto una foto cuadrada en horizontal sin bandas negras?',
      a: 'Elige las medidas finales y un tipo de relleno. El desenfocado y el espejo amplían el fondo a partir de la propia foto en tu navegador. La ampliación con IA genera contenido nuevo coherente con la escena.',
    },
    {
      q: '¿La ampliación con IA es gratuita?',
      a: 'La ampliación generativa usa un servicio externo de pago (Stability AI) y solo está disponible si el responsable de la web la ha activado. Los rellenos locales siempre son gratis y no envían la imagen a ningún sitio.',
    },
    {
      q: '¿Qué se envía al usar la IA generativa?',
      a: 'Una copia reducida de tu imagen y las medidas a ampliar se envían a Stability AI a través de nuestro servidor, que no guarda nada. Antes de enviar se te pide confirmación.',
    },
  ],
}

export const faqsFor = (path: string) => (path === '/' ? HOME_FAQS : (PAGE_FAQS[path] ?? []))
