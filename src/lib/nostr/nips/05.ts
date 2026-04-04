import * as z from 'zod'

const NIP05_WITH_DOMAIN = /^[\w\-.]+@[\w\-.]+$/
const NIP05_WITHOUT_DOMAIN = /^[\w\-.]+\.[a-z]{2,}$/i

export const MetadataWithKind05Schema = z.object({
  /**
   * NIP-05 internet identifier.
   */
  nip05: z.codec(
    z.string().trim(),
    z.string().trim(),
    {
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
      encode: value => value,
    },
  ),
})
