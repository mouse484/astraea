import type { MetadataEvent } from '@/lib/nostr/kinds/0'
import { useQuery } from '@tanstack/react-query'
import { BadgeCheck } from 'lucide-react'
import { queryProfile } from 'nostr-tools/nip05'

interface Props {
  metadata?: MetadataEvent
}

export default function UserName({ metadata }: Props) {
  const { data: profile } = useQuery({
    queryKey: ['nip05', metadata?.content.nip05],
    queryFn: () => queryProfile(metadata?.content.nip05 || ''),
    enabled: !!metadata?.content.nip05,
  })

  if (profile) {
    return (
      <span className="flex items-center gap-1">
        {metadata!.content.nip05}
        <BadgeCheck className="size-5 text-purple-500" />
      </span>
    )
  } else if (metadata?.content) {
    return (
      <span className="text-muted-foreground">
        @
        {metadata?.content.name || metadata?.pubkey.slice(0, 8)}
      </span>
    )
  }
}
