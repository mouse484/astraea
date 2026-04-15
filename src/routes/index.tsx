import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import PreviewTimeline from '@/components/timeline/PreviewTimeline'
import { defaultRelays } from '@/lib/nostr/const'
import { PubkeySchema } from '@/lib/nostr/schemas/common'
import { readStore, writeStore } from '@/lib/store'
import { Button } from '@/shadcn-ui/components/ui/button'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: ({ context: { rxNostr } }) => {
    if (readStore('pubkey') !== undefined) {
      throw redirect({
        to: '/home',
      })
    }
    rxNostr.setDefaultRelays(defaultRelays)
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  return (
    <div className="
      grid h-svh w-svw grid-cols-1 grid-rows-3
      sm:grid-cols-2 sm:grid-rows-1
    "
    >
      <div className="grid place-content-center place-items-center">
        <h1 className="text-4xl">Astraea</h1>
        <p>a nostr client</p>

        <Button
          className="mt-8"
          disabled={!globalThis.nostr}
          onClick={() => {
            void (async () => {
              const _pubkey = await (globalThis.nostr!.getPublicKey()).catch(console.error)
              const pubkey = await PubkeySchema.parseAsync(_pubkey).catch(console.error)
              if (pubkey) {
                writeStore('pubkey', pubkey)
                void navigate({
                  to: '/settings/relays',
                })
                toast.success('Successfully signed in with NIP-07 extension')
              } else {
                toast.error('Failed to sign in with NIP-07 extension')
              }
            })()
          }}
        >
          Sign in with NIP-07 extension
        </Button>
      </div>
      <div className="
        row-span-2 p-4
        sm:row-span-1
      "
      >
        <h3 className="mb-4 font-bold">Timeline Preview</h3>
        <PreviewTimeline />
      </div>
    </div>
  )
}
