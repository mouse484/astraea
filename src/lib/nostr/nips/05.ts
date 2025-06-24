import { Schema } from 'effect'

export const MetadataWithKind05Schema = Schema.Struct({
  /**
   * NIP-05 internet identifier.
   */
  nip05: Schema.String.pipe(
    Schema.transform(
      Schema.String,
      {
        strict: true,
        decode: (value) => {
          if (value.startsWith('_@')) {
            return value.slice(2)
          }

          const isValidNip05 = (
            value === ''
            || /^[\w\-.]+@[\w\-.]+$/.test(value)
            || /^[\w\-.]+\.[a-z]{2,}$/i.test(value)
          )

          if (!isValidNip05) {
            return ''
          }

          return value
        },
        encode: (value) => {
          return value
        },
      },
    ),
  ),
})
