import { Schema } from 'effect'
import TextNote from '@/components/text-note/TextNote'
import { TextNoteEventSchema, TextNoteQuery } from '@/lib/nostr/kinds/1'
import { createEvent } from '@/lib/nostr/nip19'

export const Route = createFileRoute({
  component: RouteComponent,
  loader: async ({ params: { id }, context: { queryClient, pool, relays } }) => {
    const nevent = createEvent(`nevent1${id}`)
    const decodedRelays = nevent.decoded.relays
    const event = await queryClient.ensureQueryData(TextNoteQuery({
      pool,
      relays: decodedRelays && decodedRelays.length > 0 ? decodedRelays : relays.read,
    }, nevent.decoded.id))

    if (!event) {
      throw new Error(`Event with ID ${id} not found`)
    }

    const cacheReplies = await queryClient
      .getQueryCache()
      .findAll({ queryKey: ['reply', event.id] })
    const replies = cacheReplies.map((item) => {
      return Schema.decodeUnknownSync(TextNoteEventSchema)(item.state.data)
    }).sort((a, b) => {
      return (b.created_at ?? 0) - (a.created_at ?? 0)
    })

    return {
      event,
      replies,
    }
  },
})

function RouteComponent() {
  const { event, replies } = Route.useLoaderData()
  return (
    <>
      <TextNote event={event} />
      {
        replies.length > 0 && (
          <div className="border-l-4 pl-4">
            {
              replies.map(reply => (
                <TextNote key={reply.id} event={reply} />
              ))
            }
          </div>
        )
      }
    </>
  )
}
