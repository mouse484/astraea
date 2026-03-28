import { Outlet, redirect } from '@tanstack/react-router'
import { getUnixTime, subMinutes } from 'date-fns'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import { filterByKind } from 'rx-nostr'
import { share } from 'rxjs'
import { Layout } from '@/components/layout/Layout'
import { createPubkey } from '@/lib/nostr/nip19'
import queryKeyList from '@/lib/query-key'
import { readStore } from '@/lib/store'
import { Alert, AlertDescription, AlertTitle } from '@/shadcn-ui/components/ui/alert'

const defaultRelays = [
  'wss://nos.lol',
  'wss://relay.damus.io',
]

export const Route = createFileRoute({
  component: RouteComponent,
  beforeLoad: ({ context: { rxNostr } }) => {
    const pubkeyHex = readStore('pubkey')
    if (pubkeyHex === undefined) {
      throw redirect({
        to: '/',
      })
    }

    const pubkey = createPubkey(pubkeyHex)
    const relays = readStore('relays')

    // TODO: rxNostrへ移行が完了後にrelaysの形式を変更予定
    const _relays = Object.fromEntries(
      relays?.map(r => [r.url, { read: r.read, write: r.write }]) ?? defaultRelays.map(url => [url, { read: true, write: true }]),
    )

    rxNostr.addDefaultRelays(_relays)

    return {
      pubkey,
      relays: {
        read: relays?.filter(r => r.read).map(r => r.url) ?? defaultRelays,
        write: relays?.filter(r => r.write).map(r => r.url) ?? defaultRelays,
      },
    }
  },
  errorComponent: ({ error }) => {
    return (
      <Layout>
        <Alert className="mx-auto w-4/5" variant="destructive">
          <AlertCircle className="mr-2! size-8 shrink-0" />
          <AlertTitle className="text-xl font-semibold">{error.name}</AlertTitle>
          <AlertDescription>
            <p>
              {error.message || 'An unexpected error occurred.'}
            </p>
            {error.stack !== undefined && (
              <pre className="mt-2 text-sm text-wrap text-current/80">{error.stack}</pre>
            )}
          </AlertDescription>
        </Alert>
      </Layout>
    )
  },
})

function RouteComponent() {
  const { queryClient, rxNostr, rxForwardReq } = Route.useRouteContext()

  useEffect(() => {
    const event$ = rxNostr.use(rxForwardReq).pipe(share())
    const kind1Subscription = event$.pipe(filterByKind(1)).subscribe(({ event }) => {
      const eventTag = event.tags.find(tag => tag[0] === 'e' && tag[3] === 'reply')
        || event.tags.find(tag => tag[0] === 'e' && tag[3] === 'root')
      if (eventTag) {
        queryClient.setQueryData(queryKeyList.reply(eventTag[1], event.id), event)
      } else {
        queryClient.setQueryData(queryKeyList.textnote(event.id), event)
      }
    })
    const kind7Subscription = event$.pipe(filterByKind(7)).subscribe(({ event }) => {
      const targetId = event.tags.find(tag => tag[0] === 'e')?.[1]
      if (targetId !== undefined) {
        queryClient.setQueryData(
          queryKeyList.reaction(targetId, event.pubkey, event.content),
          event,
        )
      }
    })

    rxForwardReq.emit({
      kinds: [1, 7],
      since: getUnixTime(subMinutes(new Date(), 10)),
    })

    return () => {
      kind1Subscription.unsubscribe()
      kind7Subscription.unsubscribe()
    }
  })

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
