import type { Schema } from 'effect'
import type { createQuery } from '@/lib/nostr/query-helpers'
import { useRouteContext } from '@tanstack/react-router'
import { toast } from 'sonner'
import { signEvent } from '../utils/sign-event'

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
        const signedEvent = await signEvent(schema, event)
        await pool.publish(relays.write, signedEvent)
        toast.success(messages?.success ?? `Event published successfully. Kind: ${event.kind}`)
        return signedEvent
      } catch (error) {
        console.error('Failed to publish event:', { event, error })
        toast.error(messages?.error ?? `Failed to publish event. Kind: ${event.kind}`)
      }
    },
    getQueryOption: <T, I = T>(queryOption: ReturnType<typeof createQuery<T, I>>, id: string) => {
      return queryOption({ pool, relays: relays.read }, id)
    },
  }
}
