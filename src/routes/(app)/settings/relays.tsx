import type { StoreValue } from '@/lib/store/schema'
import { CloudDownload, CloudUpload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { RelayForm } from '@/components/page/settings/relay/RelayForm'
import { RelayTable } from '@/components/page/settings/relay/RelayTable'
import { RelayListEventSchema, relayListQuery } from '@/lib/nostr/kinds/10002'
import useNostr from '@/lib/nostr/use-nostr'
import { readStore, writeStore } from '@/lib/store'
import { Button } from '@/shadcn-ui/components/ui/button'

export const Route = createFileRoute({
  component: RouteComponent,
})

function RouteComponent() {
  const { queryClient, pool, pubkey } = Route.useRouteContext()
  const { publishEvent } = useNostr()

  const [relays, setRelays] = useState<StoreValue<'relays'>>(() => {
    return readStore('relays') ?? []
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
          onUpdateRelay={handleUpdateRelay}
          onDeleteRelay={handleDeleteRelay}
          isLoading={isLoading}
        />
      )}

      <div className="mt-4 flex justify-end gap-4">
        <Button
          onClick={async () => {
            setIsLoading(true)
            try {
              const query = relayListQuery({
                pool,
                relays: {
                  read: relays.filter(r => r.read).map(r => r.url),
                  write: [],
                },
              }, {
                authors: [pubkey.hex],
              })

              queryClient.invalidateQueries(query)
              const data = await queryClient.fetchQuery(query)
              if (data) {
                setRelays(data.tags)
              }
            } finally {
              setIsLoading(false)
            }
          }}
          disabled={isLoading}
        >
          <CloudDownload />
          Load Relays
        </Button>
        <Button
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
          disabled={isLoading}
        >
          <CloudUpload />
          Save Relays
        </Button>
      </div>
    </>
  )
}
