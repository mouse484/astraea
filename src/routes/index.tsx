import { redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { readStore, writeStore } from '@/lib/store'
import { Button } from '@/shadcn-ui/components/ui/button'

export const Route = createFileRoute({
  component: RouteComponent,
  beforeLoad: () => {
    if (readStore('pubkey')) {
      throw redirect({
        to: '/home',
      })
    }
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  return (
    <div className="grid h-svh w-svw place-content-center place-items-center">
      <h1 className="text-4xl">Astraea</h1>
      <p>a nostr client</p>

      <Button
        className="mt-8"
        disabled={!globalThis.nostr}
        onClick={async () => {
          const pubkey = await (globalThis.nostr!.getPublicKey()).catch((error) => {
            console.error(error)
          })
          if (pubkey) {
            writeStore('pubkey', pubkey)
            navigate({
              to: '/settings/relays',
            })
            toast.success('Successfully signed in with NIP-07 extension')
          } else {
            toast.error('Failed to sign in with NIP-07 extension')
          }
        }}
      >
        Sign in with NIP-07 extention
      </Button>
    </div>
  )
}
