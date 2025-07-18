import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useQuery } from '@tanstack/react-query'
import { Zap as ZapIcon } from 'lucide-react'
import { useMemo } from 'react'
import { metadataQuery } from '@/lib/nostr/kinds/0'
import { createPubkey } from '@/lib/nostr/nip19'
import { getLightningPayEndpoint } from '@/lib/nostr/nips/57'
import useNostr from '@/lib/nostr/use-nostr'
import { Button } from '@/shadcn-ui/components/ui/button'

interface Props {
  event: typeof TextNoteEventSchema.Type
}

export default function Zap({ event }: Props) {
  const { getQueryOption } = useNostr()
  const pubkey = createPubkey(event.pubkey)
  const { data: metadata } = useQuery(getQueryOption(metadataQuery, pubkey.decoded))

  const { isEnabled, endpoint: _endpoint } = useMemo(() => {
    if (!metadata?.content) {
      return {
        isEnabled: false,
        endpoint: undefined,
      }
    }

    const lightningEndpoint = getLightningPayEndpoint(metadata.content)
    const hasLightningAddress = Boolean(metadata.content.lud16 || metadata.content.lud06)

    if (!hasLightningAddress || !lightningEndpoint) {
      return {
        isEnabled: false,
        endpoint: undefined,
      }
    }

    return {
      isEnabled: true,
      endpoint: lightningEndpoint,
    }
  }, [metadata])

  return (
    <Button
      size="icon"
      variant="ghost"
      disabled={!isEnabled}
    >
      <ZapIcon />
    </Button>
  )
}
