import type { Event } from 'nostr-tools'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { format, fromUnixTime } from 'date-fns'
import { Heart, MessageCircle, Repeat2, Share2, SmilePlus, Zap } from 'lucide-react'
import { metadataQuery } from '@/lib/nostr/kinds/0'
import { createPubkey } from '@/lib/nostr/nip19'
import useNostr from '@/lib/nostr/use-nostr'
import { Button } from '@/shadcn-ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn-ui/components/ui/card'
import ProfileIcon from '../profile/ProfileIcon'
import UserName from '../profile/UserName'

interface TimelineCardProps {
  item: Event
}

export default function TimelineCard({ item }: TimelineCardProps) {
  const { getQueryOption } = useNostr()
  const pubkey = createPubkey(item.pubkey)
  const { data: metadata } = useQuery(getQueryOption(metadataQuery, pubkey.decoded))

  const displayName = metadata?.content.display_name
    || metadata?.content.name
    || pubkey.encoded.slice(0, 8)

  return (
    <Card className="border p-2 break-all">
      <div className="flex gap-3">
        <Link to="/npub1{$id}" params={{ id: pubkey.routeId }}>
          <ProfileIcon metadata={metadata} className="size-16 flex-shrink-0" />
        </Link>
        <div className="min-w-0 flex-1">
          <CardHeader className="p-0 pt-2">
            <CardTitle>
              <Link to="/npub1{$id}" params={{ id: pubkey.routeId }}>
                {displayName}
              </Link>
            </CardTitle>
            <CardDescription className="flex justify-between text-sm">
              <Link to="/npub1{$id}" params={{ id: pubkey.routeId }}>
                <UserName metadata={metadata} />
              </Link>
              <div>
                {format(fromUnixTime(item.created_at), 'yyyy-MM-dd HH:mm')}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p>{item.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between p-0 pt-3">
            {[MessageCircle, Repeat2, Heart, SmilePlus, Zap, Share2].map(Icon =>
              (
                <Button key={Icon.displayName} variant="ghost" size="icon">
                  <Icon />
                </Button>
              ),
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}
