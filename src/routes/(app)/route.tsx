import type { Pubkey } from '@/lib/nostr/nip19'
import type { QueryKeyList } from '@/lib/nostr/query-helpers'
import { Outlet, redirect } from '@tanstack/react-router'
import { getUnixTime, subMinutes } from 'date-fns'
import { useEffect } from 'react'
import Sidebar, { SidebarProvider } from '@/components/layout/Sidebar'
import { createPubkey } from '@/lib/nostr/nip19'
import { readStore } from '@/lib/store'

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
})

function RouteComponent() {
  const { pubkey, relays, pool, queryClient } = Route.useRouteContext()

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
    <div className="max-w-svw">
      <SidebarProvider>
        <Sidebar pubkey={pubkey} />
        <main className="h-svh w-full space-y-8 p-8">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  )
}
