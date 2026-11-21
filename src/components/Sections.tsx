import { Link } from 'react-router'
import type { FaqItem } from '../seo/routes'
import {
  IconCloud,
  IconCompress,
  IconConvert,
  IconCrop,
  IconDownload,
  IconExpand,
  IconResize,
  IconShield,
  IconShop,
  IconSocial,
  IconUpload,
  IconChevron,
} from './Icons'

export const TOOLS = [
  { to: '/redimensionar-imagenes', cta: 'Redimensionar una imagen', title: 'Redimensionar imágenes', short: 'Redimensionar', icon: IconResize, text: 'Cambia el ancho y el alto en píxeles o porcentaje sin deformar la foto.' },
  { to: '/comprimir-imagenes', cta: 'Comprimir una foto', title: 'Comprimir fotografías', short: 'Comprimir', icon: IconCompress, text: 'Reduce el peso eligiendo la calidad o un tamaño máximo en KB.' },
  { to: '/convertir-imagenes', cta: 'Convertir una imagen', title: 'Convertir formatos', short: 'Convertir', icon: IconConvert, text: 'JPG, PNG, WEBP y AVIF reales, no un cambio de extensión.' },
  { to: '/imagenes-para-redes-sociales', cta: 'Adaptar una foto a redes', title: 'Imágenes para redes sociales', short: 'Redes sociales', icon: IconSocial, text: 'Instagram, TikTok, YouTube, Facebook, X y LinkedIn al tamaño exacto.' },
  { to: '/fotos-para-tienda-online', cta: 'Preparar fotos de producto', title: 'Fotos para tiendas online', short: 'Tiendas online', icon: IconShop, text: 'Quita el fondo con IA, ponlo blanco y centra el producto.' },
  { to: '/ampliar-imagen', cta: 'Ampliar el fondo de una imagen', title: 'Ampliar imagen', short: 'Ampliar', icon: IconExpand, text: 'Cambia de cuadrada a horizontal ampliando el fondo, sin bandas vacías.' },
]

export function HowItWorks() {
  const steps = [
    { icon: IconUpload, t: 'Sube una imagen', d: 'Arrastra una o varias fotos, o selecciónalas desde tu ordenador o móvil.' },
    { icon: IconCrop, t: 'Elige formato y opciones', d: 'Tamaño, red social, encuadre, formato de salida y nivel de compresión.' },
    { icon: IconDownload, t: 'Descarga tu imagen optimizada', d: 'Compara el antes y el después y descarga una a una o todas en ZIP.' },
  ]
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6" aria-labelledby="como-funciona">
      <h2 id="como-funciona" className="text-3xl font-bold md:text-4xl">
        Cómo funciona
      </h2>
      <p className="mt-2 max-w-2xl text-muted">Tres pasos, sin instalar programas ni crear una cuenta.</p>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.t} className="relative rounded-2xl border border-line bg-white p-6">
            <span className="font-display absolute top-4 right-5 text-5xl font-extrabold text-[#efece6]">{i + 1}</span>
            <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-dark">
              <s.icon size={22} />
            </span>
            <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
            <p className="mt-1 text-sm text-muted">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function ToolsGrid({ exclude }: { exclude?: string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {TOOLS.filter((t) => t.to !== exclude).map((t) => (
        <li key={t.to}>
          <Link to={t.to} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_18px_40px_-28px_rgba(20,19,31,.5)]">
            <span className="grid size-11 place-items-center rounded-xl bg-ink text-white transition-colors group-hover:bg-accent">
              <t.icon size={21} />
            </span>
            <h3 className="mt-4 text-[17px] font-bold">{t.title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted">{t.text}</p>
            <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-accent-dark">
              {t.cta} <IconChevron size={15} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function UseCases() {
  const cases = [
    { t: 'Creadores de contenido', d: 'Una misma foto en 4:5 para el feed, 9:16 para Stories y 16:9 para la miniatura, sin repetir el trabajo.' },
    { t: 'YouTubers', d: 'Miniaturas de 1280×720 por debajo de 2 MB y banners de canal de 2560×1440.' },
    { t: 'Instagram y TikTok', d: 'Convierte fotos horizontales en verticales sin cortar a las personas gracias al encuadre inteligente.' },
    { t: 'Tiendas online', d: 'Catálogos homogéneos: fondo blanco, producto centrado, mismo tamaño y peso optimizado.' },
    { t: 'Fotógrafos', d: 'Exporta galerías ligeras para enviar a clientes o publicar en la web, en lote y en WEBP.' },
    { t: 'Diseñadores', d: 'Prepara recursos en PNG, WEBP o AVIF a medidas exactas para maquetas y webs.' },
    { t: 'Pequeños negocios', d: 'Fotos para Google, redes sociales y la web del negocio sin contratar a nadie.' },
    { t: 'Formularios y trámites', d: 'Reduce una foto a menos de 200 KB o a medidas de carné para subirla a cualquier sede electrónica.' },
  ]
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6" aria-labelledby="usos">
      <h2 id="usos" className="text-3xl font-bold md:text-4xl">
        ¿Para quién es ImageFit Studio?
      </h2>
      <p className="mt-2 max-w-2xl text-muted">Para cualquiera que necesite una imagen con unas medidas o un peso concretos, hoy mismo.</p>
      <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {cases.map((c) => (
          <li key={c.t} className="border-t-2 border-ink pt-4">
            <h3 className="font-bold">{c.t}</h3>
            <p className="mt-1 text-sm text-muted">{c.d}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Faq({ items, title = 'Preguntas frecuentes', id = 'preguntas' }: { items: FaqItem[]; title?: string; id?: string }) {
  if (!items.length) return null
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-3xl font-bold md:text-4xl">
        {title}
      </h2>
      <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {items.map((f) => (
          <details key={f.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              <h3 className="text-[15px]">{f.q}</h3>
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-paper text-lg transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function PrivacyNote() {
  const local = ['Redimensionar y recortar', 'Comprimir y convertir formatos', 'Adaptar a redes sociales', 'Muchas fotos a la vez y descarga en ZIP', 'Encuadre automático que detecta caras', 'Quitar el fondo automáticamente', 'Ampliar el fondo con desenfoque o espejo']
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6" aria-labelledby="privacidad-titulo">
      <div className="grid gap-4 rounded-[1.6rem] bg-ink p-6 text-white md:grid-cols-[1.1fr_1fr_1fr] md:p-10">
        <div>
          <h2 id="privacidad-titulo" className="text-2xl font-bold md:text-3xl">
            Tus fotos se quedan en tu dispositivo
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Tu ordenador o tu móvil hace todo el trabajo: la foto no viaja por internet. Es más rápido, más privado y no guardamos nada. Así es exactamente:
          </p>
          <Link to="/privacidad" className="mt-4 inline-block text-sm font-semibold text-accent underline underline-offset-4">
            Política de privacidad
          </Link>
        </div>
        <div className="rounded-2xl bg-white/5 p-5">
          <p className="flex items-center gap-2 font-semibold text-[#5ff0c2]">
            <IconShield size={19} /> En tu navegador
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-white/80">
            {local.map((l) => (
              <li key={l}>· {l}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-white/50">Las funciones automáticas descargan una sola vez su «cerebro» (de Google e IMG.LY) y después trabajan en tu equipo; tus imágenes no se envían.</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-5">
          <p className="flex items-center gap-2 font-semibold text-[#aeb1ff]">
            <IconCloud size={19} /> Solo si tú lo pides
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-white/80">
            <li>· Ampliar una imagen inventando el fondo que falta con IA</li>
          </ul>
          <p className="mt-3 text-xs text-white/50">Es la única función que necesita enviar la imagen a un servicio externo (Stability AI). Te lo preguntamos antes, y la imagen no se guarda.</p>
        </div>
      </div>
    </section>
  )
}
