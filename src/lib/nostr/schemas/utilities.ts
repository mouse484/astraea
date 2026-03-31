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

/**
 * Zod Tuple with optional values.
 * zod build in: z.tuple([z.string(), z.string().optional()]) => [string, (string | undefined)?]
 * this utility: tupleWithOptional([z.string()], [z.string()]) => [string] | [string, string]
 */
export function tupleWithOptional<
  Default extends [z.core.SomeType, ...z.core.SomeType[]],
  Optional extends [z.core.SomeType, ...z.core.SomeType[]],
>(defaultValues: Default, ...optionalValues: Optional) {
  return z.union([
    z.tuple(defaultValues),
    ...optionalValues.map(
      (_, index) => z.tuple([...defaultValues, ...optionalValues.slice(0, index + 1)]),
    ),
  ])
}
