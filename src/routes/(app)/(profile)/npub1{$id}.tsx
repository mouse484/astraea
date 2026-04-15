import { createFileRoute } from '@tanstack/react-router'
import Profile from '@/components/profile/Profile'
import Timeline from '@/components/timeline/Timeline'
import { MetadataQuery } from '@/lib/nostr/kinds/0'
import { createPubkey } from '@/lib/nostr/nip19'
import { setTitle } from '@/lib/set-title'

export const Route = createFileRoute('/(app)/(profile)/npub1{$id}')({
  component: RouteComponent,
  loader: async ({ params: { id }, context: { queryClient, rxBackwardReq } }) => {
    const pubkey = createPubkey(`npub1${id}`)

    return queryClient.fetchQuery(MetadataQuery(
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
      <Timeline pubkeys={[metadata.pubkey]} />
    </div>
  )
}
