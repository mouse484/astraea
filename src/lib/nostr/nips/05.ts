import { Schema } from 'effect'

const NIP05_WITH_DOMAIN = /^[\w\-.]+@[\w\-.]+$/
const NIP05_WITHOUT_DOMAIN = /^[\w\-.]+\.[a-z]{2,}$/i

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
            || NIP05_WITH_DOMAIN.test(value)
            || NIP05_WITHOUT_DOMAIN.test(value)
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
