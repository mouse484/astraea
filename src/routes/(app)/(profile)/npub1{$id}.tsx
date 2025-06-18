import Profile from '@/components/Profile'
import { metadataQuery } from '@/lib/nostr/kinds/0'
import { createPubkey } from '@/lib/nostr/nip19'
import { setTitle } from '@/lib/set-title'

export const Route = createFileRoute({
  component: RouteComponent,
  loader: async ({ params: { id }, context: { queryClient, pool, relays } }) => {
    const pubkey = createPubkey(`npub1${id}`)

    return queryClient.fetchQuery(metadataQuery({ pool, relays: relays.read }, {
      authors: [pubkey.decoded],
    }))
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
  const { content } = Route.useLoaderData()

  return (
    <div>
      <Profile content={content} />
    </div>
  )
}
