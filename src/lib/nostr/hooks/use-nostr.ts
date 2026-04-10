import type * as z from 'zod'
import type { NostrQueryContext } from '@/lib/nostr/query-helpers'
import { useRouteContext } from '@tanstack/react-router'
import { firstValueFrom } from 'rxjs'
import { toast } from 'sonner'
import { signEvent } from '../utils/sign-event'

// TODO: このフックがいるかから検討する
export default function useNostr() {
  const { rxBackwardReq, queryClient, rxNostr } = useRouteContext({ from: '__root__' })

  const relays = Object.values(rxNostr.getDefaultRelays())

  return {
    publishEvent: async <S extends z.ZodObject<any>>(
      schema: S,
      event: Pick<z.output<S>, 'kind' | 'tags' | 'content'>,
      messages?: {
        success?: string
        error?: string
      },
    ) => {
      try {
        const signedEvent = await signEvent(schema, event)

        await firstValueFrom(rxNostr.send(signedEvent))

        toast.success(messages?.success ?? `Event published successfully. Kind: ${String(event.kind)}`)
        return signedEvent
      } catch (error) {
        console.error('Failed to publish event:', { event, error })
        toast.error(messages?.error ?? `Failed to publish event. Kind: ${String(event.kind)}`)
      }
    },
    queryContext: {
      queryClient,
      rxBackwardReq,
    } satisfies NostrQueryContext,
    relays: {
      read: relays.flatMap(relay => relay.read ? [relay.url] : []),
      write: relays.flatMap(relay => relay.write ? [relay.url] : []),
    },
  }
}
