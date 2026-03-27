import normalizeUrl from 'normalize-url'
import z from 'zod'

const HEX_REGEX = /^[0-9a-f]+$/i

const HexSchema = z.string().regex(HEX_REGEX)

export const Hex32BytesSchema = HexSchema.length(64)
export const Hex64BytesSchema = HexSchema.length(128)
export const KindIntegerSchema = z.number().int().min(0).max(65_535)
export const PubkeySchema = Hex32BytesSchema

export const RelayUrlSchema = z.url({
  protocol: /^ws(s)?$/,
})

export const URLSchema = z.preprocess((value) => {
  try {
    const url = new URL(normalizeUrl(String(value), { defaultProtocol: 'https' }))
    return url.href
  } catch {
    return ''
  }
}, z.url())

export const ImageURISchema = z.url({
  protocol: /^(https?|data)$/,
})
