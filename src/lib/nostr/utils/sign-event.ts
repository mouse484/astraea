import type * as z from 'zod'
import { signer } from '../rx-nostr'

export async function signEvent<S extends z.ZodObject<{
  kind: z.ZodNumber | z.ZodLiteral<number>
  tags: z.ZodType<unknown, string[][]>
  content: z.ZodString
}>>(
  schema: S,
  event: Pick<z.output<S>, 'kind' | 'tags' | 'content'>,
) {
  const pickedSchema = schema.pick({ kind: true, tags: true, content: true })
  const encodedEvent = pickedSchema.encode(event)

  return signer.signEvent(encodedEvent)
}
