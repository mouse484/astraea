import { Outlet, redirect } from '@tanstack/react-router'
import Sidebar, { SidebarProvider } from '@/components/layout/Sidebar'
import { createPubkey, type Pubkey } from '@/lib/nostr/nip19'
import { readStore } from '@/lib/store'

export interface AppRouteContext {
  pubkey: Pubkey
  relays: {
    read: string[]
    write: string[]
  }
}

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
        read: relays?.filter(r => r.read).map(r => r.url) ?? [],
        write: relays?.filter(r => r.write).map(r => r.url) ?? [],
      },
    }
  },
})

function RouteComponent() {
  const { pubkey } = Route.useRouteContext()
  return (
    <SidebarProvider>
      <Sidebar pubkey={pubkey} />
      <main className="w-full space-y-8 p-8">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
