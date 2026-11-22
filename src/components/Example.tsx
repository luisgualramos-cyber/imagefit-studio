/**
 * Ejemplo visual «antes / después» de cada herramienta.
 * Muestra medidas y pesos típicos de un caso real habitual (foto de móvil, captura, etc.).
 * Los pesos son orientativos: dependen del contenido de cada foto.
 */

interface Side {
  w: number
  h: number
  /** Texto del peso, p. ej. «3,1 MB» */
  size: string
  fmt: string
  label: string
}

interface ExampleData {
  title: string
  before: Side
  after: Side
  note: string
}

export const EXAMPLES: Record<string, ExampleData> = {
  '/comprimir-imagenes': {
    title: 'Mismo tamaño, mucho menos peso',
    before: { w: 4032, h: 3024, size: '3,1 MB', fmt: 'JPG', label: 'Foto original' },
    after: { w: 4032, h: 3024, size: '≈ 900 KB', fmt: 'WEBP 80 %', label: 'Comprimida en WEBP al 80 %' },
    note: 'No se pierde resolución: solo se elimina información que el ojo no aprecia. Usa el comparador para verlo en tu propia foto.',
  },
  '/convertir-imagenes': {
    title: 'Una captura de pantalla de PNG a WEBP',
    before: { w: 1920, h: 1080, size: '1,8 MB', fmt: 'PNG', label: 'Captura en PNG' },
    after: { w: 1920, h: 1080, size: '≈ 250 KB', fmt: 'WEBP', label: 'Convertida a WEBP' },
    note: 'Es una conversión real del archivo, no un cambio de extensión: el WEBP se abre en cualquier navegador actual.',
  },
  '/ampliar-imagen': {
    title: 'De cuadrada a horizontal sin bandas negras',
    before: { w: 1080, h: 1080, size: '420 KB', fmt: 'JPG', label: 'Imagen cuadrada' },
    after: { w: 1920, h: 1080, size: '≈ 520 KB', fmt: 'JPG', label: 'Ampliada a 16:9' },
    note: 'Los laterales se rellenan con un fondo desenfocado o en espejo a partir de la propia foto.',
  },
  '/foto-dni': {
    title: 'De foto de móvil a foto de DNI',
    before: { w: 3024, h: 4032, size: '2,9 MB', fmt: 'JPG', label: 'Foto hecha con el móvil' },
    after: { w: 307, h: 378, size: '≈ 60 KB', fmt: 'JPG 95 %', label: '32 × 26 mm a 300 ppp' },
    note: 'La cara queda centrada con el encuadre inteligente. Recuerda que el fondo tiene que ser blanco desde el principio.',
  },
  '/foto-pasaporte': {
    title: 'De foto de móvil a foto de pasaporte',
    before: { w: 3024, h: 4032, size: '2,9 MB', fmt: 'JPG', label: 'Foto hecha con el móvil' },
    after: { w: 307, h: 378, size: '≈ 60 KB', fmt: 'JPG 95 %', label: '32 × 26 mm a 300 ppp' },
    note: 'Imprímela en papel fotográfico de buena calidad, a 32 × 26 mm. Si haces el DNI el mismo día, no hace falta llevarla.',
  },
  '/foto-tie': {
    title: 'De foto de móvil a foto para la TIE',
    before: { w: 3024, h: 4032, size: '2,9 MB', fmt: 'JPG', label: 'Foto hecha con el móvil' },
    after: { w: 307, h: 378, size: '≈ 60 KB', fmt: 'JPG 95 %', label: '32 × 26 mm a 300 ppp' },
    note: 'Imprímela a 32 × 26 mm. El fondo tiene que ser blanco y liso desde el principio: la herramienta no lo cambia.',
  },
  '/foto-carnet-conducir': {
    title: 'De foto de móvil a foto para la DGT',
    before: { w: 3024, h: 4032, size: '2,9 MB', fmt: 'JPG', label: 'Foto hecha con el móvil' },
    after: { w: 307, h: 378, size: '≈ 60 KB', fmt: 'JPG 95 %', label: '32 × 26 mm a 300 ppp' },
    note: 'Misma medida que el DNI: imprímela en papel fotográfico indicando 32 × 26 mm.',
  },
  '/miniatura-youtube': {
    title: 'Miniatura dentro de los límites de YouTube',
    before: { w: 3840, h: 2160, size: '6,5 MB', fmt: 'PNG', label: 'Captura 4K del vídeo' },
    after: { w: 1280, h: 720, size: '≈ 350 KB', fmt: 'JPG', label: '1280 × 720, menos de 2 MB' },
    note: 'YouTube recomienda 1280 × 720 y un máximo de 2 MB para las miniaturas personalizadas.',
  },
  '/reducir-fotos-para-email': {
    title: 'Fotos que caben en un correo',
    before: { w: 4032, h: 3024, size: '3,1 MB', fmt: 'JPG', label: 'Cada foto del móvil' },
    after: { w: 1600, h: 1200, size: '≈ 300 KB', fmt: 'JPG', label: 'Reducida para enviar' },
    note: 'Diez fotos pasan de unos 31 MB, que muchos correos rechazan, a unos 3 MB.',
  },
  '/convertir-heic-a-jpg': {
    title: 'Foto del iPhone que se abre en cualquier sitio',
    before: { w: 4032, h: 3024, size: '1,6 MB', fmt: 'HEIC', label: 'Foto del iPhone' },
    after: { w: 4032, h: 3024, size: '≈ 2,4 MB', fmt: 'JPG 90 %', label: 'Convertida a JPG' },
    note: 'El JPG suele pesar algo más que el HEIC, pero lo abre cualquier ordenador, web o formulario.',
  },
  '/convertir-webp-a-jpg': {
    title: 'Imagen de una web para editarla o imprimirla',
    before: { w: 1200, h: 800, size: '85 KB', fmt: 'WEBP', label: 'Imagen descargada de una web' },
    after: { w: 1200, h: 800, size: '≈ 140 KB', fmt: 'JPG', label: 'Convertida a JPG' },
    note: 'Útil para programas antiguos o formularios que todavía no aceptan WEBP.',
  },
  '/convertir-png-a-jpg': {
    title: 'Una foto guardada en PNG que pesaba demasiado',
    before: { w: 1920, h: 1080, size: '2,1 MB', fmt: 'PNG', label: 'Foto en PNG' },
    after: { w: 1920, h: 1080, size: '≈ 350 KB', fmt: 'JPG 85 %', label: 'Convertida a JPG' },
    note: 'Si la imagen tenía partes transparentes, se rellenan con el color de fondo que elijas.',
  },
  '/recortar-imagen': {
    title: 'Recorte cuadrado sin cortar a nadie',
    before: { w: 4032, h: 3024, size: '3,1 MB', fmt: 'JPG', label: 'Foto horizontal' },
    after: { w: 3024, h: 3024, size: '≈ 2,3 MB', fmt: 'JPG', label: 'Recorte 1:1' },
    note: 'El encuadre inteligente sitúa el recorte sobre las personas o el objeto principal.',
  },
  '/redimensionar-imagen-en-cm': {
    title: 'Foto para imprimir en 15 × 10 cm',
    before: { w: 4032, h: 3024, size: '3,1 MB', fmt: 'JPG', label: 'Foto original' },
    after: { w: 1772, h: 1181, size: '≈ 600 KB', fmt: 'JPG', label: '15 × 10 cm a 300 ppp' },
    note: '300 ppp es la resolución que usan las tiendas de revelado para una copia nítida.',
  },
}

const fmtPx = (n: number) => n.toLocaleString('es-ES')

function Frame({ s, scale, accent }: { s: Side; scale: number; accent?: boolean }) {
  const BOX = 150
  const max = Math.max(s.w, s.h)
  const k = Math.max(scale, 0.3)
  const w = (s.w / max) * BOX * k
  const h = (s.h / max) * BOX * k
  return (
    <figure className="flex flex-col items-center text-center">
      <div className="grid size-[160px] place-items-center">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${fmtPx(s.w)} × ${fmtPx(s.h)} píxeles`}>
          <rect x="0.75" y="0.75" width={w - 1.5} height={h - 1.5} rx="6" className={accent ? 'fill-accent-soft stroke-accent' : 'fill-paper stroke-ink/40'} strokeWidth="1.5" />
          <path d={`M${w * 0.18} ${h * 0.78} L${w * 0.42} ${h * 0.45} L${w * 0.58} ${h * 0.64} L${w * 0.7} ${h * 0.52} L${w * 0.84} ${h * 0.78} Z`} className={accent ? 'fill-accent/40' : 'fill-ink/15'} />
          <circle cx={w * 0.7} cy={h * 0.3} r={Math.min(w, h) * 0.08} className={accent ? 'fill-accent/50' : 'fill-ink/20'} />
        </svg>
      </div>
      <figcaption className="mt-2">
        <span className="block text-xs font-semibold tracking-wide text-muted uppercase">{s.label}</span>
        <span className="mt-1 block font-bold">
          {fmtPx(s.w)} × {fmtPx(s.h)} px
        </span>
        <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-sm font-semibold ${accent ? 'bg-accent-dark text-white' : 'bg-paper text-ink'}`}>
          {s.size} · {s.fmt}
        </span>
      </figcaption>
    </figure>
  )
}

export default function Example({ path }: { path: string }) {
  const ex = EXAMPLES[path]
  if (!ex) return null
  const maxB = Math.max(ex.before.w, ex.before.h)
  const maxA = Math.max(ex.after.w, ex.after.h)
  const top = Math.max(maxA, maxB)
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 md:px-6" aria-labelledby="ejemplo-titulo">
      <div className="rounded-2xl border border-line bg-white p-5 md:p-7">
        <p className="text-xs font-semibold tracking-wide text-accent-dark uppercase">Ejemplo de uso</p>
        <h2 id="ejemplo-titulo" className="mt-1 text-xl font-bold md:text-2xl">
          {ex.title}
        </h2>
        <div className="mt-5 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10">
          <Frame s={ex.before} scale={maxB / top} />
          <span className="text-3xl font-bold text-accent-dark" aria-hidden>
            →
          </span>
          <Frame s={ex.after} scale={maxA / top} accent />
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm text-muted">
          {ex.note} <span className="whitespace-nowrap">Pesos orientativos: dependen de cada foto.</span>
        </p>
      </div>
    </section>
  )
}
