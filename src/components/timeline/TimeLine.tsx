import type { Event } from 'nostr-tools'
import { useQueryClient } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { format, fromUnixTime } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'

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
              <div
                key={virtualItem.key}
                ref={virtualizer.measureElement}
                data-index={virtualItem.index}
                className="m-2 border p-2 break-all"
              >
                <div>
                  <p>{format(fromUnixTime(item.created_at), 'yyyy-MM-dd HH:mm')}</p>
                  <p>{item.content}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
