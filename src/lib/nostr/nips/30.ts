import * as z from 'zod'
import { ImageURISchema } from '../schemas/common'
import { tupleWithOptional } from '../schemas/utilities'

export const CustomEmojiTagSchema = tupleWithOptional(
  [
    z.literal('emoji'),
    z.string().trim().brand<'shortcode'>(),
    ImageURISchema,
  ],
  // TODO: emoji-set-address
  z.string().trim().brand<'emoji-set-address'>(),
)
