export interface Preset {
  id: string
  group: string
  name: string
  width: number
  height: number
  note?: string
}

export interface PresetGroup {
  id: string
  label: string
  kind: 'social' | 'web' | 'docs'
  presets: Preset[]
}

const g = (id: string, label: string, kind: PresetGroup['kind'], list: Omit<Preset, 'group' | 'id'>[]): PresetGroup => ({
  id,
  label,
  kind,
  presets: list.map((p, i) => ({ ...p, group: id, id: `${id}-${i}-${p.width}x${p.height}` })),
})

export const PRESET_GROUPS: PresetGroup[] = [
  g('instagram', 'Instagram', 'social', [
    { name: 'Publicación cuadrada', width: 1080, height: 1080, note: '1:1' },
    { name: 'Publicación vertical', width: 1080, height: 1350, note: '4:5 · la que más ocupa en el feed' },
    { name: 'Vertical cuadrícula', width: 1080, height: 1440, note: '3:4 · formato de la cuadrícula de perfil' },
    { name: 'Stories y Reels', width: 1080, height: 1920, note: '9:16' },
    { name: 'Publicación horizontal', width: 1080, height: 566, note: '1.91:1' },
  ]),
  g('tiktok', 'TikTok', 'social', [
    { name: 'Vídeo / foto vertical', width: 1080, height: 1920, note: '9:16' },
    { name: 'Carrusel de fotos', width: 1080, height: 1440, note: '3:4' },
  ]),
  g('youtube', 'YouTube', 'social', [
    { name: 'Miniatura', width: 1280, height: 720, note: '16:9 · máx. 2 MB' },
    { name: 'Banner del canal', width: 2560, height: 1440, note: 'zona segura central 1546×423' },
    { name: 'Publicación de comunidad', width: 1080, height: 1080, note: '1:1' },
  ]),
  g('facebook', 'Facebook', 'social', [
    { name: 'Publicación cuadrada', width: 1080, height: 1080, note: '1:1' },
    { name: 'Publicación vertical', width: 1080, height: 1350, note: '4:5' },
    { name: 'Enlace / horizontal', width: 1200, height: 630, note: '1.91:1' },
    { name: 'Portada de página', width: 1702, height: 630, note: '2× de 851×315' },
  ]),
  g('x', 'X (Twitter)', 'social', [
    { name: 'Imagen de publicación', width: 1600, height: 900, note: '16:9' },
    { name: 'Publicación cuadrada', width: 1080, height: 1080, note: '1:1' },
    { name: 'Cabecera de perfil', width: 1500, height: 500, note: '3:1' },
  ]),
  g('linkedin', 'LinkedIn', 'social', [
    { name: 'Publicación horizontal', width: 1200, height: 627, note: '1.91:1' },
    { name: 'Publicación cuadrada', width: 1080, height: 1080, note: '1:1' },
    { name: 'Banner de perfil', width: 1584, height: 396, note: '4:1' },
  ]),
  g('whatsapp', 'WhatsApp', 'social', [
    { name: 'Foto de perfil', width: 640, height: 640, note: '1:1 · se muestra en círculo' },
    { name: 'Estado', width: 1080, height: 1920, note: '9:16' },
  ]),
  g('pinterest', 'Pinterest', 'social', [{ name: 'Pin vertical', width: 1000, height: 1500, note: '2:3' }]),
  g('web', 'Web y blog', 'web', [
    { name: 'Imagen destacada de blog', width: 1200, height: 675, note: '16:9' },
    { name: 'Cabecera / hero web', width: 1920, height: 1080, note: 'Full HD' },
    { name: 'Vista previa al compartir (Open Graph)', width: 1200, height: 630, note: '1.91:1' },
    { name: 'Miniatura web', width: 600, height: 400, note: '3:2' },
  ]),
  g('shop', 'Tiendas online', 'web', [
    { name: 'Producto cuadrado (Shopify)', width: 2048, height: 2048, note: '1:1 · permite zoom' },
    { name: 'Producto Amazon', width: 2000, height: 2000, note: '1:1 · fondo blanco recomendado' },
    { name: 'Producto WooCommerce', width: 1200, height: 1200, note: '1:1' },
    { name: 'Producto Etsy', width: 2000, height: 1500, note: '4:3' },
    { name: 'Producto eBay', width: 1600, height: 1600, note: '1:1' },
  ]),
  g('docs', 'Documentos', 'docs', [
    { name: 'A4 vertical (300 ppp)', width: 2480, height: 3508, note: 'impresión' },
    { name: 'A4 horizontal (300 ppp)', width: 3508, height: 2480, note: 'impresión' },
    { name: 'DNI / pasaporte España 26×32 mm', width: 307, height: 378, note: '300 ppp' },
    { name: 'Foto tipo carné 35×45 mm', width: 413, height: 531, note: 'visados y UE · 300 ppp' },
    { name: 'EE. UU. 2×2 pulgadas', width: 600, height: 600, note: '51×51 mm · 300 ppp' },
    { name: 'Foto de perfil / CV', width: 800, height: 800, note: '1:1' },
  ]),
]

export const ALL_PRESETS: Preset[] = PRESET_GROUPS.flatMap((grp) => grp.presets)

export const findPreset = (id: string | null) => (id ? ALL_PRESETS.find((p) => p.id === id) ?? null : null)

export const presetLabel = (p: Preset) => {
  const grp = PRESET_GROUPS.find((x) => x.id === p.group)
  return `${grp?.label ?? ''} · ${p.name}`
}
