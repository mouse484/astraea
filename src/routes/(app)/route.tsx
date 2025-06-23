import type { Pubkey } from '@/lib/nostr/nip19'
import type { QueryKeyList } from '@/lib/nostr/query-helpers'
import { Outlet, redirect } from '@tanstack/react-router'
import { getUnixTime, subMinutes } from 'date-fns'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { createPubkey } from '@/lib/nostr/nip19'
import { readStore } from '@/lib/store'
import { Alert, AlertDescription, AlertTitle } from '@/shadcn-ui/components/ui/alert'

export interface AppRouteContext {
  pubkey: Pubkey
  relays: {
    read: string[]
    write: string[]
  }
}

const defaultRelays = [
  'wss://nos.lol',
  'wss://relay.damus.io',
]

export const Route = createFileRoute({
  component: RouteComponent,
  beforeLoad: () => {
    const pubkeyHex = readStore('pubkey')
    if (!pubkeyHex) {
      throw redirect({
        to: '/',
      })
    }

    const pubkey = createPubkey(pubkeyHex)
    const relays = readStore('relays')

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
        <Alert variant="destructive" className="mx-auto w-4/5">
          <AlertCircle className="!mr-2 h-8 w-8 flex-shrink-0" />
          <AlertTitle className="text-xl font-semibold">{error.name}</AlertTitle>
          <AlertDescription>
            <p>
              {error.message || 'An unexpected error occurred.'}
            </p>
            {error.stack && (
              <pre className="mt-2 text-sm text-wrap text-current/80">{error.stack}</pre>
            )}
          </AlertDescription>
        </Alert>
      </Layout>
    )
  },
})

function RouteComponent() {
  const { relays, pool, queryClient } = Route.useRouteContext()

  useEffect(() => {
    const subscription = pool.subscribe(relays.read, {
      kinds: [1],
      since: getUnixTime(subMinutes(new Date(), 5)),
    }, {
      onevent(event) {
        if (event.kind === 1) {
          queryClient.setQueryData(['textnote' satisfies QueryKeyList, event.id], event)
        }
      },
    })
    return () => {
      subscription.close()
    }
  })

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
