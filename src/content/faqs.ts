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
    a: 'Puedes abrir JPG, PNG, WEBP, AVIF, HEIC (fotos de iPhone), GIF (primer fotograma) y BMP. Puedes exportar a JPG, PNG, WEBP y AVIF.',
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
    {
      q: '¿Cómo redimensiono muchas fotos a la vez?',
      a: 'Arrastra todas las fotos juntas, elige el tamaño, el formato y la calidad una sola vez y pulsa procesar. Al terminar, descárgalas en un ZIP.',
    },
    {
      q: '¿Qué pasa si las fotos tienen proporciones distintas?',
      a: 'Con la proporción bloqueada, cada foto se escala para caber en las medidas sin deformarse. Si eliges un formato exacto, cada foto se recorta con su propio encuadre inteligente, que puedes revisar una a una.',
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
      a: 'Sí. Las fotos HEIC del iPhone se abren en cualquier navegador: si el tuyo no las admite, se decodifican con libheif en WebAssembly dentro de tu dispositivo. Tienes una página específica en «Convertir HEIC a JPG».',
    },
    {
      q: '¿Mejora la calidad al pasar de JPG a PNG?',
      a: 'No. PNG guarda la imagen sin añadir más pérdida, pero no recupera el detalle que ya perdió el JPG. Lo que sí consigues es que futuras ediciones no degraden más la imagen.',
    },
    {
      q: '¿Cuánto se reduce el peso al pasar de PNG a WEBP?',
      a: 'En fotografías guardadas como PNG la reducción suele superar el 70-80 %. En gráficos sencillos depende del contenido; la herramienta te muestra el porcentaje exacto de cada imagen.',
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
  '/comprimir-foto-a-100kb': [
    {
      q: '¿Cómo reduzco una foto a menos de 100 KB?',
      a: 'Sube la foto y pulsa procesar: ya viene configurada con un peso máximo de 100 KB y un tamaño de 1280 px en el lado mayor. La herramienta prueba varias calidades y se queda con la más alta que no pasa de 100 KB.',
    },
    {
      q: '¿Y si necesito 50 KB, 200 KB o 1 MB?',
      a: 'Cambia el número en «Peso máximo (KB)». Para 1 MB escribe 1000. Si el límite es muy bajo, reduce también el ancho en píxeles: es lo que más peso ahorra.',
    },
    {
      q: '¿Se va a ver mal la foto?',
      a: 'A 1280 px y 100 KB una foto normal se ve bien en pantalla. Si la herramienta no puede llegar al límite con buena calidad, te avisará. Puedes comparar el antes y el después antes de descargar.',
    },
  ],
  '/foto-dni': [
    {
      q: '¿Qué tamaño tiene la foto del DNI?',
      a: '32 por 26 milímetros (32 de alto y 26 de ancho), en color, según el artículo 6.2.d del Real Decreto 255/2025. A 300 ppp equivale a 307 × 378 píxeles.',
    },
    {
      q: '¿El fondo tiene que ser blanco?',
      a: 'Sí. La norma pide un fondo uniforme blanco y liso. Esta herramienta no cambia el fondo, así que hazte la foto delante de una pared blanca y sin sombras.',
    },
    {
      q: '¿Sirve la misma foto para renovar el DNI?',
      a: 'Sí. El artículo 8.2 del Real Decreto 255/2025 pide para la renovación una fotografía con las mismas características del artículo 6.2.d.',
    },
  ],
  '/foto-carnet-conducir': [
    {
      q: '¿Qué tamaño tiene la foto del carné de conducir?',
      a: 'La DGT pide una fotografía original y actual de 32 × 26 mm, en color, con fondo liso, tomada de frente, con la cabeza descubierta y sin gafas de cristales oscuros.',
    },
    {
      q: '¿Tengo que llevar foto si ya la presenté antes?',
      a: 'La DGT indica que desde el 6 de noviembre de 2024 ya no es necesario volver a presentar el talón-foto o las fotografías cuando ya dispone de tu documentación. Revisa en su sede si tu trámite concreto la pide.',
    },
    {
      q: '¿Se admite la foto con velo?',
      a: 'Sí. La DGT admite fotografías con velo por motivos religiosos siempre que el óvalo de la cara quede descubierto, desde el nacimiento del pelo hasta el mentón.',
    },
  ],
  '/redimensionar-foto-whatsapp': [
    {
      q: '¿Por qué se corta mi foto de perfil de WhatsApp?',
      a: 'WhatsApp recorta la foto en un cuadrado y la muestra en un círculo. Si tu foto es vertical u horizontal, la cara puede quedar fuera. Aquí se recorta en cuadrado centrado en tu cara y ves el resultado antes de subirla.',
    },
    {
      q: '¿Qué tamaño tienen los estados de WhatsApp?',
      a: '1080×1920 píxeles (9:16), igual que las Stories de Instagram. Si tu foto es horizontal, puedes recortarla o encajarla con un fondo desenfocado.',
    },
    {
      q: '¿Pierde calidad al subirla a WhatsApp?',
      a: 'WhatsApp vuelve a comprimir las imágenes. Subir una foto ya ajustada al tamaño correcto y bien comprimida reduce esa pérdida.',
    },
  ],
  '/miniatura-youtube': [
    {
      q: '¿Qué tamaño debe tener una miniatura de YouTube?',
      a: '1280×720 píxeles, proporción 16:9, como mínimo 640 px de ancho y como máximo 2 MB. Se admiten JPG, PNG y GIF.',
    },
    {
      q: 'Mi miniatura pesa más de 2 MB, ¿qué hago?',
      a: 'Súbela aquí: ya viene configurada en JPG con un límite de 1950 KB, así que siempre quedará por debajo de los 2 MB que exige YouTube.',
    },
    {
      q: '¿Puedo usar una foto vertical?',
      a: 'Sí. Se recorta a 16:9 manteniendo a la persona u objeto principal en el encuadre. Si prefieres no recortar, elige «Encajar» y el hueco se rellena con la propia imagen desenfocada.',
    },
  ],
  '/reducir-fotos-para-email': [
    {
      q: '¿Cuánto pueden ocupar los adjuntos de un correo?',
      a: 'Gmail y Outlook limitan los adjuntos a unos 20-25 MB por correo. Una foto de móvil ocupa entre 3 y 8 MB, así que con cinco fotos ya puedes pasarte.',
    },
    {
      q: '¿Cuánto se reducen las fotos?',
      a: 'Con la configuración de esta página (1600 px y un máximo de 400 KB por foto) una foto de 5 MB suele quedar en unos 250-400 KB. Así caben más de 50 fotos en un correo.',
    },
    {
      q: '¿Puedo reducir muchas fotos a la vez?',
      a: 'Sí. Arrástralas todas, pulsa procesar y descarga un ZIP. Puedes adjuntar el ZIP directamente o descomprimirlo y adjuntar las fotos.',
    },
  ],
  '/convertir-heic-a-jpg': [
    {
      q: '¿Qué es un archivo HEIC?',
      a: 'Es el formato en el que el iPhone guarda las fotos desde iOS 11 (opción «Alta eficiencia» de la cámara). Ocupa aproximadamente la mitad que un JPG con la misma calidad, pero muchos programas de Windows, webs y formularios no lo aceptan.',
    },
    {
      q: '¿Se suben mis fotos a algún servidor para convertirlas?',
      a: 'No. La conversión se hace en tu navegador con libheif compilado a WebAssembly. Las fotos nunca salen de tu ordenador o tu móvil.',
    },
    {
      q: '¿Se pierde calidad al pasar de HEIC a JPG?',
      a: 'Con la calidad 92 que viene configurada la diferencia no se aprecia. El JPG ocupará algo más que el HEIC original, porque es un formato menos eficiente.',
    },
    {
      q: '¿Cómo hago que el iPhone haga las fotos directamente en JPG?',
      a: 'En el iPhone ve a Ajustes → Cámara → Formatos y elige «Más compatible». Para que al pasarlas al ordenador se conviertan solas, ve a Ajustes → Fotos y marca «Automático» en «Transferir a Mac o PC».',
    },
  ],
  '/convertir-webp-a-jpg': [
    {
      q: '¿Por qué mis imágenes se descargan en WEBP?',
      a: 'Muchas webs sirven sus imágenes en WEBP porque pesan menos que JPG. El problema es que algunos programas antiguos, formularios y redes no lo aceptan. Al convertirlas a JPG puedes usarlas en cualquier sitio.',
    },
    {
      q: '¿Se pierde calidad al pasar de WEBP a JPG?',
      a: 'Con la calidad 92 que viene configurada la diferencia no se aprecia. El JPG suele pesar algo más que el WEBP original porque es un formato menos eficiente.',
    },
    {
      q: '¿Qué pasa con las zonas transparentes?',
      a: 'JPG no admite transparencia, así que se rellenan de blanco. Si necesitas conservarla, convierte a PNG en su lugar.',
    },
    {
      q: '¿Puedo convertir archivos JFIF a JPG?',
      a: 'Sí. Un archivo .jfif es en realidad un JPEG con otra extensión: súbelo y descárgalo como JPG para que cualquier programa lo reconozca.',
    },
  ],
  '/convertir-png-a-jpg': [
    {
      q: '¿Cuándo conviene pasar de PNG a JPG?',
      a: 'Cuando la imagen es una foto o una captura con muchos colores y no necesitas transparencia. El JPG pesa mucho menos y es aceptado en todas partes.',
    },
    {
      q: '¿Qué pasa con el fondo transparente del PNG?',
      a: 'JPG no admite transparencia, por lo que las zonas transparentes se rellenan de blanco. Si prefieres otro color, elige «Medidas» o «Formatos», «Encajar» y el color de relleno que quieras.',
    },
    {
      q: '¿Se pierde calidad?',
      a: 'JPG comprime con pérdida, pero con calidad 90 o superior la diferencia no se ve en fotos. En logotipos con bordes nítidos o texto pequeño, PNG o WEBP siguen siendo mejores opciones.',
    },
  ],
  '/recortar-imagen': [
    {
      q: '¿Cómo recorto una imagen a una proporción concreta?',
      a: 'Elige una proporción en el paso 1 (cuadrado 1:1, vertical 4:5, 16:9…) o escribe medidas propias. Aparecerá un marco sobre la foto que puedes arrastrar y ampliar con el zoom para elegir la zona exacta.',
    },
    {
      q: '¿Puedo recortar varias fotos a la vez?',
      a: 'Sí. Súbelas juntas: todas se recortan con la misma proporción y cada una con su propio encuadre, que puedes ajustar una a una antes de descargar el ZIP.',
    },
    {
      q: '¿Qué hace el encuadre inteligente?',
      a: 'Detecta caras, personas y objetos con IA en tu navegador y coloca el marco a su alrededor para que no queden cortados. Si no te convence, mueve el marco a mano.',
    },
    {
      q: '¿Puedo recortar en círculo?',
      a: 'De momento el recorte es rectangular. Para fotos de perfil que se muestran en círculo (WhatsApp, Instagram), usa el formato cuadrado y deja la cara centrada.',
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
  '/redimensionar-imagen-en-cm': [
    {
      q: '¿Cuántos píxeles son 10 cm?',
      a: 'Depende de la resolución. A 300 ppp, la habitual para imprimir, 10 cm son 1181 píxeles. A 150 ppp son 591 píxeles y a 72 ppp, 283. La fórmula es: píxeles = centímetros ÷ 2,54 × ppp.',
    },
    {
      q: '¿Qué resolución elijo para imprimir?',
      a: '300 ppp para fotos que se verán de cerca (álbumes, documentos). Para pósters o carteles que se ven a distancia bastan 150 ppp.',
    },
    {
      q: '¿Mi foto tiene píxeles suficientes para imprimirla a ese tamaño?',
      a: 'Compara los píxeles que necesitas con los que tiene tu foto (aparecen en su miniatura). Si necesitas muchos más, la imagen se ampliará y perderá nitidez; en ese caso, imprime más pequeño o baja a 150-200 ppp.',
    },
  ],
  '/foto-pasaporte': [
    {
      q: '¿Me sirve la misma foto que para el DNI?',
      a: 'Sí. El pasaporte y el DNI piden la misma foto: 32 × 26 mm, en color, de frente y con fondo uniforme blanco y liso. Además, si haces o renuevas el DNI el mismo día que el pasaporte, no hace falta llevar foto para el pasaporte.',
    },
    {
      q: '¿Puedo imprimir la foto en casa?',
      a: 'El Ministerio del Interior pide que la foto sea de alta resolución y esté en papel fotográfico de buena calidad. Una impresora doméstica con papel normal no cumple; con papel fotográfico y buena calidad de impresión, comprueba con una regla que mide 32 × 26 mm.',
    },
    {
      q: '¿Cuántos píxeles tiene una foto de pasaporte?',
      a: 'La norma la define en milímetros (32 × 26). Para imprimirla a 300 ppp, la resolución habitual, son 307 píxeles de ancho por 378 de alto, que es lo que genera esta herramienta.',
    },
    {
      q: '¿Se puede llevar gafas en la foto del pasaporte?',
      a: 'La norma prohíbe las gafas de cristales oscuros y cualquier prenda que impida la identificación. Si usas gafas graduadas, asegúrate de que no hay reflejos y de que los ojos se ven con claridad.',
    },
  ],
  '/foto-tie': [
    {
      q: '¿Qué medida tiene la foto de la TIE?',
      a: 'La Policía Nacional indica que se utiliza una fotografía reciente en color, del rostro, de 32 × 26 milímetros, con fondo uniforme blanco y liso y tomada de frente. En la lista de documentación aparece como «tamaño carné»: es la misma foto.',
    },
    {
      q: '¿Puedo usar una foto que me hice hace un año?',
      a: 'Sí, si sigue pareciéndose a ti. Según la Policía Nacional, la foto tiene que representar fielmente tu imagen y se admite una antigüedad de hasta dos años, siempre que refleje tu imagen actual.',
    },
    {
      q: '¿Necesito foto para renovar la TIE o pedir un duplicado?',
      a: 'Sí. En la documentación de la renovación, del duplicado por robo, pérdida o deterioro y del cambio de datos de la tarjeta, la Policía Nacional incluye una fotografía reciente, en color, con fondo blanco y tamaño carné.',
    },
    {
      q: '¿Me sirve la foto de mi pasaporte?',
      a: 'Si es reciente, mide 32 × 26 mm, está en color y tiene el fondo blanco y liso, cumple los mismos requisitos. Lleva siempre una copia impresa en papel fotográfico a la cita.',
    },
  ],
  '/fotos-tramites-espana': [
    {
      q: '¿Me sirve la misma foto para el DNI y para el carné de conducir?',
      a: 'Sí, si la haces con fondo blanco. Los dos piden 32 × 26 mm y en color; el DNI exige además un fondo uniforme blanco y liso, mientras que la DGT pide fondo liso. Una foto con fondo blanco liso cumple ambos requisitos.',
    },
    {
      q: '¿Puedo poner el fondo blanco con la herramienta de quitar fondo?',
      a: 'Se puede, pero no lo recomendamos para documentos oficiales: el recorte automático puede dejar bordes irregulares en el pelo y una foto retocada podría no ser aceptada. Lo más seguro es hacer la foto delante de una pared blanca y lisa.',
    },
    {
      q: '¿Cuántos píxeles tiene una foto de 32 × 26 mm?',
      a: 'A 300 ppp, la resolución habitual de impresión, son 307 píxeles de ancho por 378 de alto. Al imprimirla, indica en la tienda que la foto debe medir 32 × 26 mm.',
    },
    {
      q: '¿La DGT sigue pidiendo foto?',
      a: 'Desde el 6 de noviembre de 2024 no hace falta volver a presentarla en los trámites en los que la DGT ya tiene esa documentación. Algunos trámites la siguen pidiendo, por ejemplo el duplicado por cambio de datos hecho de forma presencial: revisa la ficha de tu trámite en la sede de la DGT.',
    },
    {
      q: '¿Qué peso debe tener la foto para unas oposiciones o una beca?',
      a: 'No hay un límite común: lo fija cada convocatoria o cada formulario. Búscalo en sus instrucciones y escribe ese límite en la herramienta: cuenta 1 KB como 1.000 bytes, así que el archivo nunca lo supera, cuente como cuente la sede. Si usas otro programa, deja un margen (por ejemplo, 90-95 KB para un límite de 100 KB).',
    },
  ],
}

export const faqsFor = (path: string) => (path === '/' ? HOME_FAQS : (PAGE_FAQS[path] ?? []))
