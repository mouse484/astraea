import type { output, z, ZodObject } from 'zod'
import type { createQuery } from '@/lib/nostr/query-helpers'
import { useRouteContext } from '@tanstack/react-router'
import { toast } from 'sonner'
import { signEvent } from '../utils/sign-event'

export default function useNostr() {
  const { relays, pool } = useRouteContext({ from: '/(app)' })

  return {
    publishEvent: async <S extends ZodObject<any>>(
      schema: S,
      event: Pick<output<S>, 'kind' | 'tags' | 'content'>,
      messages?: {
        success?: string
        error?: string
      },
    ) => {
      try {
        const signedEvent = await signEvent(schema, event)
        await Promise.allSettled(pool.publish(relays.write, signedEvent))
        toast.success(messages?.success ?? `Event published successfully. Kind: ${String(event.kind)}`)
        return signedEvent
      } catch (error) {
        console.error('Failed to publish event:', { event, error })
        toast.error(messages?.error ?? `Failed to publish event. Kind: ${String(event.kind)}`)
      }
    },
    getQueryOption: <T extends z.ZodObject<any>>(queryOption: ReturnType<typeof createQuery<T>>, id: string) => {
      return queryOption({ pool, relays: relays.read }, id)
    },
    relays,
  }
}
