import type { MetadataEvent } from '@/lib/nostr/kinds/0'
import { Button } from '@/shadcn-ui/components/ui/button'
import ProfileIcon from './ProfileIcon'
import UserName from './UserName'

interface Props {
  metadata?: MetadataEvent
}

export default function Profile({ metadata }: Props) {
  const content = metadata?.content || {}
  const displayName = content?.display_name || content?.name || ''

  return (
    <div>
      <div className="bg-muted-foreground z-0 h-60">
        {content?.banner && (
          <img
            src={content.banner}
            alt="Banner"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <ProfileIcon className="m-2 -mt-15 size-30" metadata={metadata} />
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <div className="text-2xl">{displayName}</div>
            <div className="text-muted-foreground">
              <UserName metadata={metadata} />
            </div>
          </div>
          <Button disabled>Follow</Button>
        </div>
        <div>
          <p>{content?.about}</p>
        </div>
      </div>
    </div>
  )
}
