import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { format, fromUnixTime } from 'date-fns'
import { Ellipsis, Eye } from 'lucide-react'
import { useMemo, useState } from 'react'
import useNostr from '@/lib/nostr/hooks/use-nostr'
import { metadataQuery } from '@/lib/nostr/kinds/0'
import { createEvent, createPubkey } from '@/lib/nostr/nip19'
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
import { Skeleton } from '@/shadcn-ui/components/ui/skeleton'
import ProfileIcon from '../profile/ProfileIcon'
import UserName from '../profile/UserName'
import Footer from './footer/Footer'
import Replies from './Replies'
import TextNoteContent from './TextNoteContent'

interface Props {
  event: typeof TextNoteEventSchema.Type
  withReplies?: boolean
  isDisplayFooter?: boolean
  setTimelinePaused?: (paused: boolean) => void
}

export default function TextNote({
  event,
  withReplies,
  isDisplayFooter = true,
  setTimelinePaused,
}: Props) {
  const navigate = useNavigate()
  const { getQueryOption } = useNostr()
  const pubkey = createPubkey(event.pubkey)
  const { data: metadata } = useQuery(getQueryOption(metadataQuery, pubkey.decoded))

  const displayName = metadata?.content.display_name
    || metadata?.content.name
    || pubkey.encoded.slice(0, 8)

  const contentWarning = useMemo(
    () => event.tags.find(tag => tag[0] === 'content-warning'),
    [event.tags],
  )

  const [isContentWarningOverridden, setIsContentWarningOverridden] = useState(false)

  const shouldShowContentWarning = useMemo(() => {
    if (isContentWarningOverridden) return false
    return !!contentWarning
  }, [contentWarning, isContentWarningOverridden])

  return (
    <>
      <Card
        className="cursor-pointer border p-2 break-all"
        onClick={(mouseEvent) => {
          const target = mouseEvent.target as HTMLElement
          if (target.closest('a, button, textarea, input')) {
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
              {contentWarning && shouldShowContentWarning
                ? (
                    <div className="relative">
                      <Skeleton className="h-20" />
                      <Button
                        className={`
                          absolute top-1/2 left-1/2 -translate-x-1/2
                          -translate-y-1/2
                        `}
                        variant="outline"
                        onClick={() => {
                          setIsContentWarningOverridden(true)
                        }}
                      >
                        <Eye />
                        Show
                        {contentWarning[1] && (
                          <span className="text-muted-foreground text-xs">
                            (
                            {contentWarning[1]}
                            )
                          </span>
                        )}
                      </Button>
                    </div>
                  )
                : <TextNoteContent content={event.content} />}
            </CardContent>
            {isDisplayFooter && (
              <CardFooter className="p-0 pt-3">
                <Footer event={event} setTimelinePaused={setTimelinePaused} />
              </CardFooter>
            )}
          </div>
        </div>
      </Card>
      {withReplies && (<Replies id={event.id} />)}
    </>
  )
}
