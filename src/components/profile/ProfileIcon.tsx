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
        src={metadata?.content.picture ?? undefined}
        loading="lazy"
        decoding="async"
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
