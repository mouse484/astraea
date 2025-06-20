import { Schema } from 'effect'
import { ImageURISchema, URLSchema } from '../schemas/common'

export const MetadataExtraFieldsSchema = Schema.Struct({
  display_name: Schema.String,
  website: URLSchema,
  banner: ImageURISchema,
  bot: Schema.Union(
    Schema.Boolean,
    Schema.String.pipe(
      Schema.filter(s => s === 'true' || s === 'false'),
      Schema.transform(Schema.Boolean, {
        decode: s => s === 'true',
        encode: b => b ? 'true' : 'false',
      }),
    ),
  ),
  birthday: Schema.Struct({
    year: Schema.Number,
    month: Schema.Number,
    day: Schema.Number,
  }).pipe(Schema.partial),
  /**
   * @deprecated use `display_name` instead
   */
  displayName: Schema.String,
  /**
   * @deprecated use `name` instead
   */
  username: Schema.String,
})
