import type { StoreValue } from '@/lib/store/schema'
import { CloudDownload, CloudUpload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { RelayForm } from '@/components/page/settings/relay/RelayForm'
import { RelayTable } from '@/components/page/settings/relay/RelayTable'
import useNostr from '@/lib/nostr/hooks/use-nostr'
import { RelayListEventSchema, relayListQuery } from '@/lib/nostr/kinds/10002'
import { readStore, writeStore } from '@/lib/store'
import { Button } from '@/shadcn-ui/components/ui/button'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  const { queryClient, pool, pubkey } = Route.useRouteContext()
  const { publishEvent } = useNostr()

  const [relays, setRelays] = useState<StoreValue<'relays'>>(() => {
    return readStore('relays') ?? [
      {
        url: 'wss://nos.lol',
        read: true,
        write: true,
      },
      {
        url: 'wss://relay.damus.io',
        read: true,
        write: true,
      },
    ]
  })
  const [isLoading, setIsLoading] = useState(false)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    writeStore('relays', relays)
  }, [relays])

  function handleAddRelay(url: string) {
    setRelays((relays) => {
      return [...relays, { url, read: true, write: true }]
    })
  }

  function handleUpdateRelay(index: number, relay: StoreValue<'relays'>[number]) {
    setRelays((relays) => {
      const newRelays = [...relays]
      newRelays[index] = relay
      return newRelays
    })
  }

  function handleDeleteRelay(index: number) {
    setRelays((relays) => {
      const newRelays = [...relays]
      newRelays.splice(index, 1)
      return newRelays
    })
  }

  return (
    <>
      <RelayForm onAddRelay={handleAddRelay} />

      {relays.length > 0 && (
        <RelayTable
          relays={relays}
          isLoading={isLoading}
          onDeleteRelay={handleDeleteRelay}
          onUpdateRelay={handleUpdateRelay}
        />
      )}

      <div className="mt-4 flex justify-end gap-4">
        <Button
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true)
            try {
              const query = relayListQuery({
                pool,
                relays: relays.filter(r => r.read).map(r => r.url),
              }, pubkey.decoded)

              queryClient.invalidateQueries(query)
              const data = await queryClient.fetchQuery(query)
              if (data) {
                setRelays(data.tags)
              }
            } finally {
              setIsLoading(false)
            }
          }}
        >
          <CloudDownload />
          Load Relays
        </Button>
        <Button
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true)
            try {
              await publishEvent(
                RelayListEventSchema,
                {
                  kind: 10_002,
                  tags: relays,
                  content: '',
                },
                {
                  success: 'Relays saved successfully.',
                  error: 'Failed to save relays.',
                },
              )
            } finally {
              setIsLoading(false)
            }
          }}
        >
          <CloudUpload />
          Save Relays
        </Button>
      </div>
    </>
  )
}
