/// <reference lib="webworker" />
import { renderAndEncode } from './render'
import type { RenderJob } from './types'

interface Msg {
  id: number
  blob: Blob
  job: RenderJob
}

self.onmessage = async (e: MessageEvent<Msg>) => {
  const { id, blob, job } = e.data
  try {
    const bmp = await createImageBitmap(blob)
    const res = await renderAndEncode(bmp, bmp.width, bmp.height, job)
    bmp.close()
    ;(self as unknown as Worker).postMessage({ id, ok: true, res })
  } catch (err) {
    ;(self as unknown as Worker).postMessage({
      id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
