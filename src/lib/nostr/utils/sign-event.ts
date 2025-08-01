import { getUnixTime } from 'date-fns'
import { Schema } from 'effect'

export async function signEvent<S extends Schema.Struct<any>>(
  schema: S,
  event: Pick<S['Type'], 'kind' | 'tags' | 'content'>,
) {
  if (!globalThis.nostr || typeof globalThis.nostr.signEvent !== 'function') {
    throw new Error('nostr extension is not available')
  }
  const pickedSchema = schema.pick('kind', 'tags', 'content')
  const encodedEvent = Schema.encodeUnknownSync(pickedSchema as any)(event) as {
    kind: number
    tags: string[][]
    content: string
  }
  return await globalThis.nostr.signEvent({
    kind: encodedEvent.kind,
    tags: encodedEvent.tags,
    content: encodedEvent.content,
    created_at: getUnixTime(new Date()),
  })
}
