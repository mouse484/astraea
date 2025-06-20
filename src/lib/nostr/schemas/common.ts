import { Schema } from 'effect'
import { normalizeURL } from 'nostr-tools/utils'

const HEX_REGEX = /^[0-9a-f]+$/i

export const HexSchema = Schema.String.pipe(Schema.pattern(HEX_REGEX))
export const Hex32BytesSchema = HexSchema.pipe(Schema.length(64))
export const Hex64BytesSchema = HexSchema.pipe(Schema.length(128))
export const KindIntegerSchema = Schema.Number.pipe(Schema.between(0, 65_535))
export const PubkeySchema = Hex32BytesSchema

export const RelayUrlSchema = Schema.String.pipe(
  Schema.filter((s) => {
    if (s === '') return true
    try {
      const url = new URL(s)
      return url.protocol.startsWith('ws')
    } catch {
      return false
    }
  }),
)
import normalizeUrl from 'normalize-url'

export const URLSchema = Schema.String.pipe(
  Schema.filter((s) => {
    if (s === '') return true
    try {
      const url = new URL(normalizeUrl(s, { defaultProtocol: 'https' }))
      return !!url.href
    } catch {
      return false
    }
  }),
)
export const ImageURISchema = Schema.String.pipe(
  Schema.filter((s) => {
    if (s === '') return true
    try {
      const url = new URL(s)
      return url.protocol.startsWith('http') || url.protocol === 'data:'
    } catch {
      return false
    }
  }),
)
