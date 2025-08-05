import { bech32 } from '@scure/base'
import { Schema } from 'effect'
import { LnurlPayResponseSchema } from '../luds/06'

const NIP57LnurlExtensionSchema = Schema.Struct({
  allowsNostr: Schema.optional(Schema.Boolean),
  nostrPubkey: Schema.optional(Schema.String),
})

export const LnurlPayResponseWithNIP57Schema = Schema.extend(
  LnurlPayResponseSchema,
  NIP57LnurlExtensionSchema,
)

export const LightningMetadataSchema = Schema.Struct({
  lud06: Schema.NullOr(Schema.String),
  lud16: Schema.NullOr(Schema.String),
})

function decodeLnurl(lnurl: string): string | undefined {
  try {
    const { words } = bech32.decode(lnurl, 2000)
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
  if (metadata.lud16) {
    const [username, domain] = metadata.lud16.split('@')
    if (username && domain) {
      try {
        return new URL(`/.well-known/lnurlp/${username}`, `https://${domain}`)
      } catch {
        return undefined
      }
    }
  }
  if (metadata.lud06) {
    const decodedUrl = decodeLnurl(metadata.lud06)
    if (decodedUrl) {
      try {
        return new URL(decodedUrl)
      } catch {
        return undefined
      }
    }
  }
  return undefined
}
