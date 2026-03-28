import type { Event } from 'nostr-typedef'
import { and, eq, inArray, lte, useLiveInfiniteQuery } from '@tanstack/react-db'
import { useRouteContext } from '@tanstack/react-router'
import { useVirtualizer } from '@tanstack/react-virtual'
import { getUnixTime } from 'date-fns'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import TextNote from '../text-note/TextNote'

interface Props {
  pubkeys?: string[]
}

const PAGE_SIZE = 10

export default function TimeLine({ pubkeys }: Props) {
  const events = useRouteContext({ from: '/(app)', select: s => s.events })
  const parentRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useLiveInfiniteQuery(
    (q) => {
      let query = q
        .from({ event: events })
        .where(({ event }) => and(
          eq(event.kind, 1),
          lte(event.created_at, getUnixTime(new Date())),
        ))

      if (pubkeys !== undefined) {
        query = query.where(({ event }) => inArray(event.pubkey, pubkeys))
      }

      return query
        .orderBy(({ event }) => event.created_at, 'desc')
    },
    {
      pageSize: PAGE_SIZE,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === PAGE_SIZE ? allPages.length : undefined,
    },
    [pubkeys],
  )

  const virtualizer = useVirtualizer({
    count: data.length + (hasNextPage ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 5,
  })

  const isTop = (virtualizer.scrollOffset ?? 0) <= 100

  useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().at(-1)
    if (
      lastItem
      && lastItem.index >= data.length - 1
      && hasNextPage
      && !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [data, fetchNextPage, hasNextPage, isFetchingNextPage, virtualizer])

  const lastItemRef = useRef<Event[]>([])
  const items = useMemo(() => {
    if (isTop || isPaused) {
      if (lastItemRef.current.length <= PAGE_SIZE) {
        lastItemRef.current = data
      }
      return lastItemRef.current
    }
    lastItemRef.current = data
    return data
  }, [data, isTop, isPaused])

  return (
    <div ref={parentRef} className="size-full overflow-y-auto">
      <div
        className="relative w-full p-2"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const isLoaderRow = virtualItem.index > items.length - 1
          if (isLoaderRow) {
            // eslint-disable-next-line unicorn/no-null
            return null
          }
          const item = TextNoteEventSchema.parse(items[virtualItem.index])
          return (
            <div
              key={`${item?.id || 'loading'}-${virtualItem.index}`}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TextNote event={item} setTimelinePaused={setIsPaused} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
