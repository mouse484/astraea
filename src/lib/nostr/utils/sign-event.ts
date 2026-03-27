import type { input, ZodObject } from 'zod'
import { getUnixTime } from 'date-fns'

export async function signEvent<S extends ZodObject<any>>(
  schema: S,
  event: Pick<input<S>, 'kind' | 'tags' | 'content'>,
) {
  if (!globalThis.nostr || typeof globalThis.nostr.signEvent !== 'function') {
    throw new Error('nostr extension is not available')
  }
  const pickedSchema = schema.pick({ kind: true, tags: true, content: true })

  const encodedEvent = pickedSchema.parse(event)

  return globalThis.nostr.signEvent({
    kind: encodedEvent.kind,
    tags: encodedEvent.tags,
    content: encodedEvent.content,
    created_at: getUnixTime(new Date()),
  })
}
