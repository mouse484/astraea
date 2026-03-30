import Profile from '@/components/profile/Profile'
import TimeLine from '@/components/timeline/TimeLine'
import { metadataQuery } from '@/lib/nostr/kinds/0'
import { createPubkey } from '@/lib/nostr/nip19'
import { setTitle } from '@/lib/set-title'

export const Route = createFileRoute({
  component: RouteComponent,
  loader: async ({ params: { id }, context: { queryClient, rxBackwardReq } }) => {
    const pubkey = createPubkey(`npub1${id}`)

    return queryClient.fetchQuery(metadataQuery(
      { queryClient, rxBackwardReq },
      pubkey.decoded,
      ({ setKey, id }) => setKey(id),
    ))
  },
  head(context) {
    return {
      meta: [
        setTitle(context.loaderData?.content.name),
      ],
    }
  },
})

function RouteComponent() {
  const metadata = Route.useLoaderData()

  return (
    <div>
      <Profile metadata={metadata} />

      <div className="h-screen">
        <TimeLine pubkeys={[metadata.pubkey]} />
      </div>
    </div>
  )
}
