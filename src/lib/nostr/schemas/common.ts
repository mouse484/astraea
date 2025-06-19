import { Schema } from 'effect'

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

export const URLSchema = Schema.String.pipe(
  Schema.filter((s) => {
    if (s === '') return true
    try {
      const url = new URL(s)
      return url.protocol.startsWith('http')
    } catch {
      return false
    }
  }),
)
