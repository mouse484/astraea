import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { defaultRelays } from '@/lib/nostr/const'
import { createPubkey } from '@/lib/nostr/nip19'
import { readStore } from '@/lib/store'
import { Alert, AlertDescription, AlertTitle } from '@/shadcn-ui/components/ui/alert'

export const Route = createFileRoute('/(app)')({
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

    rxNostr.setDefaultRelays(
      // TODO: readStoreのrelaysをsetDefaultRelaysに合わて変更する
      Object.fromEntries(
        relays?.map(r => [r.url, { read: r.read, write: r.write }])
        ?? defaultRelays.map(url => [url, { read: true, write: true }]),
      ),
    )

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
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
