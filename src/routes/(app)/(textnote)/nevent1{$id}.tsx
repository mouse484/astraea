import { createFileRoute, Link } from '@tanstack/react-router'
import { MessageSquareReply } from 'lucide-react'
import TextNote from '@/components/text-note/TextNote'
import { TextNoteQuery } from '@/lib/nostr/kinds/1'
import { createEvent } from '@/lib/nostr/nip19'
import { Button } from '@/shadcn-ui/components/ui/button'

export const Route = createFileRoute('/(app)/(textnote)/nevent1{$id}')({
  component: RouteComponent,
  loader: async ({ params: { id }, context: { queryClient, rxBackwardReq } }) => {
    const nevent = createEvent(`nevent1${id}`)
    const decodedRelays = nevent.decoded.relays
    const event = await queryClient.ensureQueryData(TextNoteQuery(
      {
        queryClient,
        rxBackwardReq,
        relays: decodedRelays,
      },
      nevent.decoded.id,
      ({ setKey, id }) => setKey(id),
    ))

    if (event === undefined) {
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
  }) ?? [])[1]
  return (
    <>
      {hasRoot !== undefined && (() => {
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
      <TextNote event={event} withReplies={true} />
    </>
  )
}
