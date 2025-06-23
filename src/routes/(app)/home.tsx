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
    <div className="h-full w-full">
      <TimeLine pubkeys={pubkeys} />
    </div>
  )
}
