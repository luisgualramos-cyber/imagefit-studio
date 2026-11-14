/** Cloudflare Pages Function: /api/outpaint (delega en server/outpaint-core.ts) */
import { handleGet, handlePost, type Env } from '../../server/outpaint-core'

interface Ctx {
  request: Request
  env: Env
}

export const onRequestGet = ({ env }: Ctx) => handleGet(env)
export const onRequestPost = ({ request, env }: Ctx) => handlePost(request, env)
