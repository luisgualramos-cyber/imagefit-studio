/** Vercel Function: delega en la lógica común de server/outpaint-core.ts */
import { handleGet, handlePost } from '../server/outpaint-core'

declare const process: { env: Record<string, string | undefined> }

export const maxDuration = 60

export function GET() {
  return handleGet(process.env)
}

export function POST(request: Request) {
  return handlePost(request, process.env)
}
