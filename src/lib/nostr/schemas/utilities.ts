import z from 'zod'

export const stringToNumber = z.codec(z.string().regex(z.regexes.number), z.number(), {
  decode: string_ => Number.parseFloat(string_),
  encode: number_ => number_.toString(),
})

export function jsonCodec<T extends z.core.$ZodType>(schema: T) {
  return z.codec(z.string(), schema, {
    decode: (jsonString, context) => {
      try {
        // eslint-disable-next-line ts/no-unsafe-return
        return JSON.parse(jsonString)
      } catch (error) {
        if (error instanceof Error) {
          context.issues.push({
            code: 'invalid_format',
            format: 'json',
            input: jsonString,
            message: error.message,
          })
        }
        return z.NEVER
      }
    },
    encode: value => JSON.stringify(value),
  })
}
