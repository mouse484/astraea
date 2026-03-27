import { z } from 'zod'
import { ImageURISchema, URLSchema } from '../schemas/common'

const StringBooleanCodec = z.codec(
  z.enum(['true', 'false']),
  z.boolean(),
  {
    decode: s => s === 'true',
    encode: b => b ? 'true' : 'false',
  },
)

export const MetadataExtraFieldsSchema = z.object({
  display_name: z.string(),
  website: URLSchema,
  banner: ImageURISchema,
  bot: z.union([
    z.boolean(),
    StringBooleanCodec,
  ]),
  birthday: z.object({
    year: z.number(),
    month: z.number(),
    day: z.number(),
  }).partial().optional(),
  /**
   * @deprecated use `display_name` instead
   */
  displayName: z.string().optional(),
  /**
   * @deprecated use `name` instead
   */
  username: z.string().optional(),
})
