import type { Event } from 'nostr-tools'
import { useQueryClient } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { fromUnixTime } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
import TimelineCard from './TimelineCard'

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
              <TimelineCard
                key={item.id}
                ref={virtualizer.measureElement}
                item={item}
                index={virtualItem.index}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
