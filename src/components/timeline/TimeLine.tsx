import type { TextNoteEvent } from '@/lib/nostr/kinds/1'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useState } from 'react'
import { useNostrEvents } from '@/lib/nostr/hooks/use-nostr-events'
import TextNote from '../text-note/TextNote'

interface Props {
  pubkeys?: string[] | readonly string[]
}

export default function TimeLine({ pubkeys }: Props) {
  'use no memo'
  const parentRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: 9999,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 3,
  })

  const isTop = (virtualizer.scrollOffset ?? 0) <= 100
  // スクロールが上部かつダイアログが開いていないときだけ自動更新
  const items = useNostrEvents<TextNoteEvent>(
    _ => _.textnote(),
    event => (pubkeys ? pubkeys.includes(event.pubkey) : true),
    !isPaused && isTop,
  )

  virtualizer.options.count = items.length

  return (
    <div ref={parentRef} className="size-full overflow-y-auto">
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
