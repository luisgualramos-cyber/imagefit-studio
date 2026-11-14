/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_ADSENSE_CLIENT?: string
  readonly VITE_ADSENSE_SLOT_BELOW_TOOL?: string
  readonly VITE_ADSENSE_SLOT_BETWEEN?: string
  readonly VITE_ADSENSE_SLOT_AFTER_TOOLS?: string
  readonly VITE_ADSENSE_SLOT_BOTTOM?: string
  readonly VITE_ADSENSE_SLOT_SIDEBAR?: string
  readonly VITE_OWNER_NAME?: string
  readonly VITE_OWNER_NIF?: string
  readonly VITE_OWNER_ADDRESS?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
