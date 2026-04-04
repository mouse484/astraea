import { bech32 } from '@scure/base'
import * as z from 'zod'
import { LnurlPayResponseSchema } from '../luds/06'

const NIP57LnurlExtensionSchema = z.object({
  allowsNostr: z.boolean().optional(),
  nostrPubkey: z.string().trim().optional(),
})

export const LnurlPayResponseWithNIP57Schema = LnurlPayResponseSchema.extend(
  NIP57LnurlExtensionSchema.shape,
)

export const LightningMetadataSchema = z.object({
  lud06: z.string().trim().nullable().optional(),
  lud16: z.string().trim().nullable().optional(),
})

function decodeLnurl(lnurl: string): string | undefined {
  try {
    // FIXME: cast to template literal type to satisfy bech32.decode, which expects a string of the form `${string}1${string}`
    const { words } = bech32.decode(lnurl as `${string}1${string}`, 2000)
    const data = bech32.fromWords(words)
    return new TextDecoder().decode(new Uint8Array(data))
  } catch {
    return undefined
  }
}

export function getLightningLnurl(metadata: {
  lud06?: string | null
  lud16?: string | null
}): URL | undefined {
  if (metadata.lud16 !== undefined && metadata.lud16 !== null) {
    const [username, domain] = metadata.lud16.split('@')
    if (username && domain) {
      try {
        return new URL(`/.well-known/lnurlp/${username}`, `https://${domain}`)
      } catch {
        return undefined
      }
    }
  }
  if (metadata.lud06 !== undefined && metadata.lud06 !== null) {
    const decodedUrl = decodeLnurl(metadata.lud06)
    if (decodedUrl !== undefined) {
      try {
        return new URL(decodedUrl)
      } catch {
        return undefined
      }
    }
  }
  return undefined
}
