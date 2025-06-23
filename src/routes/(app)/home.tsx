import TextNoteForm from '@/components/text-note/TextNoteForm'
import TimeLine from '@/components/timeline/TimeLine'
import { FollowListQuery } from '@/lib/nostr/kinds/3'

export const Route = createFileRoute({
  component: RouteComponent,
  async  loader({ context: { queryClient, pool, relays, pubkey } }) {
    return await queryClient.fetchQuery(FollowListQuery({
      pool,
      relays: relays.read,
    }, pubkey.decoded))
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
