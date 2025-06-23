import { Schema } from 'effect'

export const MetadataWithKind05Schema = Schema.Struct({
  /**
   * NIP-05 internet identifier.
   */
  nip05: Schema.Union(
    Schema.Literal(''),
    // Full identifier format: local@domain
    Schema.String.pipe(Schema.pattern(/^[\w\-.]+@[\w\-.]+$/)),
    // Root identifier format: _@domain
    Schema.String.pipe(Schema.pattern(/^_@[\w\-.]+$/)),
    // Domain only format: domain.tld (represents _@domain.tld)
    Schema.String.pipe(Schema.pattern(/^[\w\-.]+\.[a-z]{2,}$/i)),
  ).pipe(
    Schema.transform(
      Schema.String,
      {
        strict: true,
        decode: (value) => {
          if (value.startsWith('_@')) {
            return value.slice(2)
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
