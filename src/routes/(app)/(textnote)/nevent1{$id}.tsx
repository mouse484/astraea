import { Link } from '@tanstack/react-router'
import { MessageSquareReply } from 'lucide-react'
import TextNote from '@/components/text-note/TextNote'
import { TextNoteQuery } from '@/lib/nostr/kinds/1'
import { createEvent } from '@/lib/nostr/nip19'
import { Button } from '@/shadcn-ui/components/ui/button'

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

    return {
      event,
    }
  },
})

function RouteComponent() {
  const { event } = Route.useLoaderData()
  const hasRoot = (event.tags.find((tag) => {
    return tag[0] === 'e' && tag[3] === 'root'
  }) ?? [])[1] as string | undefined
  return (
    <>
      {hasRoot && (() => {
        const nevent = createEvent({
          id: hasRoot,
        })
        return (
          <Button className="mb-4" asChild variant="outline">
            <Link
              params={{
                id: nevent.routeId,
              }}
              to="/nevent1{$id}"
            >
              <MessageSquareReply />
              Go to thread root
            </Link>
          </Button>

        )
      })()}
      <TextNote event={event} whithReplies={true} />
    </>
  )
}
