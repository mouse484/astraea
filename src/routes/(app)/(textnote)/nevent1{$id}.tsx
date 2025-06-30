import TextNote from '@/components/text-note/TextNote'
import { TextNoteQuery } from '@/lib/nostr/kinds/1'
import { createEvent } from '@/lib/nostr/nip19'

export const Route = createFileRoute({
  component: RouteComponent,
  loader: async ({ params: { id }, context: { queryClient, pool, relays } }) => {
    const nevent = createEvent(`nevent1${id}`)
    const decodedRelays = nevent.decoded.relays
    const result = await queryClient.ensureQueryData(TextNoteQuery({
      pool,
      relays: decodedRelays && decodedRelays.length > 0 ? decodedRelays : relays.read,
    }, nevent.decoded.id))

    return result
  },
})

function RouteComponent() {
  const event = Route.useLoaderData()
  return (
    <TextNote event={event} />
  )
}
