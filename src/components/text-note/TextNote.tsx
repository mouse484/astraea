import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { format, fromUnixTime } from 'date-fns'
import { Ellipsis } from 'lucide-react'
import { metadataQuery } from '@/lib/nostr/kinds/0'
import { createEvent, createPubkey } from '@/lib/nostr/nip19'
import useNostr from '@/lib/nostr/use-nostr'
import { Button } from '@/shadcn-ui/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn-ui/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shadcn-ui/components/ui/dropdown-menu'
import ProfileIcon from '../profile/ProfileIcon'
import UserName from '../profile/UserName'
import Footer from './footer/Footer'

interface Props {
  event: typeof TextNoteEventSchema.Type
}

export default function TextNote({ event }: Props) {
  const navigate = useNavigate()
  const { getQueryOption } = useNostr()
  const pubkey = createPubkey(event.pubkey)
  const { data: metadata } = useQuery(getQueryOption(metadataQuery, pubkey.decoded))

  const displayName = metadata?.content.display_name
    || metadata?.content.name
    || pubkey.encoded.slice(0, 8)

  return (
    <Card
      className="cursor-pointer border p-2 break-all"
      onClick={(mouseEvent) => {
        const target = mouseEvent.target as HTMLElement
        if (target.closest('a, button')) {
          return
        }

        const selection = globalThis.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          if (!range.collapsed) {
            return
          }
        }

        const nevent = createEvent({
          id: event.id,
          author: pubkey.decoded,
        })
        navigate({ to: '/nevent1{$id}', params: { id: nevent.routeId } })
      }}
    >
      <div className="flex gap-3">
        <Link from="/" params={{ id: pubkey.routeId }} to="/npub1{$id}">
          <ProfileIcon className="size-16 flex-shrink-0" metadata={metadata} />
        </Link>
        <div className="min-w-0 flex-1">
          <CardHeader className="p-0 pt-2">
            <CardTitle>
              <Link from="/" params={{ id: pubkey.routeId }} to="/npub1{$id}">
                {displayName}
              </Link>
            </CardTitle>
            <CardDescription className="flex justify-between text-sm">
              <Link from="/" params={{ id: pubkey.routeId }} to="/npub1{$id}">
                <UserName metadata={metadata} />
              </Link>
              <div>
                {format(fromUnixTime(event.created_at), 'yyyy-MM-dd HH:mm')}
              </div>
            </CardDescription>
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>TODO</DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="inline cursor-text select-text">{event.content}</p>
          </CardContent>
          <CardFooter className="p-0 pt-3">
            <Footer event={event} />
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}
