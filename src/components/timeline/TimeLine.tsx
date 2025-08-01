import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useState } from 'react'
import { useNostrEvents } from '@/lib/nostr/hooks/use-nostr-events'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import queryKeys from '@/lib/query-keys'
import TextNote from '../text-note/TextNote'

interface Props {
  pubkeys?: string[] | readonly string[]
}

export default function TimeLine({ pubkeys }: Props) {
  const parentReference = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  const virtualizer = useVirtualizer({
    count: 9999,
    getScrollElement: () => parentReference.current,
    estimateSize: () => 200,
    overscan: 3,
  })

  const isTop = (virtualizer.scrollOffset ?? 0) <= 100
  // スクロールが上部かつダイアログが開いていないときだけ自動更新
  const items = useNostrEvents(
    queryKeys.textnote(),
    TextNoteEventSchema,
    event => (pubkeys ? pubkeys.includes(event.pubkey) : true),
    !isPaused && isTop,
  )

  virtualizer.options.count = items.length

  return (
    <div ref={parentReference} className="h-full w-full overflow-y-auto">
      <div
        className="relative w-full p-2"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index]
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
