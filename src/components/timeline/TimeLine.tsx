import type { Event } from 'nostr-tools'
import { useQueryClient } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { fromUnixTime } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
import TimelineCard from './TimelineCard'

interface Props {
  pubkeys?: string[]
}

export default function TimeLine({ pubkeys }: Props) {
  const parentReference = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const getLatestItems = useCallback(() => {
    return queryClient
      .getQueryCache()
      .findAll({ queryKey: ['textnote'] })
      .map(query => query.state.data as Event)
      .filter((event): event is Event => {
        if (event?.created_at === undefined) {
          return false
        } else {
          return pubkeys && pubkeys.length > 0
            ? pubkeys.includes(event.pubkey)
            : true
        }
      })
      .sort((a, b) => {
        return fromUnixTime(b.created_at).getTime() - fromUnixTime(a.created_at).getTime()
      })
  }, [queryClient, pubkeys])

  const [items, setItems] = useState<Event[]>(() => getLatestItems())

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentReference.current,
    estimateSize: () => 200,
    overscan: 3,
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
      <div ref={parentReference} className="h-full w-full overflow-y-auto">
        <div
          className="relative w-full p-2"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const item = items[virtualItem.index]
            return (
              <div
                key={virtualItem.key}
                ref={virtualizer.measureElement}
                data-index={virtualItem.index}
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <TimelineCard
                  key={item.id}
                  item={item}
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
