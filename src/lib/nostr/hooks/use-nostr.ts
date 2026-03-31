import type z from 'zod'
import type { NostrQueryContext } from '@/lib/nostr/query-helpers'
import { useRouteContext } from '@tanstack/react-router'
import { toast } from 'sonner'

// TODO: このフックがいるかから検討する
export default function useNostr() {
  const { relays, rxBackwardReq, queryClient, rxNostr } = useRouteContext({ from: '/(app)' })

  return {
    publishEvent: async <S extends z.ZodObject<{
      kind: z.ZodNumber | z.ZodLiteral<number>
      tags: z.ZodType<unknown, string[][]>
      content: z.ZodString | z.ZodLiteral<''>
    }>>(
      schema: S,
      event: Pick<z.output<S>, 'kind' | 'tags' | 'content'>,
      messages?: {
        success?: string
        error?: string
      },
    ) => {
      try {
        const pickedSchema = schema.pick({ kind: true, tags: true, content: true })
        const encodedEvent = pickedSchema.encode(event)

        rxNostr.send(encodedEvent)

        toast.success(messages?.success ?? `Event published successfully. Kind: ${String(event.kind)}`)
        return encodedEvent
      } catch (error) {
        console.error('Failed to publish event:', { event, error })
        toast.error(messages?.error ?? `Failed to publish event. Kind: ${String(event.kind)}`)
      }
    },
    queryContext: {
      queryClient,
      rxBackwardReq,
    } satisfies NostrQueryContext,
    relays,
  }
}
