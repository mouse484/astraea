import { TextNoteQuery } from '@/lib/nostr/kinds/1'
import { createEvent } from '@/lib/nostr/nip19'

export const Route = createFileRoute({
  component: RouteComponent,
  loader: async ({ params: { id }, context: { queryClient, pool, relays } }) => {
    const nevent = createEvent(`nevent1${id}`)
    return await queryClient.ensureQueryData(TextNoteQuery({
      pool,
      relays: nevent.decoded.relays ?? relays.read,
    }, {
      ids: [nevent.decoded.id],
    }))
  },
})

function RouteComponent() {
  const { content } = Route.useLoaderData()
  return (
    <div>
      {content}
    </div>
  )
}
