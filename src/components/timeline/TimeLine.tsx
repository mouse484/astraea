import type { Event } from 'nostr-tools'
import { useQueryClient } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { format, fromUnixTime } from 'date-fns'
import { Heart, MessageCircle, Repeat2, Share2, SmilePlus, Zap } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback } from '@/shadcn-ui/components/ui/avatar'
import { Button } from '@/shadcn-ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn-ui/components/ui/card'

export default function TimeLine() {
  const parentReference = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const getLatestItems = useCallback(() => {
    return queryClient
      .getQueryCache()
      .findAll({ queryKey: ['textnote'] })
      .map(query => query.state.data as Event)
      .filter((event): event is Event =>
        event !== undefined
        && event !== null
        && event.created_at !== undefined,
      )
      .sort((a, b) => {
        return fromUnixTime(b.created_at).getTime() - fromUnixTime(a.created_at).getTime()
      })
  }, [queryClient])

  const [items, setItems] = useState<Event[]>(() => getLatestItems())

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentReference.current,
    estimateSize: () => 200,
  })

  const isTop = virtualizer.scrollOffset === 0
  const unsbscribe = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    if (!isTop) {
      return
    }
    unsbscribe.current = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey.includes('textnote')
        && (event.type === 'added' || event.type === 'updated')) {
        setItems(getLatestItems())
      }
    })

    return () => {
      unsbscribe.current?.()
      unsbscribe.current = undefined
    }
  }, [queryClient, getLatestItems, isTop])

  return (
    <>
      <div ref={parentReference} className="h-4/5 w-full overflow-y-auto">
        <div
          className="relative w-full p-2"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const item = items[virtualItem.index]
            return (
              <Card
                key={virtualItem.key}
                ref={virtualizer.measureElement}
                data-index={virtualItem.index}
                className="border p-2 break-all"
              >
                <div className="flex gap-3">
                  <Avatar className="size-14 flex-shrink-0">
                    <AvatarFallback>{item.pubkey.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardHeader className="p-0">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-base">{item.pubkey.slice(0, 5)}</span>
                        <CardDescription className="text-sm">
                          {format(fromUnixTime(item.created_at), 'yyyy-MM-dd HH:mm')}
                        </CardDescription>
                      </CardTitle>
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
          })}
        </div>
      </div>
    </>
  )
}
