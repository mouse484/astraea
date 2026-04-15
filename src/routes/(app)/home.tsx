import { createFileRoute } from '@tanstack/react-router'
import TextNoteForm from '@/components/text-note/form/TextNoteForm'
import Timeline from '@/components/timeline/Timeline'
import { FollowListQuery } from '@/lib/nostr/kinds/3'

export const Route = createFileRoute('/(app)/home')({
  component: RouteComponent,
  async  loader({ context: { queryClient, rxBackwardReq, pubkey } }) {
    return queryClient.ensureQueryData(FollowListQuery(
      {
        queryClient,
        rxBackwardReq,
      },
      pubkey.decoded,
      ({ setKey, id }) => setKey(id),
    ))
  },
})

function RouteComponent() {
  const { tags: pubkeys } = Route.useLoaderData()
  return (
    <div className="flex flex-col gap-4">
      <TextNoteForm />
      <Timeline pubkeys={pubkeys} />
    </div>
  )
}
