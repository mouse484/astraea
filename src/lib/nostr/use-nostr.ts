import { useRouteContext } from '@tanstack/react-router'
import { getUnixTime } from 'date-fns'
import { Schema } from 'effect'
import { toast } from 'sonner'

export default function useNostr() {
  const { relays, pool } = useRouteContext({ from: '/(app)' })

  return {
    publishEvent: async <S extends Schema.Struct<any>>(
      schema: S,
      event: Pick<S['Type'], 'kind' | 'tags' | 'content'>,
      messages?: {
        success?: string
        error?: string
      },
    ) => {
      try {
        const pickedSchema = schema.pick('kind', 'tags', 'content')
        const encodedEvent = Schema.encodeUnknownSync(pickedSchema as any)(event)

        const eventData = encodedEvent as { kind: number, tags: unknown, content: string }
        const signedEvent = await globalThis.nostr!.signEvent({
          kind: eventData.kind,
          tags: eventData.tags as string[][],
          content: eventData.content,
          created_at: getUnixTime(new Date()),
        })
        const result = await pool.publish(relays.write, signedEvent)
        toast.success(messages?.success ?? `Event published successfully. Kind: ${event.kind}`)
        return result
      } catch (error) {
        console.error('Failed to publish event:', { event, error })
        toast.error(messages?.error ?? `Failed to publish event. Kind: ${event.kind}`)
      }
    },
  }
}
