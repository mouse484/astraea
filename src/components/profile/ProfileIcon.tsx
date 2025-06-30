import type { MetadataEvent } from '@/lib/nostr/kinds/0'
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn-ui/components/ui/avatar'
import { Skeleton } from '@/shadcn-ui/components/ui/skeleton'

interface Props {
  metadata?: MetadataEvent
  className?: string
}

export default function ProfileIcon({ metadata, className }: Props) {
  return (
    <Avatar className={className}>
      <AvatarImage
        decoding="async"
        loading="lazy"
        src={metadata?.content.picture ?? undefined}
      />
      <AvatarFallback>
        {
          metadata?.pubkey
            ? metadata.pubkey.slice(0, 2).toUpperCase()
            : <Skeleton />
        }
      </AvatarFallback>
    </Avatar>
  )
}
