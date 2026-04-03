import TextNoteForm from '@/components/text-note/form/TextNoteForm'
import TimeLine from '@/components/timeline/TimeLine'
import { FollowListQuery } from '@/lib/nostr/kinds/3'

export const Route = createFileRoute({
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
    <div className="grid h-full grid-rows-[auto_1fr] gap-4">
      <TextNoteForm />
      <TimeLine pubkeys={pubkeys} />
    </div>
  )
}
